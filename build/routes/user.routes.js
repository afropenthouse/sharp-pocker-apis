"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
var userRoutes = express_1.default.Router();
userRoutes.route("/profile").get(verifyAccessToken_1.verifyAccessToken, user_controller_1.getUserProfileDetail);
exports.default = userRoutes;
