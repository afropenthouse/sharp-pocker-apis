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
exports.verifyAccessToken = verifyAccessToken;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var client_utils_1 = require("../utils/client-utils");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyAccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, decoded, deviceFingerPrint, session, user, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    accessToken = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    if (!accessToken) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid token supplied", status_code: "LOGIN_REDIRECT", code: 401 })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                    //verify token supplied is valid
                    if (!decoded.userId) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid token supplied", code: 401, status_code: "LOGIN_REDIRECT" })];
                    }
                    deviceFingerPrint = (0, client_utils_1.generateDeviceId)(req);
                    return [4 /*yield*/, pris_client_1.default.session.findFirst({
                            where: {
                                userId: decoded.userId,
                                accessToken: accessToken,
                                expiredAt: {
                                    gt: new Date()
                                }
                            },
                            include: {
                                user: true
                            }
                        })];
                case 2:
                    session = _b.sent();
                    if (!session) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "session does not exist", code: 401, status_code: "LOGIN_REDIRECT" })];
                    }
                    user = session.user;
                    req.user = {
                        userId: user.id,
                        email: user.id,
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        phoneNumber: user.phoneNumber || "",
                        profileImage: user.profileImage || "",
                        isMailVerified: user.isMailVerified,
                        hasOnboarded: user.isOnboarded,
                        referralCode: user.referralCode || ""
                    };
                    return [2 /*return*/, next()];
                case 3:
                    err_1 = _b.sent();
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Invalid token supplied", code: 401, status_code: "LOGIN_REDIRECT" })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
