import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { getAirtimeOption, getDataOption, getElectricityOption, getCableOption, buyAirtimeController, buyCableTvController, buyDataController, buyElectricityController, verifySmartCardController, verifyElectricityController } from "../controllers/services.controllers"
import { buyAirtimeValidation, buyCableTvValidation, buyDataValidation, buyElectricityValidation, verifySmartCardValidation, verifyElectricityValidation } from "../validations/services.validation"    


const servicesRoutes = express.Router()

servicesRoutes.use(verifyAccessToken)

servicesRoutes.route("/airtime").get(getAirtimeOption)
servicesRoutes.route("/data").get(getDataOption)
servicesRoutes.route("/electricity").get(getElectricityOption)
servicesRoutes.route("/cable").get(getCableOption)
servicesRoutes.route("/airtime").post(buyAirtimeValidation, buyAirtimeController)
servicesRoutes.route("/cable").post(buyCableTvValidation, buyCableTvController)
servicesRoutes.route("/data").post(buyDataValidation, buyDataController)
servicesRoutes.route("/electricity").post(buyElectricityValidation, buyElectricityController)
servicesRoutes.route("/smartcard").post(verifySmartCardValidation, verifySmartCardController)
servicesRoutes.route("/electricity/verify").post(verifyElectricityValidation, verifyElectricityController)

export default servicesRoutes