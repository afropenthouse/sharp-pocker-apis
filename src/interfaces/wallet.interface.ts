export interface IWalletDepositBody{
    bvn: string
    pin:string
} 

export interface IInAppTransfer{
    email: string
    amount: number
    pin: string
}

export interface IWithdrawFromWallet{
    amount:number
    bankCode:string,
    accountNumber:string
}