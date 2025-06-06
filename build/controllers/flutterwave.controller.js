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
exports.channelWebHookData = exports.depositIntoWallet = void 0;
var client_1 = require("@prisma/client");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var transaction_utiles_1 = require("../utils/transaction.utiles");
var depositIntoWallet = function (dataFromWebhook) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status, txRef, amount, userWallet;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = dataFromWebhook.data, status = _a.status, txRef = _a.tx_ref, amount = _a.amount;
                if (status !== "successful") {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, pris_client_1.default.userWallet.findFirst({
                        where: { walletRef: txRef }
                    })];
            case 1:
                userWallet = _b.sent();
                if (!userWallet) {
                    throw Error("Invalid ref passed");
                }
                //update user wallet
                return [4 /*yield*/, pris_client_1.default.userWallet.update({
                        where: { id: userWallet.id },
                        data: {
                            balance: {
                                increment: amount,
                            },
                            lastDepositedAt: new Date()
                        }
                    })
                    //create deposit transaction for user
                ];
            case 2:
                //update user wallet
                _b.sent();
                //create deposit transaction for user
                return [4 /*yield*/, pris_client_1.default.transactions.create({
                        data: {
                            txRef: (0, transaction_utiles_1.generateTransactionRef)(),
                            type: 'CREDIT',
                            amount: amount,
                            userId: userWallet.userId,
                            description: client_1.TRANSACTION_DESCRIPTION.WALLET_TOPUP,
                            status: "SUCCESS",
                        }
                    })];
            case 3:
                //create deposit transaction for user
                _b.sent();
                return [4 /*yield*/, pris_client_1.default.notifications.create({
                        data: {
                            userId: userWallet.userId,
                            type: client_1.NOTIFICATION_TYPE.WALLET_TOPUP,
                            content: "You have successfully deposited ".concat(amount, " into your wallet")
                        }
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.depositIntoWallet = depositIntoWallet;
var channelWebHookData = function (dataFromWebhook, flwVerification) { return __awaiter(void 0, void 0, void 0, function () {
    var txRef, isWalletRef, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("channeled after response");
                txRef = dataFromWebhook.data.tx_ref;
                isWalletRef = (0, transaction_utiles_1.isRefWalletRef)(txRef);
                return [4 /*yield*/, pris_client_1.default.transactions.findFirst({
                        where: { txRef: txRef }
                    })
                    // If none, just return
                ];
            case 1:
                transaction = _a.sent();
                // If none, just return
                if (!transaction && !isWalletRef) {
                    throw new Error("Transaction not found in the database");
                }
                if (isWalletRef) {
                    //handle wallet transactions
                    (0, exports.depositIntoWallet)(dataFromWebhook);
                    return [2 /*return*/];
                }
                //? Now run different transactions depending on transaction type/description
                if (transaction && transaction.description) {
                    switch (transaction.description) {
                    }
                }
                else {
                    console.log("Transaction description not found");
                    return [2 /*return*/];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.channelWebHookData = channelWebHookData;
