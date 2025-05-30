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
exports.verifyElectricity = exports.buyElectricity = exports.buyData = exports.buyCableTv = exports.verifySmartCard = exports.buyAirtime = exports.initiateCashwyrePayout = exports.getDataOptions = exports.getAirtimeOptions = exports.getCableOptions = exports.getElectricityOptions = exports.initiatePayout = exports.accountLookup = exports.getBankCodes = void 0;
var axios_1 = __importDefault(require("axios"));
var uuid_1 = require("uuid");
var getBankCodes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CountryBank/getCountryBanks";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    accountType: ""
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_1 = _a.sent();
                console.error("Error fetching bank codes:", err_1);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getBankCodes = getBankCodes;
var accountLookup = function (accountNumber, bankCode) { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/account/accountlookup";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: "C4B20241209000012",
                    requestId: requestId,
                    accountNumber: accountNumber,
                    bankCode: bankCode,
                    country: "NG"
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_2 = _a.sent();
                console.error("Error performing account lookup:", err_2);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.accountLookup = accountLookup;
var initiatePayout = function (bankCode, accountName, accountNumber, amount, tx_ref) { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Payout/initiate";
                requestId = (0, uuid_1.v4)();
                data = {
                    BusinessCode: process.env.CASHWYREBUSINESSCODE,
                    BankCode: bankCode,
                    AccountName: accountName,
                    AccountNumber: accountNumber,
                    Currency: "NGN",
                    Narration: "withdraw",
                    Reference: tx_ref,
                    Amount: amount,
                    ThirdPartyIdentifier: null,
                    PercentageDiscount: null,
                    AppId: process.env.CASHWYREAPPID,
                    RequestId: requestId
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data, {
                        headers: {
                            Authorization: "Bearer ".concat(process.env.CASHWYREPUBLICKEY)
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_3 = _a.sent();
                console.error("Error initiating payout:", err_3);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.initiatePayout = initiatePayout;
var getElectricityOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Electricity/getElectricityInfo";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    accountType: ""
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_4 = _a.sent();
                console.error("Error fetching bank codes:", err_4);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getElectricityOptions = getElectricityOptions;
var getCableOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CableTV/getCableTVInfo";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_5 = _a.sent();
                console.error("Error fetching bank codes:", err_5);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCableOptions = getCableOptions;
var getAirtimeOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Airtime/getAirtimeInfo";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    accountType: ""
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_6 = _a.sent();
                console.error("Error fetching bank codes:", err_6);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAirtimeOptions = getAirtimeOptions;
var getDataOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/DataPurchase/getDataInfo";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    accountType: ""
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_7 = _a.sent();
                console.error("Error fetching bank codes:", err_7);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getDataOptions = getDataOptions;
var initiateCashwyrePayout = function (bankCode, accountName, accountNumber, amount, tx_ref) { return __awaiter(void 0, void 0, void 0, function () {
    var reqUrl, requestId, data, response, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Payout/initiate";
                requestId = (0, uuid_1.v4)();
                data = {
                    BusinessCode: process.env.CASHWYREBUSINESSCODE,
                    BankCode: bankCode,
                    AccountName: accountName,
                    AccountNumber: accountNumber,
                    Currency: "NGN",
                    Narration: "withdraw",
                    Reference: tx_ref,
                    Amount: amount,
                    ThirdPartyIdentifier: null,
                    PercentageDiscount: null,
                    AppId: process.env.CASHWYREAPPID,
                    RequestId: requestId
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data, {
                        headers: {
                            Authorization: "Bearer ".concat(process.env.CASHWYREPUBLICKEY)
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                err_8 = _a.sent();
                console.error("Error initiating payout:", err_8);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.initiateCashwyrePayout = initiateCashwyrePayout;
var buyAirtime = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, reference, data, response, err_9;
    var Network = _b.Network, PhoneNumber = _b.PhoneNumber, Amount = _b.Amount;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Airtime/buyAirtime";
                requestId = (0, uuid_1.v4)();
                reference = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    Network: Network,
                    PhoneNumber: PhoneNumber,
                    Amount: Amount,
                    Reference: reference
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_9 = _c.sent();
                console.error("Error fetching bank codes:", err_9);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.buyAirtime = buyAirtime;
var verifySmartCard = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, data, response, err_10;
    var SmartCardNumber = _b.SmartCardNumber, ProviderCode = _b.ProviderCode, ProviderPlanCode = _b.ProviderPlanCode;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CableTV/verifyCustomer";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    SmartCardNumber: SmartCardNumber,
                    ProviderCode: ProviderCode,
                    ProviderPlanCode: ProviderPlanCode
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_10 = _c.sent();
                console.error("Error fetching bank codes:", err_10);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifySmartCard = verifySmartCard;
var buyCableTv = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, reference, data, response, err_11;
    var CustomerName = _b.CustomerName, ProviderCode = _b.ProviderCode, ProviderPlanCode = _b.ProviderPlanCode, SmartCardNumber = _b.SmartCardNumber;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CableTV/buyCableTV";
                requestId = (0, uuid_1.v4)();
                reference = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    CustomerName: CustomerName,
                    ProviderCode: ProviderCode,
                    ProviderPlanCode: ProviderPlanCode,
                    SmartCardNumber: SmartCardNumber,
                    Reference: reference
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_11 = _c.sent();
                console.error("Error fetching bank codes:", err_11);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.buyCableTv = buyCableTv;
var buyData = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, reference, data, response, err_12;
    var ProviderPlanCode = _b.ProviderPlanCode, Network = _b.Network, PhoneNumber = _b.PhoneNumber;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/DataPurchase/buyData";
                requestId = (0, uuid_1.v4)();
                reference = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    Network: Network,
                    PhoneNumber: PhoneNumber,
                    ProviderPlanCode: ProviderPlanCode,
                    Reference: reference
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_12 = _c.sent();
                console.error("Error fetching bank codes:", err_12);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.buyData = buyData;
var buyElectricity = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, reference, data, response, err_13;
    var ProviderCode = _b.ProviderCode, ProviderPlanCode = _b.ProviderPlanCode, MeterNumber = _b.MeterNumber, Amount = _b.Amount, CustomerName = _b.CustomerName;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Electricity/buyElectricity";
                requestId = (0, uuid_1.v4)();
                reference = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    ProviderCode: ProviderCode,
                    ProviderPlanCode: ProviderPlanCode,
                    MeterNumber: MeterNumber,
                    Amount: Amount,
                    CustomerName: CustomerName,
                    Reference: reference
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_13 = _c.sent();
                console.error("Error fetching bank codes:", err_13);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.buyElectricity = buyElectricity;
var verifyElectricity = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var reqUrl, requestId, data, response, err_14;
    var MeterNumber = _b.MeterNumber, ProviderCode = _b.ProviderCode, ProviderPlanCode = _b.ProviderPlanCode;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Electricity/verifyCustomer";
                requestId = (0, uuid_1.v4)();
                data = {
                    appId: process.env.CASHWYREAPPID,
                    requestId: requestId,
                    country: "NG",
                    businessCode: process.env.CASHWYREBUSINESSCODE,
                    MeterNumber: MeterNumber,
                    ProviderCode: ProviderCode,
                    ProviderPlanCode: ProviderPlanCode
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(reqUrl, data)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Returning the response data
            case 3:
                err_14 = _c.sent();
                console.error("Error fetching bank codes:", err_14);
                return [2 /*return*/, null]; // Return null in case of error
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyElectricity = verifyElectricity;
