import { Request } from "express";


export interface ITokenData {
    userId: string;
    email: string;
}

export interface IUserDetail extends ITokenData{
   email: string
   phoneNumber: string
   firstName: string
   lastName: string
   profileImage: string
   isMailVerified: boolean
   referralCode: string
   hasOnboarded: boolean
}

export interface IExpressRequest extends Request {
    user?: IUserDetail
}

export interface IVerifyEmailBody {
    verificationId: string
    otpCode : string
}

export interface ISignUpBody {
    email: string
    phoneNumber?: string
    password: string
    referralId?: string
    firstName: string
    lastName: string
    isMailVerified: boolean
    hasOnboarded: boolean
    referralCode?: string
}

export interface IEncodedUserTokenValue{
    email: string
    userId: string
}

export interface ILoginBody{
    email: string
    password: string
}

export interface IRefreshTokenBody{
    refreshToken: string
}


export interface IForgotPasswordBody extends IVerifyEmailBody{
    password:string
}


export interface IPinCreateBody{
    pin: string
}