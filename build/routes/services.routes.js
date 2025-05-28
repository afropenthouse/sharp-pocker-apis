"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyAccessToken_1 = require("../middlewares/verifyAccessToken");
var services_controllers_1 = require("../controllers/services.controllers");
var servicesRoutes = express_1.default.Router();
servicesRoutes.use(verifyAccessToken_1.verifyAccessToken);
servicesRoutes.route("/airtime").get(services_controllers_1.getAirtimeOption);
servicesRoutes.route("/data").get(services_controllers_1.getDataOption);
servicesRoutes.route("/electricity").get(services_controllers_1.getElectricityOption);
servicesRoutes.route("/cable").get(services_controllers_1.getCableOption);
exports.default = servicesRoutes;
