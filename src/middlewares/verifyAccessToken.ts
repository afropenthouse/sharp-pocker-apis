import { Response,NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { generateDeviceId } from '../utils/client-utils';
import prismaClient from '../prisma/pris-client';
import jwt from "jsonwebtoken";
import { IExpressRequest, ITokenData, IUserDetail } from '../interfaces/user.interface';



export async function verifyAccessToken  (req:IExpressRequest,res:Response,next:NextFunction):Promise<Response | void>{
    const accessToken = req.header('Authorization')?.split(' ')[1]; 
    
    if(!accessToken){
        return ResponseHandler.sendErrorResponse({res,error:"Invalid token supplied",status_code:"LOGIN_REDIRECT", code:401})
    }   
    try{
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET as string) as ITokenData
        //verify token supplied is valid
        if(!decoded.userId){
            return ResponseHandler.sendErrorResponse({res,error:"Invalid token supplied",code:401,status_code:"LOGIN_REDIRECT"})
        }

        const deviceFingerPrint = generateDeviceId(req)

        //verify device and access token are in session 
        const session = await prismaClient.session.findFirst({
            where:{
                userId:decoded.userId,accessToken,
                expiredAt:{
                    gt:new Date()
                }
            },
            include:{
                user:true
            }
        })
        if(!session){
            return ResponseHandler.sendErrorResponse({res,error:"session does not exist",code:401,status_code:"LOGIN_REDIRECT"})
        }
        const user = session.user
        req.user = {
            userId:user.id,
            email:user.email,
            firstName:user.firstName || ""  ,
            lastName:user.lastName || "",
            phoneNumber:user.phoneNumber || "",
            profileImage:user.profileImage || "",
            isMailVerified:user.isMailVerified,
            hasOnboarded:user.isOnboarded,
            referralCode:user.referralCode || ""
        }
        return next()

    }catch(err){
        return ResponseHandler.sendErrorResponse({res,error:"Invalid token supplied",code:401,status_code:"LOGIN_REDIRECT"})
    }
    
}