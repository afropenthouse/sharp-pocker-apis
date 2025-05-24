import express from "express"
import { verifyWebHook, verifyCashwyreWebHook } from "../webhooks/verifyWebhooks"



const hookRoutes = express.Router()


hookRoutes.route("/flutterwave").post(verifyWebHook)
hookRoutes.route("/cashwyre").post(verifyCashwyreWebHook)


export default hookRoutes   