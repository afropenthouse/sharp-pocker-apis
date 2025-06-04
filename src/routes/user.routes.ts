import express from "express"
import { getUserProfileDetail, getUserNotifications } from "../controllers/user.controller"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
const userRoutes = express.Router()


userRoutes.route("/profile").get(verifyAccessToken,getUserProfileDetail)
userRoutes.route("/notifications").get(verifyAccessToken,getUserNotifications)

export default userRoutes
