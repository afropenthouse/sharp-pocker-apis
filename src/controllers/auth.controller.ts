import ResponseHandler from "../utils/response-handler";
import prismaClient from "../prisma/pris-client"
import { catchAuthError, catchDefaultError } from "../middlewares/wrapper";
import { ForgotPasswordMail, SignUpMail,WelcomeMail } from "../services/mail.services";
import { bcryptCompare, bcryptHash, generateOTP } from "../utils/auth.utils";
import { ILoginBody, ISignUpBody, IVerifyEmailBody, IForgotPasswordBody, IRefreshTokenBody } from "../interfaces/user.interface";
import { setTimeInFuture } from "../utils/time.utils";
import { generateDeviceId, signAccessToken, signRefreshToken, generateReferralCode } from "../utils/token.utils";
import { generateWalletRef } from "../utils/wallet.utils";
import { ReferralAmount } from "../config/constants.config";
import { generateTransactionRef } from "../utils/transaction.utiles";
import { NOTIFICATION_TYPE, TRANSACTION_DESCRIPTION, TRANSACTION_TYPE } from "@prisma/client";

export const userSignUp = catchDefaultError(async (req, res, next) => {
  const { firstName, lastName, email, password, referralCode }: ISignUpBody = req.body;

  const userEmail = email.toLowerCase();

  // Check if user already exists and is verified
  const existingUser = await prismaClient.user.findFirst({
    where: { email: userEmail },
  });

  if (existingUser && existingUser.isMailVerified) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Email already in use.",
    });
  }

  const hashedPassword = await bcryptHash(password);
  let newUserId = "";
  let referredById: string | null = null;

  // If referral code is provided, find the user who owns it
  if (referralCode) {
    const referringUser = await prismaClient.user.findUnique({
      where: { referralCode },
    });
    

    if (!referringUser) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Invalid referral code.",
      });
    }

    referredById = referringUser.id;

    //create referral balance
    const walletUpdate =  prismaClient.userWallet.update({where:{userId:referringUser.id},data:{
      referralBalance:{increment:ReferralAmount}
  }})

    const transaction = prismaClient.transactions.create({
      data:{txRef:generateTransactionRef(),
      amount:ReferralAmount,
      userId:referringUser.id,
      description:TRANSACTION_DESCRIPTION.REFERRAL_BONUS,
      type:TRANSACTION_TYPE.CREDIT}
    })

    const notification =  prismaClient.notifications.create({data:{
      userId: referringUser.id,
      type: NOTIFICATION_TYPE.WALLET,
      content:`You referred ${firstName} ${lastName} to sharp pocket!`
  }
  })
  await prismaClient.$transaction([walletUpdate,transaction,notification])
  }

  // Create user if not already created
  if (!existingUser) {
    const newUser = await prismaClient.user.create({
      data: {
        email: userEmail,
        firstName,
        lastName,
        password: hashedPassword,
        referralCode: await generateReferralCode(), 
        referredById,
        wallet:{
          create:{
            walletRef:generateWalletRef()
          }
        }
      },
    });

    newUserId = newUser.id;
  } else {
    newUserId = existingUser.id;
  }

  // Generate OTP and send email
  const otpCode = generateOTP();

  await SignUpMail({
    to: email,
    otp: otpCode,
    name: `${firstName} ${lastName}`,
  });

  const otpObject = await prismaClient.verificationOTP.create({
    data: {
      otpCode,
      userId: newUserId,
      type: "MAIL_VERIFICATION",
      expiredTime: setTimeInFuture(Number(process.env.OTP_EXPIRY_MINUTE) || 10),
    },
  });

  return ResponseHandler.sendSuccessResponse({
    res,
    message: "Verification code sent to email.",
    data: { verificationId: otpObject.id },
  });
});

export const verifyUserEmail = catchAuthError(async(req,res,next)=>{

  const {verificationId,otpCode}:IVerifyEmailBody = req.body
  
  const otpObject = await prismaClient.verificationOTP.findFirst({
      where:{
          id:verificationId,type:"MAIL_VERIFICATION",otpCode,
          expiredTime:{
              gt:new Date()
          }
      },include:{
          user:true
      }
  })
  if (!otpObject){
      return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid or expired"})
  }

  if(otpObject.user.isMailVerified){
      return ResponseHandler.sendErrorResponse({res,error:"Email Already verified"})
  }
  //if OTP is valid, verify user
  
  await prismaClient.user.update({
      where:{id:otpObject.userId},
      data:{isMailVerified:true}
  })

  await prismaClient.verificationOTP.deleteMany({
      where:{
          type:"MAIL_VERIFICATION",userId:otpObject.userId
      }
  })
  const newUser = otpObject.user

  req.user = {
      userId:newUser.id,
      email:newUser.email,
      firstName:newUser.firstName || "",
      lastName:newUser.lastName || "",
      phoneNumber:newUser.phoneNumber || "",
      profileImage:newUser.profileImage || "",
      isMailVerified:newUser.isMailVerified,
      hasOnboarded:newUser.isOnboarded,
      referralCode:newUser.referralCode || ""
  }
  return next()

})  

