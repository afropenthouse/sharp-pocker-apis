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
exports.verifyCashwyreWebHook = exports.verifyWebHook = void 0;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
var flutterwave_services_1 = require("../services/flutterwave.services");
var token_utils_1 = require("../utils/token.utils");
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var auth_utils_1 = require("../utils/auth.utils");
var flutterwave_controller_1 = require("../controllers/flutterwave.controller");
var useWebhookData_1 = require("./useWebhookData");
var verifyWebHook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dataFromWebhook, isDev, isValid, flw_verification, e_1, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                console.log(req.headers);
                // Verify webhook payload comes from Flutterwave using the secret hash set in the Flutterwave Settings, if not return
                if (req.headers['verif-hash'] !== process.env.FLW_HASH) {
                    response_handler_1.default.sendSuccessResponse({ res: res, code: 200, message: "Received Invalid hash key" });
                    return [2 /*return*/];
                }
                dataFromWebhook = req.body;
                isDev = (0, token_utils_1.isDevelopment)();
                if (!!isDev) return [3 /*break*/, 4];
                if (!(dataFromWebhook['event.type'] === "Transfer")) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, flutterwave_services_1.verifyTransferReference)({ transferId: dataFromWebhook.data.id })];
            case 1:
                isValid = _a.sent();
                if (!isValid) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction Not Successful" })];
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, (0, flutterwave_services_1.flwTransactionVerification)({ txRef: dataFromWebhook.data.tx_ref })];
            case 3:
                flw_verification = _a.sent();
                if (!flw_verification) {
                    return [2 /*return*/, response_handler_1.default.sendErrorResponse({ res: res, error: "Transaction has been compromised" })];
                }
                _a.label = 4;
            case 4:
                // DO not await processing
                response_handler_1.default.sendSuccessResponse({ res: res, code: 200, message: "Received" });
                _a.label = 5;
            case 5:
                _a.trys.push([5, 12, , 14]);
                if (!(dataFromWebhook['event.type'] === "BANK_TRANSFER_TRANSACTION")) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, flutterwave_controller_1.channelWebHookData)(dataFromWebhook)];
            case 6:
                _a.sent();
                return [3 /*break*/, 11];
            case 7:
                if (!(dataFromWebhook["event.type"] === "Transfer")) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, useWebhookData_1.updateWithdrawalTransaction)(dataFromWebhook)];
            case 8:
                _a.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                    data: {
                        txRef: dataFromWebhook.data.tx_ref,
                        logs: "Event ".concat(dataFromWebhook['event.type'], " was received and could not be processed")
                    }
                })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: return [3 /*break*/, 14];
            case 12:
                e_1 = _a.sent();
                console.log("An error occurred processing webhook");
                console.log(e_1);
                error = (0, auth_utils_1.stringifyError)(e_1);
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: dataFromWebhook.data.tx_ref || dataFromWebhook.data.reference || "",
                            logs: (0, auth_utils_1.stringifyError)(error)
                        }
                    })];
            case 13:
                _a.sent();
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.verifyWebHook = verifyWebHook;
var verifyCashwyreWebHook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var dataFromWebhook, e_2, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                console.log(req.headers);
                dataFromWebhook = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 8]);
                if (!dataFromWebhook["eventType"]) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, useWebhookData_1.updateCashwyreWithDrawalTransaction)(dataFromWebhook)];
            case 2:
                _a.sent();
                return [2 /*return*/, response_handler_1.default.sendSuccessResponse({ res: res, code: 200, message: "Received webhook" })];
            case 3: return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                    data: {
                        txRef: dataFromWebhook["eventData"].reference,
                        logs: "Event ".concat(dataFromWebhook['eventType'], " was received and could not be processed")
                    }
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6:
                e_2 = _a.sent();
                console.log("An error occurred processing webhook");
                console.log(e_2);
                error = (0, auth_utils_1.stringifyError)(e_2);
                return [4 /*yield*/, pris_client_1.default.errorLogs.create({
                        data: {
                            txRef: dataFromWebhook["eventData"].reference,
                            logs: (0, auth_utils_1.stringifyError)(error)
                        }
                    })];
            case 7:
                _a.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.verifyCashwyreWebHook = verifyCashwyreWebHook;
