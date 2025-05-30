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
exports.verifyElectricityController = exports.verifySmartCardController = exports.buyElectricityController = exports.buyDataController = exports.buyCableTvController = exports.buyAirtimeController = exports.getDataOption = exports.getElectricityOption = exports.getCableOption = exports.getAirtimeOption = void 0;
var client_1 = require("@prisma/client");
var client_2 = require("@prisma/client");
var client_3 = require("@prisma/client");
var wrapper_1 = require("../middlewares/wrapper");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var cashwyre_services_1 = require("../services/cashwyre.services");
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var transaction_utiles_1 = require("../utils/transaction.utiles");
exports.getAirtimeOption = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var airtimeOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cashwyre_services_1.getAirtimeOptions)()];
            case 1:
                airtimeOptions = _a.sent();
                if (!airtimeOptions) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Service is temporally  unavailable",
                            code: 500,
                        })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        data: airtimeOptions.data,
                    })];
        }
    });
}); });
exports.getCableOption = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var cableOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cashwyre_services_1.getCableOptions)()];
            case 1:
                cableOptions = _a.sent();
                if (!cableOptions) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Service is temporally  unavailable",
                            code: 500,
                        })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: cableOptions.data })];
        }
    });
}); });
exports.getElectricityOption = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var electricityOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cashwyre_services_1.getElectricityOptions)()];
            case 1:
                electricityOptions = _a.sent();
                if (!electricityOptions) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Service is temporally  unavailable",
                            code: 500,
                        })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        data: electricityOptions.data,
                    })];
        }
    });
}); });
exports.getDataOption = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dataOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cashwyre_services_1.getDataOptions)()];
            case 1:
                dataOptions = _a.sent();
                if (!dataOptions) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Service is temporally  unavailable",
                            code: 500,
                        })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: dataOptions.data })];
        }
    });
}); });
exports.buyAirtimeController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, network, phoneNumber, userWallet, airtime;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, amount = _a.amount, network = _a.network, phoneNumber = _a.phoneNumber;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                userWallet = _c.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Wallet not created yet, set up profile",
                            status_code: "COMPLETE_PROFILE",
                        })];
                }
                if (userWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Insufficient funds in wallet",
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.buyAirtime)({ Network: network, PhoneNumber: phoneNumber, Amount: amount })];
            case 2:
                airtime = _c.sent();
                console.log("cashwyre response: ".concat(JSON.stringify(airtime)));
                if (!airtime.success) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { userId: userId },
                        data: { balance: { decrement: amount } },
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.SUCCESS,
                            userId: userId,
                            description: client_2.TRANSACTION_DESCRIPTION.BILL_PAYMENT,
                            amount: amount,
                            type: client_3.TRANSACTION_TYPE.DEBIT,
                            billTransaction: {
                                create: {
                                    serviceType: client_1.SERVICE_TYPE.AIRTIME,
                                    provider: network,
                                    phoneNumber: phoneNumber,
                                    status: client_1.BILL_STATUS.SUCCESS,
                                    amount: amount,
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.notifications.create({
                        data: {
                            userId: userId,
                            content: "Airtime purchase of ".concat(amount, " to ").concat(phoneNumber, " was successful"),
                            type: client_1.NOTIFICATION_TYPE.BILL_PAYMENT,
                        },
                    })];
            case 5:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: airtime.data })];
            case 6: return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                    res: res,
                    error: "airtime purchase failed",
                })];
        }
    });
}); });
exports.buyCableTvController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, customerName, providerCode, providerPlanCode, smartCardNumber, amount, userWallet, cableTv;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, customerName = _a.customerName, providerCode = _a.providerCode, providerPlanCode = _a.providerPlanCode, smartCardNumber = _a.smartCardNumber, amount = _a.amount;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                userWallet = _c.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Wallet not created yet, set up profile",
                            status_code: "COMPLETE_PROFILE",
                        })];
                }
                if (userWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Insufficient funds in wallet",
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.buyCableTv)({ CustomerName: customerName, ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, SmartCardNumber: smartCardNumber })];
            case 2:
                cableTv = _c.sent();
                if (!cableTv.success) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { userId: userId },
                        data: { balance: { decrement: amount } },
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.SUCCESS,
                            userId: userId,
                            description: client_2.TRANSACTION_DESCRIPTION.BILL_PAYMENT,
                            amount: amount,
                            type: client_3.TRANSACTION_TYPE.DEBIT,
                            billTransaction: {
                                create: {
                                    serviceType: client_1.SERVICE_TYPE.CABLE,
                                    provider: providerCode,
                                    status: client_1.BILL_STATUS.SUCCESS,
                                    amount: amount,
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.notifications.create({
                        data: {
                            userId: userId,
                            content: "Cable TV purchase of ".concat(amount, " to ").concat(smartCardNumber, " was successful"),
                            type: client_1.NOTIFICATION_TYPE.BILL_PAYMENT,
                        },
                    })];
            case 5:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: cableTv.data })];
            case 6: return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                    res: res,
                    error: "cable tv purchase failed",
                })];
        }
    });
}); });
exports.buyDataController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, network, phoneNumber, providerPlanCode, userWallet, data;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, amount = _a.amount, network = _a.network, phoneNumber = _a.phoneNumber, providerPlanCode = _a.providerPlanCode;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                userWallet = _c.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Wallet not created yet, set up profile",
                            status_code: "COMPLETE_PROFILE",
                        })];
                }
                if (userWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Insufficient funds in wallet",
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.buyData)({ Network: network, PhoneNumber: phoneNumber, ProviderPlanCode: providerPlanCode })];
            case 2:
                data = _c.sent();
                console.log("cashwyre response: ".concat(JSON.stringify(data)));
                if (!data.success) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { userId: userId },
                        data: { balance: { decrement: amount } },
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.SUCCESS,
                            userId: userId,
                            description: client_2.TRANSACTION_DESCRIPTION.BILL_PAYMENT,
                            amount: amount,
                            type: client_3.TRANSACTION_TYPE.DEBIT,
                            billTransaction: {
                                create: {
                                    serviceType: client_1.SERVICE_TYPE.DATA,
                                    provider: network,
                                    status: client_1.BILL_STATUS.SUCCESS,
                                    amount: amount,
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.notifications.create({
                        data: {
                            userId: userId,
                            content: "Data purchase of ".concat(amount, " to ").concat(phoneNumber, " was successful"),
                            type: client_1.NOTIFICATION_TYPE.BILL_PAYMENT,
                        },
                    })];
            case 5:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: data.data })];
            case 6: return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                    res: res,
                    error: "data purchase failed",
                })];
        }
    });
}); });
exports.buyElectricityController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, providerCode, providerPlanCode, meterNumber, customerName, userWallet, electricity;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, amount = _a.amount, providerCode = _a.providerCode, providerPlanCode = _a.providerPlanCode, meterNumber = _a.meterNumber, customerName = _a.customerName;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                userWallet = _c.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Wallet not created yet, set up profile",
                            status_code: "COMPLETE_PROFILE",
                        })];
                }
                if (userWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Insufficient funds in wallet",
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.buyElectricity)({ ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, MeterNumber: meterNumber, Amount: amount, CustomerName: customerName })];
            case 2:
                electricity = _c.sent();
                console.log("cashwyre response: ".concat(JSON.stringify(electricity)));
                if (!electricity.success) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { userId: userId },
                        data: { balance: { decrement: amount } },
                    })];
            case 3:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.SUCCESS,
                            userId: userId,
                            description: client_2.TRANSACTION_DESCRIPTION.BILL_PAYMENT,
                            amount: amount,
                            type: client_3.TRANSACTION_TYPE.DEBIT,
                            billTransaction: {
                                create: {
                                    serviceType: client_1.SERVICE_TYPE.ELECTRICITY,
                                    provider: providerCode,
                                    status: client_1.BILL_STATUS.SUCCESS,
                                    amount: amount,
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, pris_client_1.default.notifications.create({
                        data: {
                            userId: userId,
                            content: "Electricity purchase of ".concat(amount, " to ").concat(meterNumber, " was successful"),
                            type: client_1.NOTIFICATION_TYPE.BILL_PAYMENT,
                        },
                    })];
            case 5:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: electricity.data })];
            case 6: return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                    res: res,
                    error: electricity.message,
                })];
        }
    });
}); });
exports.verifySmartCardController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, smartCardNumber, providerCode, providerPlanCode, smartCard;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, smartCardNumber = _a.smartCardNumber, providerCode = _a.providerCode, providerPlanCode = _a.providerPlanCode;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.verifySmartCard)({ SmartCardNumber: smartCardNumber, ProviderCode: providerCode, ProviderPlanCode: providerPlanCode })];
            case 1:
                smartCard = _c.sent();
                console.log("cashwyre response: ".concat(JSON.stringify(smartCard)));
                if (smartCard.success) {
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: smartCard.data })];
                }
                else {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "smart card verification failed",
                        })];
                }
                return [2 /*return*/];
        }
    });
}); });
exports.verifyElectricityController = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, providerCode, providerPlanCode, meterNumber, electricity;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, providerCode = _a.providerCode, providerPlanCode = _a.providerPlanCode, meterNumber = _a.meterNumber;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, (0, cashwyre_services_1.verifyElectricity)({ ProviderCode: providerCode, ProviderPlanCode: providerPlanCode, MeterNumber: meterNumber })];
            case 1:
                electricity = _c.sent();
                console.log("cashwyre response: ".concat(JSON.stringify(electricity)));
                if (electricity.success) {
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: electricity.data })];
                }
                else {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "electricity verification failed",
                        })];
                }
                return [2 /*return*/];
        }
    });
}); });
