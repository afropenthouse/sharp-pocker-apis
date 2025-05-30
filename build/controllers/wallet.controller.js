"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.withdrawToExternalBankCashwyre = exports.inAppTransfer = exports.verifyAccountNumber = exports.withdrawToExternalBank = exports.getAllBanks = exports.getWalletInfo = exports.createPin = exports.createVirtualAccountNumber = void 0;
var wrapper_1 = require("../middlewares/wrapper");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var flutterwave_services_1 = require("../services/flutterwave.services");
var auth_utils_1 = require("../utils/auth.utils");
var transaction_utiles_1 = require("../utils/transaction.utiles");
var client_1 = require("@prisma/client");
var cashwyre_services_1 = require("../services/cashwyre.services");
exports.createVirtualAccountNumber = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bvn, pin, user, userWallet, isPinValid, virtualAccountDetails, updatedWallet;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, bvn = _a.bvn, pin = _a.pin;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId },
                        include: { wallet: true },
                    })];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                userWallet = user.wallet;
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "User wallet not found",
                        })];
                }
                if (userWallet === null || userWallet === void 0 ? void 0 : userWallet.virtualAccountNumber) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Virtual account number already created",
                        })];
                }
                if (!user.pin) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Pin has not yet been created",
                        })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptCompare)({
                        hashedPassword: user.pin,
                        password: pin,
                    })];
            case 2:
                isPinValid = _c.sent();
                if (!isPinValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Supplied pin invalid",
                        })];
                }
                return [4 /*yield*/, (0, flutterwave_services_1.createVirtualAccount)({
                        bvn: bvn,
                        tx_ref: userWallet.walletRef,
                        email: user.email,
                        narration: user.firstName || "",
                    })];
            case 3:
                virtualAccountDetails = _c.sent();
                if (!virtualAccountDetails) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Error creating virtual account number",
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { id: userWallet.id },
                        data: {
                            virtualAccountNumber: virtualAccountDetails.data.account_number,
                            virtualAccountBankName: virtualAccountDetails.data.bank_name,
                            virtualAccountCreatedAt: new Date(),
                        },
                        omit: {
                            userId: true,
                        },
                    })];
            case 4:
                updatedWallet = _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        message: "Virtual Account successfully created",
                        data: updatedWallet,
                    })];
        }
    });
}); });
exports.createPin = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var pin, user, hashedPin;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pin = req.body.pin;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
                    })];
            case 1:
                user = _b.sent();
                if (!user || user.hasCreatedPin) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Pin has already been created",
                            code: 400,
                        })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptHash)(pin)];
            case 2:
                hashedPin = _b.sent();
                return [4 /*yield*/, pris_client_1.default.user.update({
                        where: { id: user.id },
                        data: {
                            pin: hashedPin,
                            hasCreatedPin: true,
                        },
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        message: "Pin created successfully",
                    })];
        }
    });
}); });
exports.getWalletInfo = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, count, page, limit, pageNumber, skip, wallet, transactions;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                count = req.query.count;
                page = req.query.page;
                limit = parseInt(count) || 10;
                pageNumber = parseInt(page) || 1;
                skip = (pageNumber - 1) * limit;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "server error",
                            code: 500,
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: { userId: userId },
                        omit: { userId: true },
                    })];
            case 1:
                wallet = _b.sent();
                if (!wallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Wallet not created yet, set up profile",
                            status_code: "COMPLETE_PROFILE",
                        })];
                }
                return [4 /*yield*/, pris_client_1.default.transactions.findMany({
                        where: {
                            userId: userId,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        skip: skip,
                        take: limit,
                    })];
            case 2:
                transactions = _b.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        data: {
                            total: transactions.length,
                            page: pageNumber,
                            limit: limit,
                            wallet: __assign(__assign({}, wallet), { transactions: transactions }),
                        },
                    })];
        }
    });
}); });
exports.getAllBanks = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var allBanks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cashwyre_services_1.getBankCodes)()];
            case 1:
                allBanks = _a.sent();
                if (!allBanks) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                            res: res,
                            error: "Service is temporally  unavailable",
                            code: 500,
                        })];
                }
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: allBanks.data })];
        }
    });
}); });
exports.withdrawToExternalBank = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, bankCode, accountNumber, userWallet, transaction, paymentStatus;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, amount = _a.amount, bankCode = _a.bankCode, accountNumber = _a.accountNumber;
                if (!userId) {
                    if (!userId) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                                res: res,
                                error: "server error",
                                code: 500,
                            })];
                    }
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
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.PENDING,
                            userId: userId,
                            description: client_1.TRANSACTION_DESCRIPTION.OUTWARD_WITHDRAWAL,
                            amount: amount,
                            type: client_1.TRANSACTION_TYPE.DEBIT,
                        },
                    })];
            case 2:
                transaction = _c.sent();
                return [4 /*yield*/, (0, flutterwave_services_1.initiateBankTransfer)({
                        accountNumber: accountNumber,
                        bankCode: bankCode,
                        amount: amount,
                        tx_ref: transaction.txRef,
                        narration: "withdrawal",
                    })];
            case 3:
                paymentStatus = _c.sent();
                console.log(paymentStatus, "app-console");
                if (!!paymentStatus) return [3 /*break*/, 5];
                return [4 /*yield*/, pris_client_1.default.transactions.update({
                        where: { id: transaction.id },
                        data: { status: client_1.TRANSACTION_STATUS.FAILED },
                    })];
            case 4:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({
                        res: res,
                        error: "payment could not be completed, try again",
                    })];
            case 5: return [4 /*yield*/, pris_client_1.default.userWallet.update({
                    where: { userId: userId },
                    data: {
                        balance: {
                            decrement: amount,
                        },
                    },
                })];
            case 6:
                _c.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({
                        res: res,
                        message: "payment of NGN ".concat(amount, " is been processed"),
                    })];
        }
    });
}); });
exports.verifyAccountNumber = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accountNumber, bankCode, accountDetails;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, accountNumber = _a.accountNumber, bankCode = _a.bankCode;
                return [4 /*yield*/, (0, flutterwave_services_1.getAccountNumberDetail)({ accountNumber: accountNumber, bankCode: bankCode })];
            case 1:
                accountDetails = _b.sent();
                if (!accountDetails) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Unable to verify account number" })];
                }
                else {
                    return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, data: accountDetails.data })];
                }
                return [2 /*return*/];
        }
    });
}); });
exports.inAppTransfer = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, email, amount, pin, recipient, userWallet, userPin, isPinValid, isAmountSendable, creditTransaction, debitTransaction, recipientWallet, creditWalletUpdate, debitWalletUpdate, notifications;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                }
                _a = req.body, email = _a.email, amount = _a.amount, pin = _a.pin;
                return [4 /*yield*/, pris_client_1.default.user.findFirst({
                        where: { email: email },
                        include: { wallet: true }
                    })];
            case 1:
                recipient = _f.sent();
                if (!recipient) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Username supplied invalid" })];
                }
                if (recipient.id === userId) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "You cannot send to yourself" })];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: { userId: userId },
                        include: { user: true }
                    })];
            case 2:
                userWallet = _f.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Wallet has not been created" })];
                }
                userPin = (_c = userWallet.user) === null || _c === void 0 ? void 0 : _c.pin;
                if (!userPin) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No pin has been created" })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptCompare)({ password: pin, hashedPassword: userPin })];
            case 3:
                isPinValid = _f.sent();
                if (!isPinValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Pin supplied is invalid" })];
                }
                isAmountSendable = userWallet.balance >= amount;
                if (!isAmountSendable) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient amount in balance" })];
                }
                creditTransaction = pris_client_1.default.transactions.create({
                    data: {
                        txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                        amount: amount,
                        userId: recipient.id,
                        type: "CREDIT",
                        status: "SUCCESS",
                        description: client_1.TRANSACTION_DESCRIPTION.IN_APP_TRANSFER,
                    }
                });
                debitTransaction = pris_client_1.default.transactions.create({
                    data: {
                        txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                        amount: amount,
                        userId: userId,
                        description: client_1.TRANSACTION_DESCRIPTION.IN_APP_TRANSFER,
                        type: "DEBIT",
                        status: "SUCCESS"
                    }
                });
                return [4 /*yield*/, pris_client_1.default.userWallet.findUnique({
                        where: { id: (_d = recipient.wallet) === null || _d === void 0 ? void 0 : _d.id }
                    })];
            case 4:
                recipientWallet = _f.sent();
                if (!recipientWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Unable to initiate transfer to this recipient", code: 500 })];
                }
                creditWalletUpdate = pris_client_1.default.userWallet.update({
                    where: { id: (_e = recipient.wallet) === null || _e === void 0 ? void 0 : _e.id },
                    data: {
                        balance: { increment: amount }
                    }
                });
                debitWalletUpdate = pris_client_1.default.userWallet.update({
                    where: { id: userWallet.id },
                    data: {
                        balance: { decrement: amount }
                    }
                });
                notifications = pris_client_1.default.notifications.createMany({
                    data: [
                        {
                            userId: userId,
                            type: "WALLET",
                            content: "You sent ".concat(amount, " to ").concat(recipient.firstName)
                        },
                        {
                            userId: recipient.id,
                            type: "WALLET",
                            content: "".concat(recipient.firstName, " sent you ").concat(amount)
                        },
                    ]
                });
                return [4 /*yield*/, pris_client_1.default.$transaction([
                        creditTransaction,
                        debitTransaction,
                        creditWalletUpdate,
                        debitWalletUpdate,
                        notifications
                    ])];
            case 5:
                _f.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "".concat(amount, " successfully sent to ").concat(recipient.firstName) })];
        }
    });
}); });
exports.withdrawToExternalBankCashwyre = (0, wrapper_1.catchAuthError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, bankCode, accountNumber, accountName, pin, userWallet, userPin, isPinValid, transaction, paymentStatus;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                _a = req.body, amount = _a.amount, bankCode = _a.bankCode, accountNumber = _a.accountNumber, accountName = _a.accountName, pin = _a.pin;
                if (!userId) {
                    if (!userId) {
                        return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "server error", code: 500 })];
                    }
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({ where: {
                            userId: userId
                        },
                        include: { user: true } })];
            case 1:
                userWallet = _d.sent();
                if (!userWallet) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Wallet not created yet, set up profile", status_code: "COMPLETE_PROFILE" })];
                }
                userPin = (_c = userWallet.user) === null || _c === void 0 ? void 0 : _c.pin;
                if (!userPin) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "No pin has been created" })];
                }
                return [4 /*yield*/, (0, auth_utils_1.bcryptCompare)({ password: pin, hashedPassword: userPin })];
            case 2:
                isPinValid = _d.sent();
                if (!isPinValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Pin supplied is invalid" })];
                }
                if (userWallet.balance < amount) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Insufficient funds in wallet" })];
                }
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            status: client_1.TRANSACTION_STATUS.PENDING,
                            userId: userId,
                            description: client_1.TRANSACTION_DESCRIPTION.OUTWARD_WITHDRAWAL,
                            amount: amount,
                            type: client_1.TRANSACTION_TYPE.DEBIT,
                            name: "Withdrawal to Bank"
                        }
                    })];
            case 3:
                transaction = _d.sent();
                return [4 /*yield*/, (0, cashwyre_services_1.initiateCashwyrePayout)(bankCode, accountName, accountNumber, amount, transaction.txRef)];
            case 4:
                paymentStatus = _d.sent();
                console.log(paymentStatus, "app-console");
                if (!!paymentStatus) return [3 /*break*/, 6];
                return [4 /*yield*/, pris_client_1.default.transactions.update({
                        where: { id: transaction.id },
                        data: { status: client_1.TRANSACTION_STATUS.FAILED }
                    })];
            case 5:
                _d.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "payment could not be completed, try again" })];
            case 6:
                if (!!paymentStatus.success) return [3 /*break*/, 8];
                return [4 /*yield*/, pris_client_1.default.transactions.update({
                        where: { id: transaction.id },
                        data: { status: client_1.TRANSACTION_STATUS.FAILED }
                    })];
            case 7:
                _d.sent();
                return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "payment could not be completed, try again" })];
            case 8: return [4 /*yield*/, pris_client_1.default.userWallet.update({
                    where: { userId: userId },
                    data: {
                        balance: {
                            decrement: amount
                        }
                    }
                })];
            case 9:
                _d.sent();
                _d.label = 10;
            case 10: return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, message: "payment of NGN ".concat(amount, " is been processed") })];
        }
    });
}); });
