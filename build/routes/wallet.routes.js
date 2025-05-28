"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
var wallet_validation_1 = require("../validations/wallet.validation");
var wallet_controller_1 = require("../controllers/wallet.controller");
var walletRoutes = express_1.default.Router();
walletRoutes.use(verifyAccessToken_1.verifyAccessToken);
walletRoutes.route('/create-virtual-account').post(wallet_validation_1.CreateVirtualWalletValidation, wallet_controller_1.createVirtualAccountNumber); //done
walletRoutes.route("/pin/create").post(wallet_validation_1.createPinValidation, wallet_controller_1.createPin); //done
walletRoutes.route("/info").get(wallet_controller_1.getWalletInfo); // done
walletRoutes.route("/banks/all").get(wallet_controller_1.getAllBanks); // done
walletRoutes.route("/verify-account").post(wallet_validation_1.verifyAccountValidation, wallet_controller_1.verifyAccountNumber); // done 
walletRoutes.route("/withdraw").post(wallet_validation_1.cashwyreWalletWithdrawalValidation, wallet_controller_1.withdrawToExternalBankCashwyre); // done
exports.default = walletRoutes;
