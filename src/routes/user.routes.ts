    import express from "express"
import { getUserProfileDetail } from "../controllers/user.controller"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
const userRoutes = express.Router()


userRoutes.route("/profile").get(verifyAccessToken,getUserProfileDetail)

export default userRoutes
