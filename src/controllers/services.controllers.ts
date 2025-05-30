import { BILL_STATUS, NOTIFICATION_TYPE, SERVICE_TYPE, TRANSACTION_STATUS } from "@prisma/client";
import { TRANSACTION_DESCRIPTION } from "@prisma/client";
import { TRANSACTION_TYPE } from "@prisma/client";
import { IWithdrawFromWallet } from "../interfaces/wallet.interface";
import { catchAuthError } from "../middlewares/wrapper";
import prismaClient from "../prisma/pris-client";
import {
  getAirtimeOptions,
  getCableOptions,
  getElectricityOptions,
  getDataOptions,
  buyAirtime,
  buyCableTv,
  buyData,
  buyElectricity,
  verifySmartCard,
  verifyElectricity
} from "../services/cashwyre.services";
import ResponseHandler from "../utils/response-handler";
import { generateTransactionRef } from "../utils/transaction.utiles";

export const getAirtimeOption = catchAuthError(async (req, res, next) => {
  const airtimeOptions = await getAirtimeOptions();
  if (!airtimeOptions) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Service is temporally  unavailable",
      code: 500,
    });
  }
  return ResponseHandler.sendSuccessResponse({
    res,
    data: airtimeOptions.data,
  });
});

export const getCableOption = catchAuthError(async (req, res, next) => {
  const cableOptions = await getCableOptions();
  if (!cableOptions) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Service is temporally  unavailable",
      code: 500,
    });
  }
  return ResponseHandler.sendSuccessResponse({ res, data: cableOptions.data });
});

export const getElectricityOption = catchAuthError(async (req, res, next) => {
  const electricityOptions = await getElectricityOptions();
  if (!electricityOptions) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Service is temporally  unavailable",
      code: 500,
    });
  }
  return ResponseHandler.sendSuccessResponse({
    res,
    data: electricityOptions.data,
  });
});

export const getDataOption = catchAuthError(async (req, res, next) => {
  const dataOptions = await getDataOptions();
  if (!dataOptions) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Service is temporally  unavailable",
      code: 500,
    });
  }
  return ResponseHandler.sendSuccessResponse({ res, data: dataOptions.data });
});

export const buyAirtimeController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { amount, network, phoneNumber } = req.body;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
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

  const airtime = await buyAirtime({ Network: network, PhoneNumber: phoneNumber, Amount: amount });
  console.log(`cashwyre response: ${JSON.stringify(airtime)}`)
 if (airtime.success){
  await prismaClient.userWallet.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });
  await prismaClient.transactions.create({
    data: {
      txRef: generateTransactionRef(),
      status: TRANSACTION_STATUS.SUCCESS,
      userId,
      description: TRANSACTION_DESCRIPTION.BILL_PAYMENT,
      amount,
      type: TRANSACTION_TYPE.DEBIT,
      billTransaction: {
        create: {
          serviceType: SERVICE_TYPE.AIRTIME,
          provider: network,
          phoneNumber,
          status: BILL_STATUS.SUCCESS,
          amount,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  }); 
  await prismaClient.notifications.create({
    data: {
      userId,
      content: `Airtime purchase of ${amount} to ${phoneNumber} was successful`,
      type: NOTIFICATION_TYPE.BILL_PAYMENT,
    },
  });
  return ResponseHandler.sendSuccessResponse({ res, data: airtime.data });
 } else {
  return ResponseHandler.sendErrorResponse({
    res,
    error: "airtime purchase failed",
   });
 }
});

export const buyCableTvController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { customerName, providerCode, providerPlanCode, smartCardNumber, amount } = req.body;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
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

  const cableTv = await buyCableTv({ CustomerName: customerName, ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, SmartCardNumber: smartCardNumber });
  if (cableTv.success){
    await prismaClient.userWallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
    await prismaClient.transactions.create({
      data: {
        txRef: generateTransactionRef(),
        status: TRANSACTION_STATUS.SUCCESS,
        userId,
        description: TRANSACTION_DESCRIPTION.BILL_PAYMENT,  
        amount,
        type: TRANSACTION_TYPE.DEBIT,
        billTransaction: {
          create: {
            serviceType: SERVICE_TYPE.CABLE,
            provider: providerCode,
            status: BILL_STATUS.SUCCESS,
            amount,
            user: {
              connect: {
                id: userId,
              },  
            },
          },
        },
      },
    });
    await prismaClient.notifications.create({
      data: {
        userId,
        content: `Cable TV purchase of ${amount} to ${smartCardNumber} was successful`,
        type: NOTIFICATION_TYPE.BILL_PAYMENT,
      },
    });
    return ResponseHandler.sendSuccessResponse({ res, data: cableTv.data });
  } else {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "cable tv purchase failed",
    });
  }
}); 

