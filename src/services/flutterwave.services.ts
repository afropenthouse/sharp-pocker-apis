import  { AxiosError, AxiosResponse } from "axios";
import { IFlwTransactionResponse, IFlwTransferResponse, IFlwVirtualAccountCreationResponse } from "../interfaces/flutterwave.interface";
import { stringifyError } from "../utils/auth.utils";
import prismaClient from "../prisma/pris-client";
import { IPaymentInformation } from "../interfaces/flutterwave.interface";
import flwRequest from "../config/flutterwave.config";


export const generatePaymentLink = async (data:IPaymentInformation)=>{
    const redirect_url = data.redirectUrl || 'https://utilourapp-z36b.vercel.app/dashboard'
    const title = data.description || "Utilour Payments"
    const body = {
        tx_ref: data.tx_ref,
        amount:`${data.amount}`,
        currency:data.currency,
        redirect_url,
        meta: {
            product:data.product,
            productId:data.productId,
            userId:data
        },
        customer: {
            email:data.user.email,
            phonenumber: "",
            name: `${data.user.firstName} ${data.user.lastName}`
        },
        customizations: {
            title,
            logo: "https://utilourapp-z36b.vercel.app/_next/static/media/utilourWhitelogo.2de895aa.svg"
        }
        
    }
    try{
        const response = await flwRequest.post("/payments",body)
        if(response.data){
            console.log("=======================================================");
            console.log(response.data);
            console.log("=======================================================");
            return response.data
        }else{return null}
    }
    catch(err){
        const errorString = stringifyError(err)
        await prismaClient.errorLogs.create({
            data:{
                logs:errorString,
                txRef:data.tx_ref
            }
        })
        return null
    }
}

export async function flwTransactionVerification ({txRef}:{txRef:string}){
    const flwVerifyEndpoint  = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`
    try{
        const {data} = await flwRequest.get(flwVerifyEndpoint) as AxiosResponse<IFlwTransactionResponse>
        if(data.status !== 'success'){
            return null
        }else
        return data.data
    }catch(err){
        const errorString = stringifyError(err)
        await prismaClient.errorLogs.create({
            data:{
                txRef:txRef || "",logs:errorString
            }
        })
        console.log(errorString)
        return null
    }
}

export const createVirtualAccount = async (
    {bvn,email,tx_ref,narration}:
    {bvn:string,email:string,tx_ref:string,narration:string}) => {

    //narration passed would be username
    //we can also use the username as the first name of the user account in flutterwave

    const flwVirtualEndpoint = 'https://api.flutterwave.com/v3/virtual-account-numbers'

    const isDev = process.env.APP_ENV === "DEV"
    //for testing use flutterwave test bvn 

    const userBvn = isDev?'22123456789':bvn

    const body = {
        email,bvn:userBvn,currency:"NGN",tx_ref,is_permanent:true,narration,
        firstname:narration
    }

    try{
        const response = await flwRequest.post(flwVirtualEndpoint,body) as AxiosResponse<IFlwVirtualAccountCreationResponse>
        console.log(response.data)
        return response.data
    }catch(err:any){
        const log = stringifyError(err)
        console.log(err?.message,err)
        await prismaClient.errorLogs.create({data:{logs:log,txRef:tx_ref}})
        return null
    }
}

export const initiateBankTransfer =  (async (
    {accountNumber,bankCode,narration,amount,tx_ref}:
    {accountNumber:string,bankCode:string,narration:string,amount:number,tx_ref:string}
    )=>{
    
    const flwTransferEndpoint  = "https://api.flutterwave.com/v3/transfers"

    const body = {
        account_bank: bankCode,
        account_number: accountNumber,
        amount,
        // narration,
        currency: "NGN",
        reference:tx_ref,
        debit_currency:"NGN"
    }

    try{
        const response = await flwRequest.post(flwTransferEndpoint,body) as AxiosResponse<IFlwTransferResponse>
        return response.data
    }catch(err){
        const log = stringifyError(err)
        const errs:AxiosError = err as AxiosError
        console.log(errs?.response?.data)
        await prismaClient.errorLogs.create({data:{logs:log,txRef:tx_ref}})
        return null
    }
})

export const getBankCodes = async()=>{

    const reqUrl = "https://api.flutterwave.com/v3/banks/NG"
    try{
        const response = await flwRequest.get(reqUrl)
        return response.data
    }catch(err){
        return null
    }
}

export const getAccountNumberDetail = async ({accountNumber,bankCode}:{accountNumber:string,bankCode:string})=>{

    const reqUrl = "https://api.flutterwave.com/v3/accounts/resolve"

    const reqBody = {
        account_number: accountNumber,
        account_bank: bankCode     
    }

    try{
        const response = await flwRequest.post(reqUrl,reqBody)
        return response.data
    }    
    catch(err){
        return null
    }
}

export const verifyTransferReference = async({transferId}:{transferId:number})=>{
    const requestUrl = `https://api.flutterwave.com/v3/transfers/${transferId}`
    try{
        const response = await flwRequest.get(requestUrl)
        console.log(response.data)
        if(response.data?.data?.status === "SUCCESSFUL"){
            return true
        }else{
            return false
        }
    }  
    catch(err){
        return false
    } 
}