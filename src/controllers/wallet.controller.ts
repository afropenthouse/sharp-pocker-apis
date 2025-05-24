import { catchAuthError } from "../middlewares/wrapper";
import prismaClient from "../prisma/pris-client";
import ResponseHandler from "../utils/response-handler";
import {
  createVirtualAccount,
  getAccountNumberDetail,
  getBankCodes,
  initiateBankTransfer,
} from "../services/flutterwave.services";
import {
    IInAppTransfer,
  IWalletDepositBody,
  IWithdrawFromWallet,
} from "../interfaces/wallet.interface";
import { bcryptCompare, bcryptHash } from "../utils/auth.utils";
import { IPinCreateBody } from "../interfaces/user.interface";
import { generateTransactionRef } from "../utils/transaction.utiles";
import {
  TRANSACTION_DESCRIPTION,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@prisma/client";

export const createVirtualAccountNumber = catchAuthError(
  async (req, res, next) => {
    const { bvn, pin }: IWalletDepositBody = req.body;

    const user = await prismaClient.user.findFirst({
      where: { id: req.user?.userId },
      include: { wallet: true },
    });

    if (!user) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "server error",
        code: 500,
      });
    }

    const userWallet = user.wallet;

    if (!userWallet) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "User wallet not found",
      });
    }

    if (userWallet?.virtualAccountNumber) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Virtual account number already created",
      });
    }

    if (!user.pin) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Pin has not yet been created",
      });
    }

    const isPinValid = await bcryptCompare({
      hashedPassword: user.pin,
      password: pin,
    });

    if (!isPinValid) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Supplied pin invalid",
      });
    }

    // create virtual account number
    const virtualAccountDetails = await createVirtualAccount({
      bvn,
      tx_ref: userWallet.walletRef,
      email: user.email,
      narration: user.firstName || "",
    });

    if (!virtualAccountDetails) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Error creating virtual account number",
      });
    }

    //update wallet with data
    const updatedWallet = await prismaClient.userWallet.update({
      where: { id: userWallet.id },
      data: {
        virtualAccountNumber: virtualAccountDetails.data.account_number,
        virtualAccountBankName: virtualAccountDetails.data.bank_name,
        virtualAccountCreatedAt: new Date(),
      },
      omit: {
        userId: true,
      },
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      message: "Virtual Account successfully created",
      data: updatedWallet,
    });
  }
);

export const createPin = catchAuthError(async (req, res, next) => {
  const { pin }: IPinCreateBody = req.body;

  const user = await prismaClient.user.findFirst({
    where: { id: req.user?.userId },
  });

  if (!user || user.hasCreatedPin) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Pin has already been created",
      code: 400,
    });
  }

  const hashedPin = await bcryptHash(pin);

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      pin: hashedPin,
      hasCreatedPin: true,
    },
  });

  return ResponseHandler.sendSuccessResponse({
    res,
    message: "Pin created successfully",
  });
});

export const getWalletInfo = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const count = req.query.count as string;
  const page = req.query.page as string;
  const limit = parseInt(count) || 10;
  const pageNumber = parseInt(page) || 1;
  const skip = (pageNumber - 1) * limit;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
  }
  const wallet = await prismaClient.userWallet.findFirst({
    where: { userId },
    omit: { userId: true },
  });
  if (!wallet) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Wallet not created yet, set up profile",
      status_code: "COMPLETE_PROFILE",
    });
  }
  const transactions = await prismaClient.transactions.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  return ResponseHandler.sendSuccessResponse({
    res,
    data: {
      total: transactions.length,
      page: pageNumber,
      limit,
      wallet: {
        ...wallet,
        transactions,
      },
    },
  });
});

export const getAllBanks = catchAuthError(async (req, res, next) => {
  const allBanks = await getBankCodes();
  if (!allBanks) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Service is temporally  unavailable",
      code: 500,
    });
  }
  return ResponseHandler.sendSuccessResponse({ res, data: allBanks });
});

