"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var services_routes_1 = __importDefault(require("./routes/services.routes"));
var wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
var hook_routes_1 = __importDefault(require("./routes/hook.routes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
    // credentials: true
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
app.use("/wallet", wallet_routes_1.default);
app.use('/services', services_routes_1.default);
app.use('/hook', hook_routes_1.default);
app.get('/', function (req, res) {
    return res.status(200).json({ message: 'Welcome to Sharp Money APIs' });
});
app.all('*', function (req, res) {
    return res.status(404).json({ message: 'Route not found' });
});
exports.default = app;