export const signInUser = catchAuthError(async(req,res,next)=>{
  const user = req.user
  if(!user){
      return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
  }
  const accessToken = signAccessToken({userId:user.userId,email:user.email})
  const refreshToken = signRefreshToken({userId:user.userId})
  const deviceFingerPrint = generateDeviceId(req)

  const isSessionExisting = await prismaClient.session.findFirst({
      where:{
          userId:user.userId,deviceFingerPrint
      }
  })

  const sessionDuration = Number(process.env.SESSION_DURATION)
  if(isSessionExisting){
      await prismaClient.session.update({
          where:{
              id:isSessionExisting.id
          },
          data:{
              accessToken,
              refreshToken,
              expiredAt:setTimeInFuture(sessionDuration)
          }
      })
  }else{
      await prismaClient.session.create({
          data:{
              userId:user.userId,
              accessToken,refreshToken,deviceFingerPrint,
              expiredAt:setTimeInFuture(sessionDuration)
          }
      })
  }

  if(!user.hasOnboarded){
    await WelcomeMail({to:user.email,name:`${user.firstName} ${user.lastName}`})
    await prismaClient.user.update({
      where:{id:user.userId},
      data:{isOnboarded:true}
    })
  }

  return ResponseHandler.sendSuccessResponse({res, code:200, data:{
      accessToken,
      refreshToken,
      user,
      isVerified: user.isMailVerified,
      onboarded: user.hasOnboarded
  }})
})

export const verifyLoginCredentials = catchAuthError(async(req,res,next)=>{
  const {email,password}:ILoginBody = req.body

  const loginUser = await prismaClient.user.findFirst({
          where:{email},
  })

  if(!loginUser){
      return ResponseHandler.sendErrorResponse({res,error:"Invalid sign In credentials"})
  }

  if(!loginUser.isMailVerified){
      return ResponseHandler.sendErrorResponse({res,error:"Email not verified",status_code:"EMAIL_REDIRECT"})
  }



  const isPasswordValid = await bcryptCompare({password,hashedPassword:loginUser.password})

  if(!isPasswordValid){
      return ResponseHandler.sendErrorResponse({res,error:"Invalid sign In credentials"})
  }
  
  req.user = {
      userId:loginUser.id,
      email:loginUser.email,
      firstName:loginUser.firstName || "",
      lastName:loginUser.lastName || "",
      phoneNumber:loginUser.phoneNumber || "",
      profileImage:loginUser.profileImage || "",
      isMailVerified:loginUser.isMailVerified,
      hasOnboarded:loginUser.isOnboarded,
      referralCode:loginUser.referralCode || ""
  }
  return next()
})

export const forgotPassword = catchDefaultError(async(req,res,next)=>{
  const {email}:ISignUpBody = req.body
  
  const user = await prismaClient.user.findFirst({
      where:{email}
  })
  if(!user){
      return ResponseHandler.sendErrorResponse({res,error:"User does not exist in the application"})
  }

  const otpCode = generateOTP()

  const otpObject = await prismaClient.verificationOTP.create({
      data:{
          otpCode,
          type:"RESET_PASSWORD",
          userId:user.id,
          expiredTime:setTimeInFuture(Number(process.env.OTP_EXPIRY_MINUTE))
      }
  })
    await ForgotPasswordMail({to:email,otp:otpCode})
  return ResponseHandler.sendSuccessResponse({res,message:"Reset password verification has been sent to email",data:{
      verificationId:otpObject.id
  }})
})

