"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationCode = exports.logOutUser = exports.refreshUserToken = exports.resetPassword = exports.forgotPassword = exports.verifyLoginCredentials = exports.signInUser = exports.verifyUserEmail = exports.userSignUp = void 0;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var wrapper_1 = require("../middlewares/wrapper");
var mail_services_1 = require("../services/mail.services");
var auth_utils_1 = require("../utils/auth.utils");
var time_utils_1 = require("../utils/time.utils");
var token_utils_1 = require("../utils/token.utils");
var wallet_utils_1 = require("../utils/wallet.utils");
var constants_config_1 = require("../config/constants.config");
var transaction_utiles_1 = require("../utils/transaction.utiles");
var client_1 = require("@prisma/client");
exports.userSignUp = (0, wrapper_1.catchDefaultError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, email, password, referralCode, userEmail, existingUser, hashedPassword, newUserId, referredById, referringUser, walletUpdate, transaction, notification, newUser, _b, _c, otpCode, otpObject;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password, referralCode = _a.referralCode;
                userEmail = email.toLowerCase();
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: userEmail },
                    })];
            case 1:
                existingUser = _f.sent();
                if (existingUser && existingUser.isMailVerified) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Email already in use.",
                        })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptHash)(password)];
            case 2:
                hashedPassword = _f.sent();
                newUserId = "";
                referredById = null;
                if (!referralCode) return [3 /*break*/, 5];
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: { referralCode: referralCode },
                    })];
            case 3:
                referringUser = _f.sent();
                if (!referringUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Invalid referral code.",
                        })];
                }
                referredById = referringUser.id;
                walletUpdate = pris_client_1.default.userWallet.update({ where: { userId: referringUser.id }, data: {
                        referralBalance: { increment: constants_config_1.ReferralAmount }
                    } });
                transaction = pris_client_1.default.transactions.create({
                    data: { txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                        amount: constants_config_1.ReferralAmount,
                        userId: referringUser.id,
                        description: client_1.TRANSACTION_DESCRIPTION.REFERRAL_BONUS,
                        type: client_1.TRANSACTION_TYPE.CREDIT }
                });
                notification = pris_client_1.default.notifications.create({ data: {
                        userId: referringUser.id,
                        type: client_1.NOTIFICATION_TYPE.WALLET,
                        content: "You referred ".concat(firstName, " ").concat(lastName, " to sharp pocket!")
                    }
                });
                return [4 /*yield*/, pris_client_1.default.$transaction([walletUpdate, transaction, notification])];
            case 4:
                _f.sent();
                _f.label = 5;
            case 5:
                if (!!existingUser) return [3 /*break*/, 8];
                _c = (_b = pris_client_1.default.user).create;
                _d = {};
                _e = {
                    email: userEmail,
                    firstName: firstName,
                    lastName: lastName,
                    password: hashedPassword
                };
                return [4 /*yield*/, (0, token_utils_1.generateReferralCode)()];
            case 6: return [4 /*yield*/, _c.apply(_b, [(_d.data = (_e.referralCode = _f.sent(),
                        _e.referredById = referredById,
                        _e.wallet = {
                            create: {
                                walletRef: (0, wallet_utils_1.generateWalletRef)()
                            }
                        },
                        _e),
                        _d)])];
            case 7:
                newUser = _f.sent();
                newUserId = newUser.id;
                return [3 /*break*/, 9];
            case 8:
                newUserId = existingUser.id;
                _f.label = 9;
            case 9:
                otpCode = (0, auth_utils_1.generateOTP)();
                return [4 /*yield*/, (0, mail_services_1.SignUpMail)({
                        to: email,
                        otp: otpCode,
                        name: "".concat(firstName, " ").concat(lastName),
                    })];
            case 10:
                _f.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTP.create({
                        data: {
                            otpCode: otpCode,
                            userId: newUserId,
                            type: "MAIL_VERIFICATION",
                            expiredTime: (0, time_utils_1.setTimeInFuture)(Number(process.env.OTP_EXPIRY_MINUTE) || 10),
                        },
                    })];
            case 11:
                otpObject = _f.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        message: "Verification code sent to email.",
                        data: { verificationId: otpObject.id },
                    })];
        }
    });
}); });
exports.verifyUserEmail = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verificationId, otpCode, otpObject, newUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, verificationId = _a.verificationId, otpCode = _a.otpCode;
                return [4 /*yield*/, pris_client_1.default.verificationOTP.findFirst({
                        where: {
                            id: verificationId, type: "MAIL_VERIFICATION",
                            otpCode: otpCode,
                            expiredTime: {
                                gt: new Date()
                            }
                        }, include: {
                            user: true
                        }
                    })];
            case 1:
                otpObject = _b.sent();
                if (!otpObject) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied invalid or expired" })];
                }
                if (otpObject.user.isMailVerified) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email Already verified" })];
                }
                //if OTP is valid, verify user
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: otpObject.userId },
                        data: { isMailVerified: true }
                    })];
            case 2:
                //if OTP is valid, verify user
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTP.deleteMany({
                        where: {
                            type: "MAIL_VERIFICATION", userId: otpObject.userId
                        }
                    })];
            case 3:
                _b.sent();
                newUser = otpObject.user;
                req.user = {
                    userId: newUser.id,
                    email: newUser.email,
                    firstName: newUser.firstName || "",
                    lastName: newUser.lastName || "",
                    phoneNumber: newUser.phoneNumber || "",
                    profileImage: newUser.profileImage || "",
                    isMailVerified: newUser.isMailVerified,
                    hasOnboarded: newUser.isOnboarded,
                    referralCode: newUser.referralCode || ""
                };
                return [2 /*return*/, next()];
        }
    });
}); });
exports.signInUser = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, accessToken, refreshToken, deviceFingerPrint, isSessionExisting, sessionDuration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                accessToken = (0, token_utils_1.signAccessToken)({ userId: user.userId, email: user.email });
                refreshToken = (0, token_utils_1.signRefreshToken)({ userId: user.userId });
                deviceFingerPrint = (0, token_utils_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.session.findFirst({
                        where: {
                            userId: user.userId,
                            deviceFingerPrint: deviceFingerPrint
                        }
                    })];
            case 1:
                isSessionExisting = _a.sent();
                sessionDuration = Number(process.env.SESSION_DURATION);
                if (!isSessionExisting) return [3 /*break*/, 3];
                return [4 /*yield*/, pris_client_1.default.session.update({
                        where: {
                            id: isSessionExisting.id
                        },
                        data: {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            expiredAt: (0, time_utils_1.setTimeInFuture)(sessionDuration)
                        }
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, pris_client_1.default.session.create({
                    data: {
                        userId: user.userId,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        deviceFingerPrint: deviceFingerPrint,
                        expiredAt: (0, time_utils_1.setTimeInFuture)(sessionDuration)
                    }
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (!!user.hasOnboarded) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, mail_services_1.WelcomeMail)({ to: user.email, name: "".concat(user.firstName, " ").concat(user.lastName) })];
            case 6:
                _a.sent();
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: user.userId },
                        data: { isOnboarded: true }
                    })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, code: 200, data: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: user,
                        isVerified: user.isMailVerified,
                        onboarded: user.hasOnboarded
                    } })];
        }
    });
}); });
exports.verifyLoginCredentials = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, loginUser, isPasswordValid;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: email },
                    })];
            case 1:
                loginUser = _b.sent();
                if (!loginUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid sign In credentials" })];
                }
                if (!loginUser.isMailVerified) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Email not verified", status_code: "EMAIL_REDIRECT" })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptCompare)({ password: password, hashedPassword: loginUser.password })];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid sign In credentials" })];
                }
                req.user = {
                    userId: loginUser.id,
                    email: loginUser.email,
                    firstName: loginUser.firstName || "",
                    lastName: loginUser.lastName || "",
                    phoneNumber: loginUser.phoneNumber || "",
                    profileImage: loginUser.profileImage || "",
                    isMailVerified: loginUser.isMailVerified,
                    hasOnboarded: loginUser.isOnboarded,
                    referralCode: loginUser.referralCode || ""
                };
                return [2 /*return*/, next()];
        }
    });
}); });
exports.forgotPassword = (0, wrapper_1.catchDefaultError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, otpCode, otpObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: email }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "User does not exist in the application" })];
                }
                otpCode = (0, auth_utils_1.generateOTP)();
                return [4 /*yield*/, pris_client_1.default.verificationOTP.create({
                        data: {
                            otpCode: otpCode,
                            type: "RESET_PASSWORD",
                            userId: user.id,
                            expiredTime: (0, time_utils_1.setTimeInFuture)(Number(process.env.OTP_EXPIRY_MINUTE))
                        }
                    })];
            case 2:
                otpObject = _a.sent();
                return [4 /*yield*/, (0, mail_services_1.ForgotPasswordMail)({ to: email, otp: otpCode })];
            case 3:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Reset password verification has been sent to email", data: {
                            verificationId: otpObject.id
                        } })];
        }
    });
}); });
exports.resetPassword = (0, wrapper_1.catchDefaultError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verificationId, otpCode, password, otpObject, hashedPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, verificationId = _a.verificationId, otpCode = _a.otpCode, password = _a.password;
                return [4 /*yield*/, pris_client_1.default.verificationOTP.findFirst({
                        where: {
                            id: verificationId, type: "RESET_PASSWORD",
                            otpCode: otpCode,
                            expiredTime: {
                                gt: new Date()
                            }
                        }, include: {
                            user: true
                        }
                    })];
            case 1:
                otpObject = _b.sent();
                if (!otpObject) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "OTP supplied invalid or expired" })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptHash)(password)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: otpObject.userId },
                        data: { isMailVerified: true, password: hashedPassword }
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTP.deleteMany({
                        where: {
                            type: "RESET_PASSWORD", userId: otpObject.userId
                        }
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "Password has been successfully reset" })];
        }
    });
}); });
exports.refreshUserToken = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, email, userId, newAccessToken, refreshToken, deviceFingerPrint, userSession, sessionDuration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                email = user.email, userId = user.userId;
                newAccessToken = (0, token_utils_1.signAccessToken)({ email: email, userId: userId });
                refreshToken = req.body.refreshToken;
                deviceFingerPrint = (0, token_utils_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.session.findFirst({
                        where: {
                            userId: userId,
                            deviceFingerPrint: deviceFingerPrint,
                            refreshToken: refreshToken
                        }
                    })];
            case 1:
                userSession = _a.sent();
                if (!userSession) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: "Token invalid or expired", status_code: "LOGIN_REDIRECT" })];
                }
                sessionDuration = Number(process.env.SESSION_DURATION);
                return [4 /*yield*/, pris_client_1.default.session.update({
                        where: { id: userSession.id },
                        data: {
                            accessToken: newAccessToken,
                            expiredAt: (0, time_utils_1.setTimeInFuture)(sessionDuration)
                        }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: {
                            accessToken: newAccessToken,
                            refreshToken: refreshToken,
                            user: req.user
                        }
                    })];
        }
    });
}); });
exports.logOutUser = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userId, deviceFingerPrint, userSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                userId = user.userId;
                deviceFingerPrint = (0, token_utils_1.generateDeviceId)(req);
                return [4 /*yield*/, pris_client_1.default.session.findFirst({
                        where: {
                            userId: userId,
                            deviceFingerPrint: deviceFingerPrint
                        }
                    })];
            case 1:
                userSession = _a.sent();
                if (!userSession) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "server error" })];
                }
                return [4 /*yield*/, pris_client_1.default.session.delete({
                        where: {
                            id: userSession.id
                        },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res })];
        }
    });
}); });
exports.resendVerificationCode = (0, wrapper_1.catchDefaultError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, verificationType, userEmail, existingUser, otpCode, otpObject, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, verificationType = _a.verificationType;
                userEmail = email.toLowerCase();
                // Validate verificationType
                if (!verificationType || !['MAIL_VERIFICATION', 'RESET_PASSWORD'].includes(verificationType)) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Invalid verification type. Must be MAIL_VERIFICATION or RESET_PASSWORD"
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: userEmail },
                    })];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "User not found.",
                        })];
                }
                // Handle different verification types
                if (verificationType === 'MAIL_VERIFICATION') {
                    // Check if already verified for email verification
                    if (existingUser.isMailVerified) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                                res: res,
                                error: "Email is already verified.",
                            })];
                    }
                }
                otpCode = (0, auth_utils_1.generateOTP)();
                if (!(verificationType === 'MAIL_VERIFICATION')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, mail_services_1.SignUpMail)({
                        to: email,
                        otp: otpCode,
                        name: "".concat(existingUser.firstName, " ").concat(existingUser.lastName),
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3:
                if (!(verificationType === 'RESET_PASSWORD')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, mail_services_1.ForgotPasswordMail)({
                        to: email,
                        otp: otpCode,
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: 
            // Clean up any existing OTPs of the same type for this user
            return [4 /*yield*/, pris_client_1.default.verificationOTP.deleteMany({
                    where: {
                        userId: existingUser.id,
                        type: verificationType,
                    },
                })];
            case 6:
                // Clean up any existing OTPs of the same type for this user
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.verificationOTP.create({
                        data: {
                            otpCode: otpCode,
                            userId: existingUser.id,
                            type: verificationType,
                            expiredTime: (0, time_utils_1.setTimeInFuture)(Number(process.env.OTP_EXPIRY_MINUTE) || 10),
                        },
                    })];
            case 7:
                otpObject = _b.sent();
                message = verificationType === 'MAIL_VERIFICATION'
                    ? "Verification code resent to email."
                    : "Password reset code resent to email.";
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        message: message,
                        data: { verificationId: otpObject.id },
                        code: 200
                    })];
        }
    });
}); });
