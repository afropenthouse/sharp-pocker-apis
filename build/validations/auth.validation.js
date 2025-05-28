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
exports.verifyEmailValidation = verifyEmailValidation;
exports.signUpValidation = signUpValidation;
exports.forgotPasswordValidation = forgotPasswordValidation;
exports.loginValidation = loginValidation;
exports.refreshTokenValidation = refreshTokenValidation;
exports.passwordResetValidation = passwordResetValidation;
exports.createPinValidation = createPinValidation;
exports.resendVerificationCodeValidation = resendVerificationCodeValidation;
var joi_1 = __importDefault(require("joi"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
function verifyEmailValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var emailSchema, validation, error;
        return __generator(this, function (_a) {
            emailSchema = joi_1.default.object({
                verificationId: joi_1.default.string().required(),
                otpCode: joi_1.default.string().length(4).required()
            });
            validation = emailSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function signUpValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var completeProfileSchema, validation, error;
        return __generator(this, function (_a) {
            completeProfileSchema = joi_1.default.object({
                firstName: joi_1.default.string().min(1).max(30).required(),
                lastName: joi_1.default.string().min(1).max(30).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(8).required(),
                referralCode: joi_1.default.string().optional()
            });
            validation = completeProfileSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message
                    ? validation.error.message
                    : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function forgotPasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var resetSchema, validation, error;
        return __generator(this, function (_a) {
            resetSchema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
            });
            validation = resetSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function loginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var loginSchema, validation, error;
        return __generator(this, function (_a) {
            loginSchema = joi_1.default.object({
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(8).required(),
            });
            validation = loginSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function refreshTokenValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var loginSchema, validation, error;
        return __generator(this, function (_a) {
            loginSchema = joi_1.default.object({
                refreshToken: joi_1.default.string().min(8).required(),
            });
            validation = loginSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function passwordResetValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var resetSchema, validation, error;
        return __generator(this, function (_a) {
            resetSchema = joi_1.default.object({
                verificationId: joi_1.default.string().required(),
                otpCode: joi_1.default.string().length(4).required(),
                password: joi_1.default.string().min(8).required()
            });
            validation = resetSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function createPinValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var loginSchema, validation, error;
        return __generator(this, function (_a) {
            loginSchema = joi_1.default.object({
                pin: joi_1.default.string().length(4).required(),
            });
            validation = loginSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
function resendVerificationCodeValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var resendSchema, validation, error;
        return __generator(this, function (_a) {
            resendSchema = joi_1.default.object({
                email: joi_1.default.string().required(),
                verificationType: joi_1.default.string().valid('MAIL_VERIFICATION', 'RESET_PASSWORD').required()
            });
            validation = resendSchema.validate(req.body);
            if (validation.error) {
                error = validation.error.message ? validation.error.message : validation.error.details[0].message;
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, code: 400, error: error })];
            }
            return [2 /*return*/, next()];
        });
    });
}
