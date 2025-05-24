import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { getAirtimeOption, getDataOption, getElectricityOption, getCableOption } from "../controllers/services.controllers"



const servicesRoutes = express.Router()

servicesRoutes.use(verifyAccessToken)

servicesRoutes.route("/airtime").get(getAirtimeOption)
servicesRoutes.route("/data").get(getDataOption)
servicesRoutes.route("/electricity").get(getElectricityOption)
servicesRoutes.route("/cable").get(getCableOption)

export default servicesRoutes