import jwt from "jsonwebtoken";
import { IEncodedUserTokenValue } from "../interfaces/user.interface";
import { Request } from "express"
import DeviceDetector from "node-device-detector";
import crypto from "crypto"
import prismaClient from "../prisma/pris-client";
import ResponseHandler from "./response-handler";

export const isDevelopment = ()=>{
    return process.env.APP_ENV === "DEV"
}

export const signAccessToken  = ({email,userId}:IEncodedUserTokenValue)=>{
    const isDev = isDevelopment()
    const accessToken = jwt.sign(
        {userId,email},
        process.env.JWT_SECRET as string,
        { expiresIn:isDev?"7d":"7d" }
    );
    return accessToken
}

export const signRefreshToken = ({userId}:{userId:string})=>{
    const isDev = isDevelopment()
    const refreshToken = jwt.sign(
        {userId},
        process.env.JWT_SECRET as string,
        { expiresIn:isDev?"30d":"30d" }
    );
    return refreshToken
}

export const generateDeviceId = (req:Request)=> {
    const userAgent =  req.header("user-agent") || req.headers["user-agent"] || ""
    //gets device objects
    const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500,
      });
    const device = detector.detect(userAgent)
      

    //device object is used to generate a crypto Id
    const deviceString = JSON.stringify(device)
    const hash = crypto.createHash('sha256').update(deviceString).digest("hex")

    return hash
    
}


  

export const generateReferralCode = async (): Promise<string> => {
    const generate = () =>
      Math.random().toString(36).substring(2, 8).toUpperCase();
  
    let code = generate();
    let exists = await prismaClient.user.findUnique({
      where: { referralCode: code },
    });
  
    // Retry until a unique code is generated
    while (exists) {
      code = generate();
      exists = await prismaClient.user.findUnique({
        where: { referralCode: code },
      });
    }
  
    return code;
  };
  