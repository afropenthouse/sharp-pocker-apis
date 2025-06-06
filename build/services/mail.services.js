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
exports.WelcomeMail = exports.ForgotPasswordMail = exports.SignUpMail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var fs_1 = __importDefault(require("fs"));
var handlebars_1 = __importDefault(require("handlebars"));
var path_1 = __importDefault(require("path"));
var SignUpMail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var transporter, sourcePath, source, template, replacement, mailOptions, val, error_1;
    var to = _b.to, name = _b.name, otp = _b.otp;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                transporter = nodemailer_1.default.createTransport({
                    host: process.env.EMAIL_HOST,
                    service: process.env.EMAIL_SERVICE,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                sourcePath = path_1.default.join(__dirname, "..", "templates", "signup.html");
                source = fs_1.default.readFileSync(sourcePath).toString();
                template = handlebars_1.default.compile(source);
                replacement = {
                    name: "".concat(name),
                    otp: otp
                };
                mailOptions = {
                    from: "olamilekan.obisesan1@gmail.com",
                    to: to,
                    subject: "Welcome to Sharp Pocket",
                    html: template(replacement),
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                val = _c.sent();
                console.log(val.response);
                return [2 /*return*/, val.response];
            case 3:
                error_1 = _c.sent();
                console.log(error_1);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.SignUpMail = SignUpMail;
var ForgotPasswordMail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var transporter, sourcePath, source, template, replacement, mailOptions, val, error_2;
    var to = _b.to, otp = _b.otp;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                transporter = nodemailer_1.default.createTransport({
                    host: process.env.EMAIL_HOST,
                    service: process.env.EMAIL_SERVICE,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                sourcePath = path_1.default.join(__dirname, "..", "templates", "reset.html");
                source = fs_1.default.readFileSync(sourcePath).toString();
                template = handlebars_1.default.compile(source);
                replacement = {
                    otp: otp
                };
                mailOptions = {
                    from: "olamilekan.obisesan1@gmail.com",
                    to: to,
                    subject: "Reset Password Code",
                    html: template(replacement),
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                val = _c.sent();
                console.log(val.response);
                return [2 /*return*/, val.response];
            case 3:
                error_2 = _c.sent();
                console.log(error_2);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.ForgotPasswordMail = ForgotPasswordMail;
var WelcomeMail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var transporter, sourcePath, source, template, replacement, mailOptions, val, error_3;
    var to = _b.to, name = _b.name;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                transporter = nodemailer_1.default.createTransport({
                    host: process.env.EMAIL_HOST,
                    service: process.env.EMAIL_SERVICE,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                sourcePath = path_1.default.join(__dirname, "..", "templates", "welcome.html");
                source = fs_1.default.readFileSync(sourcePath).toString();
                template = handlebars_1.default.compile(source);
                replacement = {
                    name: "".concat(name),
                };
                mailOptions = {
                    from: "olamilekan.obisesan1@gmail.com",
                    to: to,
                    subject: "Welcome to Sharp Pocket",
                    html: template(replacement),
                };
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                val = _c.sent();
                console.log(val.response);
                return [2 /*return*/, val.response];
            case 3:
                error_3 = _c.sent();
                console.log(error_3);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.WelcomeMail = WelcomeMail;