export const resetPassword = catchDefaultError(async(req,res,next)=>{

  const {verificationId,otpCode,password}:IForgotPasswordBody = req.body
  
  const otpObject = await prismaClient.verificationOTP.findFirst({
      where:{
          id:verificationId,type:"RESET_PASSWORD",otpCode,
          expiredTime:{
              gt:new Date()
          }
      },include:{
          user:true
      }
  })
  if (!otpObject){
      return ResponseHandler.sendErrorResponse({res,error:"OTP supplied invalid or expired"})
  }
  
  const hashedPassword = await bcryptHash(password)

  await prismaClient.user.update({
      where:{id:otpObject.userId},
      data:{isMailVerified:true,password:hashedPassword}
  })

  await prismaClient.verificationOTP.deleteMany({
      where:{
          type:"RESET_PASSWORD",userId:otpObject.userId
      }
  })

  return ResponseHandler.sendSuccessResponse({res,message:"Password has been successfully reset"})

})

export const refreshUserToken = catchAuthError(async(req,res,next)=>{
  const user = req.user

  if(!user){
      return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
  }

  const {email,userId} = user
  const newAccessToken = signAccessToken({email,userId})

  const {refreshToken}:IRefreshTokenBody = req.body 

  const deviceFingerPrint = generateDeviceId(req)

  const userSession = await prismaClient.session.findFirst({
      where:{
          userId,deviceFingerPrint,refreshToken
      }
  })

  if(!userSession){
      return ResponseHandler.sendErrorResponse({res,code:400,error:"Token invalid or expired",status_code:"LOGIN_REDIRECT"})
  }

  const sessionDuration = Number(process.env.SESSION_DURATION)

  await prismaClient.session.update({
      where:{id:userSession.id},
      data:{
          accessToken:newAccessToken,
          expiredAt:setTimeInFuture(sessionDuration)
  }})
  
  return ResponseHandler.sendSuccessResponse({res,data:{
      accessToken:newAccessToken,refreshToken,user:req.user
      }
  
  })
})  

export const logOutUser = catchAuthError(async(req,res,next)=>{
  const user = req.user

  if(!user){
      return ResponseHandler.sendErrorResponse({res,error:"server error",code:500})
  }
  
  const {userId} = user

  const deviceFingerPrint = generateDeviceId(req)

  const userSession = await prismaClient.session.findFirst({
      where:{
          userId,deviceFingerPrint
      }
  })

  if(!userSession){
      return ResponseHandler.sendErrorResponse({res,code:500,error:"server error"})
  }

  await prismaClient.session.delete({
      where:{
          id:userSession.id
      },
  })
  return ResponseHandler.sendSuccessResponse({res})
})

export const resendVerificationCode = catchDefaultError(async (req, res, next) => {
  const { email, verificationType }: { email: string; verificationType: 'MAIL_VERIFICATION' | 'RESET_PASSWORD' } = req.body;

  const userEmail = email.toLowerCase();
  
  // Validate verificationType
  if (!verificationType || !['MAIL_VERIFICATION', 'RESET_PASSWORD'].includes(verificationType)) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Invalid verification type. Must be MAIL_VERIFICATION or RESET_PASSWORD"
    });
  }

  const existingUser = await prismaClient.user.findFirst({
    where: { email: userEmail },
  });

  if (!existingUser) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "User not found.",
    });
  }

  // Handle different verification types
  if (verificationType === 'MAIL_VERIFICATION') {
    // Check if already verified for email verification
    if (existingUser.isMailVerified) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Email is already verified.",
      });
    }
  }
  // For RESET_PASSWORD, we don't check if email is verified since they might want to reset password

  // Generate OTP
  const otpCode = generateOTP();

  // Send appropriate email based on verification type
  if (verificationType === 'MAIL_VERIFICATION') {
    await SignUpMail({
      to: email,
      otp: otpCode,
      name: `${existingUser.firstName} ${existingUser.lastName}`,
    });
  } else if (verificationType === 'RESET_PASSWORD') {
    await ForgotPasswordMail({
      to: email,
      otp: otpCode,
    });
  }

  // Clean up any existing OTPs of the same type for this user
  await prismaClient.verificationOTP.deleteMany({
    where: {
      userId: existingUser.id,
      type: verificationType,
    },
  });

  // Store new OTP in DB
  const otpObject = await prismaClient.verificationOTP.create({
    data: {
      otpCode,
      userId: existingUser.id,
      type: verificationType,
      expiredTime: setTimeInFuture(Number(process.env.OTP_EXPIRY_MINUTE) || 10),
    },
  });

  // Return appropriate message based on verification type
  const message = verificationType === 'MAIL_VERIFICATION' 
    ? "Verification code resent to email." 
    : "Password reset code resent to email.";

  return ResponseHandler.sendSuccessResponse({
    res,
    message,
    data: { verificationId: otpObject.id },
    code: 200
  });
});
