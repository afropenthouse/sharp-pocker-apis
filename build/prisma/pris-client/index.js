"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
//omit sensitive fields globally
var prismaClient = new client_1.PrismaClient({
    omit: {
        user: {
            password: false,
            pin: false
        }
    }
});
exports.default = prismaClient;