export const buyDataController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { amount, network, phoneNumber, providerPlanCode } = req.body;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
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

  const data = await buyData({ Network: network, PhoneNumber: phoneNumber, ProviderPlanCode: providerPlanCode });
  console.log(`cashwyre response: ${JSON.stringify(data)}`)
  if (data.success){
    await prismaClient.userWallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
    await prismaClient.transactions.create({
      data: {
        txRef: generateTransactionRef(),
        status: TRANSACTION_STATUS.SUCCESS,
        userId,
        description: TRANSACTION_DESCRIPTION.BILL_PAYMENT,
        amount,
        type: TRANSACTION_TYPE.DEBIT,
        billTransaction: {
          create: {
            serviceType: SERVICE_TYPE.DATA,
            provider: network,
            status: BILL_STATUS.SUCCESS,
            amount,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
    await prismaClient.notifications.create({
      data: {
        userId,
        content: `Data purchase of ${amount} to ${phoneNumber} was successful`,
        type: NOTIFICATION_TYPE.BILL_PAYMENT,
      },
    });
    return ResponseHandler.sendSuccessResponse({ res, data: data.data });
  } else {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "data purchase failed",
    });
  }
});

export const buyElectricityController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { amount, providerCode, providerPlanCode, meterNumber, customerName } = req.body;

  if (!userId) {  
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
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

  const electricity = await buyElectricity({ ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, MeterNumber: meterNumber, Amount: amount, CustomerName: customerName });
  console.log(`cashwyre response: ${JSON.stringify(electricity)}`)
  if (electricity.success){
    await prismaClient.userWallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
    await prismaClient.transactions.create({
      data: {
        txRef: generateTransactionRef(),
        status: TRANSACTION_STATUS.SUCCESS,
        userId,
        description: TRANSACTION_DESCRIPTION.BILL_PAYMENT,
        amount,
        type: TRANSACTION_TYPE.DEBIT,
        billTransaction: {
          create: {
            serviceType: SERVICE_TYPE.ELECTRICITY,
            provider: providerCode,
            status: BILL_STATUS.SUCCESS,
            amount,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
    await prismaClient.notifications.create({ 
      data: {
        userId,
        content: `Electricity purchase of ${amount} to ${meterNumber} was successful`,
        type: NOTIFICATION_TYPE.BILL_PAYMENT,
      },
    });
    return ResponseHandler.sendSuccessResponse({ res, data: electricity.data });
  } else {
    return ResponseHandler.sendErrorResponse({
      res,
      error: electricity.message,
    });
  }
});  

export const verifySmartCardController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { smartCardNumber, providerCode, providerPlanCode } = req.body;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
  }

  const smartCard = await verifySmartCard({ SmartCardNumber: smartCardNumber, ProviderCode: providerCode, ProviderPlanCode: providerPlanCode });
  console.log(`cashwyre response: ${JSON.stringify(smartCard)}`)
  if (smartCard.success){
    return ResponseHandler.sendSuccessResponse({ res, data: smartCard.data });
  } else {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "smart card verification failed",
    });
  }
});

export const verifyElectricityController = catchAuthError(async (req, res, next) => {
  const userId = req.user?.userId;
  const { providerCode, providerPlanCode, meterNumber } = req.body;

  if (!userId) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "server error",
      code: 500,
    });
  }

      const electricity = await verifyElectricity({ ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, MeterNumber: meterNumber });
  console.log(`cashwyre response: ${JSON.stringify(electricity)}`)
  if (electricity.success){
    return ResponseHandler.sendSuccessResponse({ res, data: electricity.data });
  } else {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "electricity verification failed",
    });
  }
});