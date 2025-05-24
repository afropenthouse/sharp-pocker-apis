import dotenv from "dotenv"
import app from "./app";
import http from "http";


dotenv.config();

const server = http.createServer(app)
const PORT = process.env.PORT || 3000;

const ENV_KEYS:string[] = [
    "PORT",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_SERVICE",
    "OTP_EXPIRY_MINUTE",
    "FLW_SECRET",
    "FLW_HASH",
    "APP_ENV",
    'SESSION_DURATION'
]

if (ENV_KEYS.some((k) => { return !process.env[k] })) {
    console.log("Server not started! 1 or more Environment Keys Missing")
} else {
    try {
        server.listen(3000, () => console.log(`Server listening on port ${PORT}`));
    } catch (e) {
        console.log('Cannot connect to the server');
    }
}