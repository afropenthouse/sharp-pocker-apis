import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { createPinValidation, CreateVirtualWalletValidation, inAppTransferValidation, verifyAccountValidation, walletWithdrawalValidation } from "../validations/wallet.validation"
import { createPin, createVirtualAccountNumber, getAllBanks, getWalletInfo, inAppTransfer, verifyAccountNumber, withdrawToExternalBank } from "../controllers/wallet.controller"

const walletRoutes = express.Router()
walletRoutes.use(verifyAccessToken)

walletRoutes.route('/create-virtual-account').post(CreateVirtualWalletValidation,createVirtualAccountNumber)
walletRoutes.route("/pin/create").post(createPinValidation,createPin)
walletRoutes.route("/info").get(getWalletInfo)
walletRoutes.route("/banks/all").get(getAllBanks)
walletRoutes.route("/verify-account").post(verifyAccountValidation,verifyAccountNumber)
walletRoutes.route("/in-app-transfer").post(inAppTransferValidation,inAppTransfer)
walletRoutes.route("/withdraw").post(walletWithdrawalValidation,withdrawToExternalBank)


export default walletRoutes