export const withdrawToExternalBank = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;

  const { amount, bankCode, accountNumber }: IWithdrawFromWallet = req.body;

  if (!userId) {
    if (!userId) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "server error",
        code: 500,
      });
    }
  }

  const userWallet = await prismaClient.userWallet.findFirst({
    where: {
      userId,
    },
  });

  if (!userWallet) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Wallet not created yet, set up profile",
      status_code: "COMPLETE_PROFILE",
    });
  }

  if (userWallet.balance < amount) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Insufficient funds in wallet",
    });
  }

  //create venue transaction
  const transaction = await prismaClient.transactions.create({
    data: {
      txRef: generateTransactionRef(),
      status: TRANSACTION_STATUS.PENDING,
      userId,
      description: TRANSACTION_DESCRIPTION.OUTWARD_WITHDRAWAL,
      amount,
      type: TRANSACTION_TYPE.DEBIT,
    },
  });

  const paymentStatus = await initiateBankTransfer({
    accountNumber,
    bankCode,
    amount,
    tx_ref: transaction.txRef,
    narration: "withdrawal",
  });

  console.log(paymentStatus, "app-console");

  if (!paymentStatus) {
    await prismaClient.transactions.update({
      where: { id: transaction.id },
      data: { status: TRANSACTION_STATUS.FAILED },
    });

    return ResponseHandler.sendErrorResponse({
      res,
      error: "payment could not be completed, try again",
    });
  }

  await prismaClient.userWallet.update({
    where: { userId },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  return ResponseHandler.sendSuccessResponse({
    res,
    message: `payment of NGN ${amount} is been processed`,
  });
});

export const verifyAccountNumber = catchAuthError(async(req,res,next)=>{
    const {accountNumber,bankCode}:IWithdrawFromWallet = req.body

    const accountDetails = await getAccountNumberDetail({accountNumber,bankCode})

    if(!accountDetails){
        return ResponseHandler.sendErrorResponse({res,error:"Unable to verify account number"})
    }else{
        return ResponseHandler.sendSuccessResponse({res,data:accountDetails.data})
    }
})

export const inAppTransfer = catchAuthError(async(req,res,next)=>{
    const userId = req.user?.userId

    if(!userId){
        return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
    }

    const {email,amount,pin}:IInAppTransfer = req.body

    const recipient = await prismaClient.user.findFirst({
        where:{email},
        include:{wallet:true}
    })

    if(!recipient){
        return ResponseHandler.sendErrorResponse({res,error:"Username supplied invalid"})
    }

    if(recipient.id === userId){
        return ResponseHandler.sendErrorResponse({res,error:"You cannot send to yourself"})
    }

    const userWallet = await prismaClient.userWallet.findFirst({
        where:{userId},
        include:{user:true}
    })

    if(!userWallet){
        return ResponseHandler.sendErrorResponse({res,error:"Wallet has not been created"})
    }

    const userPin = userWallet.user?.pin
    if(!userPin){
        return ResponseHandler.sendErrorResponse({res,error:"No pin has been created"})
    }

    const isPinValid = await bcryptCompare({password:pin,hashedPassword:userPin})
    if(!isPinValid){
        return ResponseHandler.sendErrorResponse({res,error:"Pin supplied is invalid"})
    }
    const isAmountSendable = userWallet.balance >= amount

    if(!isAmountSendable){
        return ResponseHandler.sendErrorResponse({res,error:"Insufficient amount in balance"})
    }

    //If all validation passed, then we can make transaction

    //credit transaction for  recipient
    const creditTransaction = prismaClient.transactions.create({
        data:{
            txRef:generateTransactionRef(),
            amount,
            userId:recipient.id,
            type:"CREDIT",
            status:"SUCCESS",
            description: TRANSACTION_DESCRIPTION.IN_APP_TRANSFER,
        }
    })

    //debit transaction for user
    const debitTransaction = prismaClient.transactions.create({
        data:{
            txRef:generateTransactionRef(),
            amount,
            userId,
            description: TRANSACTION_DESCRIPTION.IN_APP_TRANSFER,
            type:"DEBIT",
            status:"SUCCESS"
        }
    })

    const recipientWallet = await prismaClient.userWallet.findUnique({
        where:{id:recipient.wallet?.id}
    })

    if(!recipientWallet){
        return ResponseHandler.sendErrorResponse({res,error:"Unable to initiate transfer to this recipient",code:500})
    }

    //Increase recipient wallet
    const creditWalletUpdate =  prismaClient.userWallet.update({
        where:{id:recipient.wallet?.id},
        data:{
            balance:{increment:amount}
        }
    })

    //reduce senders wallet
    const debitWalletUpdate  = prismaClient.userWallet.update({
        where:{id:userWallet.id},
        data:{
            balance:{decrement:amount}
        }
    })

    //Create  notification for users
    const notifications = prismaClient.notifications.createMany({
        data:[
            {
                userId,
                type:"WALLET",
                content:`You sent ${amount} to ${recipient.firstName}`
            },
            {
                userId:recipient.id,
                type:"WALLET",
                content:`${recipient.firstName} sent you ${amount}`
            },
        ]
    })

    await prismaClient.$transaction(
        [
        creditTransaction,
        debitTransaction,
        creditWalletUpdate,
        debitWalletUpdate,
        notifications
    ])

    return ResponseHandler.sendSuccessResponse({res,message:`${amount} successfully sent to ${recipient.firstName}`})
})
