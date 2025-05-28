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
exports.verifyTransferReference = exports.getAccountNumberDetail = exports.getBankCodes = exports.initiateBankTransfer = exports.createVirtualAccount = exports.generatePaymentLink = void 0;
exports.flwTransactionVerification = flwTransactionVerification;
var auth_utils_1 = require("../utils/auth.utils");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var flutterwave_config_1 = __importDefault(require("../config/flutterwave.config"));
var generatePaymentLink = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var redirect_url, title, body, response, err_1, errorString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                redirect_url = data.redirectUrl || 'https://utilourapp-z36b.vercel.app/dashboard';
                title = data.description || "Utilour Payments";
                body = {
                    tx_ref: data.tx_ref,
                    amount: "".concat(data.amount),
                    currency: data.currency,
                    redirect_url: redirect_url,
                    meta: {
                        product: data.product,
                        productId: data.productId,
                        userId: data
                    },
                    customer: {
                        email: data.user.email,
                        phonenumber: "",
                        name: "".concat(data.user.firstName, " ").concat(data.user.lastName)
                    },
                    customizations: {
                        title: title,
                        logo: "https://utilourapp-z36b.vercel.app/_next/static/media/utilourWhitelogo.2de895aa.svg"
                    }
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 5]);
                return [4 /*yield*/, flutterwave_config_1.default.post("/payments", body)];
            case 2:
                response = _a.sent();
                if (response.data) {
                    console.log("=======================================================");
                    console.log(response.data);
                    console.log("=======================================================");
                    return [2 /*return*/, response.data];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [3 /*break*/, 5];
            case 3:
                err_1 = _a.sent();
                errorString = (0, auth_utils_1.stringifyError)(err_1);
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            logs: errorString,
                            txRef: data.tx_ref
                        }
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.generatePaymentLink = generatePaymentLink;
function flwTransactionVerification(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var flwVerifyEndpoint, data, err_2, errorString;
        var txRef = _b.txRef;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    flwVerifyEndpoint = "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=".concat(txRef);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, flutterwave_config_1.default.get(flwVerifyEndpoint)];
                case 2:
                    data = (_c.sent()).data;
                    if (data.status !== 'success') {
                        return [2 /*return*/, null];
                    }
                    else
                        return [2 /*return*/, data.data];
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _c.sent();
                    errorString = (0, auth_utils_1.stringifyError)(err_2);
                    return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                            data: {
                                txRef: txRef || "", logs: errorString
                            }
                        })];
                case 4:
                    _c.sent();
                    console.log(errorString);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var createVirtualAccount = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var flwVirtualEndpoint, isDev, userBvn, body, response, err_3, log;
    var bvn = _b.bvn, email = _b.email, tx_ref = _b.tx_ref, narration = _b.narration;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                flwVirtualEndpoint = 'https://api.flutterwave.com/v3/virtual-account-numbers';
                isDev = process.env.APP_ENV === "DEV";
                userBvn = isDev ? '22123456789' : bvn;
                body = {
                    email: email,
                    bvn: userBvn, currency: "NGN",
                    tx_ref: tx_ref,
                    is_permanent: true,
                    narration: narration,
                    firstname: narration
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 5]);
                return [4 /*yield*/, flutterwave_config_1.default.post(flwVirtualEndpoint, body)];
            case 2:
                response = _c.sent();
                console.log(response.data);
                return [2 /*return*/, response.data];
            case 3:
                err_3 = _c.sent();
                log = (0, auth_utils_1.stringifyError)(err_3);
                console.log(err_3 === null || err_3 === void 0 ? void 0 : err_3.message, err_3);
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({ data: { logs: log, txRef: tx_ref } })];
            case 4:
                _c.sent();
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createVirtualAccount = createVirtualAccount;
exports.initiateBankTransfer = (function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var flwTransferEndpoint, body, response, err_4, log, errs;
    var _c;
    var accountNumber = _b.accountNumber, bankCode = _b.bankCode, narration = _b.narration, amount = _b.amount, tx_ref = _b.tx_ref;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                flwTransferEndpoint = "https://api.flutterwave.com/v3/transfers";
                body = {
                    account_bank: bankCode,
                    account_number: accountNumber,
                    amount: amount,
                    // narration,
                    currency: "NGN",
                    reference: tx_ref,
                    debit_currency: "NGN"
                };
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 5]);
                return [4 /*yield*/, flutterwave_config_1.default.post(flwTransferEndpoint, body)];
            case 2:
                response = _d.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_4 = _d.sent();
                log = (0, auth_utils_1.stringifyError)(err_4);
                errs = err_4;
                console.log((_c = errs === null || errs === void 0 ? void 0 : errs.response) === null || _c === void 0 ? void 0 : _c.data);
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({ data: { logs: log, txRef: tx_ref } })];
            case 4:
                _d.sent();
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); });
var getBankCodes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, response, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://api.flutterwave.com/v3/banks/NG";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, flutterwave_config_1.default.get(reqUrl)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_5 = _a.sent();
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getBankCodes = getBankCodes;
var getAccountNumberDetail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, reqBody, response, err_6;
    var accountNumber = _b.accountNumber, bankCode = _b.bankCode;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://api.flutterwave.com/v3/accounts/resolve";
                reqBody = {
                    account_number: accountNumber,
                    account_bank: bankCode
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, flutterwave_config_1.default.post(reqUrl, reqBody)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_6 = _c.sent();
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAccountNumberDetail = getAccountNumberDetail;
var verifyTransferReference = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var requestUrl, response, err_7;
    var _c, _d;
    var transferId = _b.transferId;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                requestUrl = "https://api.flutterwave.com/v3/transfers/".concat(transferId);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, flutterwave_config_1.default.get(requestUrl)];
            case 2:
                response = _e.sent();
                console.log(response.data);
                if (((_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.status) === "SUCCESSFUL") {
                    return [2 /*return*/, true];
                }
                else {
                    return [2 /*return*/, false];
                }
                return [3 /*break*/, 4];
            case 3:
                err_7 = _e.sent();
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyTransferReference = verifyTransferReference;
