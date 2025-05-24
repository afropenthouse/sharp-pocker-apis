import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { cashwyreWalletWithdrawalValidation, createPinValidation, CreateVirtualWalletValidation, verifyAccountValidation } from "../validations/wallet.validation"
import { createPin, createVirtualAccountNumber, getAllBanks, getWalletInfo, verifyAccountNumber, withdrawToExternalBankCashwyre } from "../controllers/wallet.controller"

const walletRoutes = express.Router()
walletRoutes.use(verifyAccessToken)

walletRoutes.route('/create-virtual-account').post(CreateVirtualWalletValidation,createVirtualAccountNumber) //done
walletRoutes.route("/pin/create").post(createPinValidation,createPin) //done
walletRoutes.route("/info").get(getWalletInfo) // done
walletRoutes.route("/banks/all").get(getAllBanks) // done
walletRoutes.route("/verify-account").post(verifyAccountValidation,verifyAccountNumber) // done 
walletRoutes.route("/withdraw").post(cashwyreWalletWithdrawalValidation,withdrawToExternalBankCashwyre) // done


export default walletRoutes