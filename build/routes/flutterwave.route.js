"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// import { verifyWebHook } from "../webhooks/verifyWebHook"
var flutterwaveRoutes = express_1.default.Router();
// flutterwaveRoutes.route("/").post(verifyWebHook)
exports.default = flutterwaveRoutes;
