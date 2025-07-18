import express from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { verifyAdminAccess } from "../middlewares/verifyAdminAcess"
import { getAdminStats, getAllUsers, getAllTransactions, getUserDetails } from "../controllers/admin.controller"

const adminRoutes = express.Router()

// Apply auth middleware to all admin routes
adminRoutes.use(verifyAccessToken)

// Apply admin access verification to all admin routes
adminRoutes.use(verifyAdminAccess)

// Admin dashboard stats
adminRoutes.route("/stats").get(getAdminStats)

// User management
adminRoutes.route("/users").get(getAllUsers)
adminRoutes.route("/users/:userId").get(getUserDetails)

// Transaction management
adminRoutes.route("/transactions").get(getAllTransactions)

export default adminRoutes