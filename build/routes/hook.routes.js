"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var verifyWebhooks_1 = require("../webhooks/verifyWebhooks");
var hookRoutes = express_1.default.Router();
hookRoutes.route("/flutterwave").post(verifyWebhooks_1.verifyWebHook);
hookRoutes.route("/cashwyre").post(verifyWebhooks_1.verifyCashwyreWebHook);
exports.default = hookRoutes;
