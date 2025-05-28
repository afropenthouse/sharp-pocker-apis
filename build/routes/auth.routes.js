"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_validation_1 = require("../validations/auth.validation");
var auth_controller_1 = require("../controllers/auth.controller");
var verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
var authRoutes = express_1.default.Router();
authRoutes.route('/register').post(auth_validation_1.signUpValidation, auth_controller_1.userSignUp);
authRoutes.route('/verify').post(auth_validation_1.verifyEmailValidation, auth_controller_1.verifyUserEmail, auth_controller_1.signInUser);
authRoutes.route('/login').post(auth_validation_1.loginValidation, auth_controller_1.verifyLoginCredentials, auth_controller_1.signInUser);
authRoutes.route('/forgot-password').post(auth_validation_1.forgotPasswordValidation, auth_controller_1.forgotPassword);
authRoutes.route('/reset-password').post(auth_validation_1.passwordResetValidation, auth_controller_1.resetPassword);
authRoutes.route('/resend').post(auth_validation_1.resendVerificationCodeValidation, auth_controller_1.resendVerificationCode);
authRoutes.route('/token/refresh').post(verifyAccessToken_1.verifyAccessToken, auth_validation_1.refreshTokenValidation, auth_controller_1.refreshUserToken);
authRoutes.route('/logout').get(verifyAccessToken_1.verifyAccessToken, auth_controller_1.logOutUser);
exports.default = authRoutes;
