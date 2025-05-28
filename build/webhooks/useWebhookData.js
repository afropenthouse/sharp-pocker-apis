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
exports.updateCashwyreWithDrawalTransaction = exports.updateWithdrawalTransaction = void 0;
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var transaction_utiles_1 = require("../utils/transaction.utiles");
var client_1 = require("@prisma/client");
var updateWithdrawalTransaction = function (dataFromWebhook) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, transaction, isSuccess, transactionData, walletUpdate, newTransaction, notification, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ref = dataFromWebhook.data.reference;
                return [4 /*yield*/, pris_client_1.default.transactions.findFirst({
                        where: { txRef: ref },
                    })];
            case 1:
                transaction = _b.sent();
                if (!!transaction) return [3 /*break*/, 3];
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: ref,
                            logs: "Transaction with reference ".concat(ref, " not found"),
                        },
                    })];
            case 2:
                _b.sent();
                throw new Error("Transaction not found in the database");
            case 3:
                isSuccess = dataFromWebhook.data.status === "successful" ||
                    dataFromWebhook.data.status === "SUCCESSFUL";
                if (!isSuccess) return [3 /*break*/, 5];
                return [4 /*yield*/, pris_client_1.default.transactions.update({
                        where: { id: transaction.id },
                        data: { status: "SUCCESS" },
                    })];
            case 4:
                _b.sent();
                return [3 /*break*/, 12];
            case 5: 
            // Mark the transaction as failed
            return [4 /*yield*/, pris_client_1.default.transactions.update({
                    where: { id: transaction.id },
                    data: { status: "FAILED" },
                })];
            case 6:
                // Mark the transaction as failed
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.findFirst({
                        where: { id: transaction.id },
                        include: {
                            user: {
                                include: { wallet: true },
                            },
                        },
                    })];
            case 7:
                transactionData = _b.sent();
                if (!((transactionData === null || transactionData === void 0 ? void 0 : transactionData.description) === "OUTWARD_WITHDRAWAL" &&
                    transactionData.type === "DEBIT" &&
                    ((_a = transactionData.user.wallet) === null || _a === void 0 ? void 0 : _a.id))) return [3 /*break*/, 12];
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 12]);
                walletUpdate = pris_client_1.default.userWallet.update({
                    where: { id: transactionData.user.wallet.id },
                    data: {
                        balance: {
                            increment: transactionData.amount,
                        },
                    },
                });
                newTransaction = pris_client_1.default.transactions.create({
                    data: {
                        txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                        amount: transactionData.amount,
                        userId: transactionData.userId,
                        description: client_1.TRANSACTION_DESCRIPTION.REFUND,
                        type: "CREDIT",
                    },
                });
                notification = pris_client_1.default.notifications.create({
                    data: {
                        userId: transactionData.userId,
                        type: "WALLET",
                        content: "\u20A6".concat(transactionData.amount, " was refunded to your wallet due to a failed withdrawal."),
                    },
                });
                return [4 /*yield*/, pris_client_1.default.$transaction([
                        walletUpdate,
                        newTransaction,
                        notification,
                    ])];
            case 9:
                _b.sent();
                return [3 /*break*/, 12];
            case 10:
                err_1 = _b.sent();
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: transactionData.txRef,
                            logs: "Refund failed: ".concat(err_1.message),
                        },
                    })];
            case 11:
                _b.sent();
                throw new Error("Refund process failed");
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.updateWithdrawalTransaction = updateWithdrawalTransaction;
var updateCashwyreWithDrawalTransaction = function (dataFromWebhook) { return __awaiter(void 0, void 0, void 0, function () {
    var ref, transaction, isSuccess, transactionData, walletUpdate, newTransaction, notification, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ref = dataFromWebhook["eventData"].reference;
                return [4 /*yield*/, pris_client_1.default.transactions.findFirst({
                        where: { txRef: ref }
                    })];
            case 1:
                transaction = _b.sent();
                if (!!transaction) return [3 /*break*/, 3];
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: ref,
                            logs: "Transaction with reference ".concat(ref, " not found"),
                        },
                    })];
            case 2:
                _b.sent();
                throw new Error("Transaction not found in the database");
            case 3:
                isSuccess = dataFromWebhook["eventData"].status === "success" || dataFromWebhook["eventData"].status === "SUCCESS";
                if (!isSuccess) return [3 /*break*/, 5];
                return [4 /*yield*/, pris_client_1.default.transactions.update({
                        where: { id: transaction.id },
                        data: { status: client_1.TRANSACTION_STATUS.SUCCESS },
                    })];
            case 4:
                _b.sent();
                return [3 /*break*/, 12];
            case 5: 
            // Mark the transaction as failed
            return [4 /*yield*/, pris_client_1.default.transactions.update({
                    where: { id: transaction.id },
                    data: { status: client_1.TRANSACTION_STATUS.FAILED },
                })];
            case 6:
                // Mark the transaction as failed
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.transactions.findFirst({
                        where: { id: transaction.id },
                        include: {
                            user: {
                                include: { wallet: true },
                            },
                        },
                    })];
            case 7:
                transactionData = _b.sent();
                if (!((transactionData === null || transactionData === void 0 ? void 0 : transactionData.description) === client_1.TRANSACTION_DESCRIPTION.OUTWARD_WITHDRAWAL &&
                    transactionData.type === client_1.TRANSACTION_TYPE.DEBIT &&
                    ((_a = transactionData.user.wallet) === null || _a === void 0 ? void 0 : _a.id))) return [3 /*break*/, 12];
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 12]);
                walletUpdate = pris_client_1.default.userWallet.update({
                    where: { id: transactionData.user.wallet.id },
                    data: {
                        balance: {
                            increment: transactionData.amount,
                        },
                    },
                });
                newTransaction = pris_client_1.default.transactions.create({
                    data: {
                        txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                        amount: transactionData.amount,
                        userId: transactionData.userId,
                        description: client_1.TRANSACTION_DESCRIPTION.REFUND,
                        type: client_1.TRANSACTION_TYPE.CREDIT,
                    },
                });
                notification = pris_client_1.default.notifications.create({
                    data: {
                        userId: transactionData.userId,
                        type: client_1.NOTIFICATION_TYPE.WALLET,
                        content: "\u20A6".concat(transactionData.amount, " was refunded to your wallet due to a failed withdrawal."),
                    },
                });
                return [4 /*yield*/, pris_client_1.default.$transaction([
                        walletUpdate,
                        newTransaction,
                        notification,
                    ])];
            case 9:
                _b.sent();
                return [3 /*break*/, 12];
            case 10:
                err_2 = _b.sent();
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: transactionData.txRef,
                            logs: "Refund failed: ".concat(err_2.message),
                        },
                    })];
            case 11:
                _b.sent();
                throw new Error("Refund process failed");
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.updateCashwyreWithDrawalTransaction = updateCashwyreWithDrawalTransaction;
