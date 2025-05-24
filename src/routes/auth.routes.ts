import express from "express"
import { forgotPasswordValidation, loginValidation, passwordResetValidation, refreshTokenValidation, resendVerificationCodeValidation, signUpValidation, verifyEmailValidation } from "../validations/auth.validation"
import { forgotPassword, logOutUser, refreshUserToken, resendVerificationCode, resetPassword, signInUser, userSignUp, verifyLoginCredentials,verifyUserEmail } from "../controllers/auth.controller"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"

const authRoutes = express.Router()

authRoutes.route('/register').post(signUpValidation,userSignUp)
authRoutes.route('/verify').post(verifyEmailValidation,verifyUserEmail,signInUser)

authRoutes.route('/login').post(loginValidation,verifyLoginCredentials,signInUser)
authRoutes.route('/forgot-password').post(forgotPasswordValidation,forgotPassword)
authRoutes.route('/reset-password').post(passwordResetValidation,resetPassword)
authRoutes.route('/resend').post(resendVerificationCodeValidation,resendVerificationCode)




authRoutes.route('/token/refresh').post(verifyAccessToken,refreshTokenValidation,refreshUserToken)
authRoutes.route('/logout').get(verifyAccessToken,logOutUser)

export default authRoutes