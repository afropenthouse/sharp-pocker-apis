import { NOTIFICATION_TYPE, TRANSACTION_DESCRIPTION } from "@prisma/client"
import { IFlwTransactionVerificationData, WebhookDataProd } from "../interfaces/flutterwave.interface"
import prismaClient from "../prisma/pris-client"
import { generateTransactionRef, isRefWalletRef } from "../utils/transaction.utiles"


export const depositIntoWallet = async(dataFromWebhook: WebhookDataProd) => {
    const {status,tx_ref:txRef,amount} = dataFromWebhook.data

    if(status !== "successful"){
        return
    }

    const userWallet = await prismaClient.userWallet.findFirst({
        where:{walletRef:txRef}
    })

    if(!userWallet){
        throw Error("Invalid ref passed")
    }

    //update user wallet
    await prismaClient.userWallet.update({
        where:{id:userWallet.id},
        data:{
            balance:{
                increment:amount,
            },
            lastDepositedAt: new Date()
        }
    })

    //create deposit transaction for user

    await prismaClient.transactions.create({
        data:{
            txRef:generateTransactionRef(),
            type:'CREDIT',
            amount,
            userId:userWallet.userId,
            description:TRANSACTION_DESCRIPTION.WALLET_TOPUP,
            status:"SUCCESS",
        }
    })

    await prismaClient.notifications.create({
        data:{
            userId:userWallet.userId,
            type:NOTIFICATION_TYPE.WALLET_TOPUP,
            content:`You have successfully deposited ${amount} into your wallet`
        }
    })
}

export const channelWebHookData = async(dataFromWebhook: WebhookDataProd, flwVerification?: IFlwTransactionVerificationData) => {

    console.log("channeled after response")
    //* Begin request computations
    const txRef = dataFromWebhook.data.tx_ref;
    
    // Check for corresponding transaction on the db
    const isWalletRef = isRefWalletRef(txRef)

    const transaction = await prismaClient.transactions.findFirst({
        where: {txRef}
    })
    
    // If none, just return
    if (!transaction && !isWalletRef) {
        throw new Error("Transaction not found in the database")
    }    

    if(isWalletRef){
        //handle wallet transactions
        depositIntoWallet(dataFromWebhook)
        return
    }
    //? Now run different transactions depending on transaction type/description
    if(transaction && transaction.description){
        switch (transaction.description) {
            
        }
    }else{
        console.log("Transaction description not found")
        return
    }
}