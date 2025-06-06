"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferralCode = exports.generateDeviceId = exports.signRefreshToken = exports.signAccessToken = exports.isDevelopment = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var node_device_detector_1 = __importDefault(require("node-device-detector"));
var crypto_1 = __importDefault(require("crypto"));
var pris_client_1 = __importDefault(require("../prisma/pris-client"));
var isDevelopment = function () {
    return process.env.APP_ENV === "DEV";
};
exports.isDevelopment = isDevelopment;
var signAccessToken = function (_a) {
    var email = _a.email, userId = _a.userId;
    var isDev = (0, exports.isDevelopment)();
    var accessToken = jsonwebtoken_1.default.sign({ userId: userId, email: email }, process.env.JWT_SECRET, { expiresIn: isDev ? "7d" : "7d" });
    return accessToken;
};
exports.signAccessToken = signAccessToken;
var signRefreshToken = function (_a) {
    var userId = _a.userId;
    var isDev = (0, exports.isDevelopment)();
    var refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: isDev ? "30d" : "30d" });
    return refreshToken;
};
exports.signRefreshToken = signRefreshToken;
var generateDeviceId = function (req) {
    var userAgent = req.header("user-agent") || req.headers["user-agent"] || "";
    //gets device objects
    var detector = new node_device_detector_1.default({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500,
    });
    var device = detector.detect(userAgent);
    //device object is used to generate a crypto Id
    var deviceString = JSON.stringify(device);
    var hash = crypto_1.default.createHash('sha256').update(deviceString).digest("hex");
    return hash;
};
exports.generateDeviceId = generateDeviceId;
var generateReferralCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var generate, code, exists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                generate = function () {
                    return Math.random().toString(36).substring(2, 8).toUpperCase();
                };
                code = generate();
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: { referralCode: code },
                    })];
            case 1:
                exists = _a.sent();
                _a.label = 2;
            case 2:
                if (!exists) return [3 /*break*/, 4];
                code = generate();
                return [4 /*yield*/, pris_client_1.default.user.findUnique({
                        where: { referralCode: code },
                    })];
            case 3:
                exists = _a.sent();
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/, code];
        }
    });
}); };
exports.generateReferralCode = generateReferralCode;
