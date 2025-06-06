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
exports.getUserNotifications = exports.getUserProfileDetail = void 0;
var wrapper_1 = require("../middlewares/wrapper");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
exports.getUserProfileDetail = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, profile;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pris_client_1.default.user.findFirst({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
                })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "User does not exist",
                            code: 400,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { id: user.id },
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            profileImage: true,
                            isOnboarded: true,
                            isMailVerified: true,
                            referralCode: true,
                            hasCreatedPin: true,
                            phoneNumber: true,
                            _count: {
                                select: {
                                    referrals: true,
                                },
                            },
                        },
                    })];
            case 2:
                profile = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: profile })];
        }
    });
}); });
exports.getUserNotifications = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, _b, page, _c, limit, skip, _d, notifications, totalCount, totalPages;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, pris_client_1.default.user.findFirst({
                    where: { id: (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId },
                })];
            case 1:
                user = _f.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "User does not exist",
                            code: 400,
                        })];
                }
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c;
                skip = (Number(page) - 1) * Number(limit);
                return [4 /*yield*/, Promise.all([
                        pris_client_1.default.notifications.findMany({
                            where: { userId: user.id },
                            orderBy: { createdAt: 'desc' },
                            skip: skip,
                            take: Number(limit),
                            select: {
                                id: true,
                                type: true,
                                content: true,
                                createdAt: true,
                            },
                        }),
                        pris_client_1.default.notifications.count({
                            where: { userId: user.id },
                        }),
                    ])];
            case 2:
                _d = _f.sent(), notifications = _d[0], totalCount = _d[1];
                totalPages = Math.ceil(totalCount / Number(limit));
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        data: {
                            notifications: notifications,
                            pagination: {
                                currentPage: Number(page),
                                totalPages: totalPages,
                                totalCount: totalCount,
                                hasNextPage: Number(page) < totalPages,
                                hasPreviousPage: Number(page) > 1,
                            },
                        },
                    })];
        }
    });
}); });
