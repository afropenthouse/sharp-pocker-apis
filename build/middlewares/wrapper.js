"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAuthError = exports.catchDefaultError = void 0;
var response_handler_1 = __importDefault(require("../utils/response-handler"));
//todo, add an error log here
var catchDefaultError = function (handler) {
    return function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(function (error) {
            console.error('Error caught in catchAsync:', error);
            response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Entity could not be processed, try again" });
        });
    };
};
exports.catchDefaultError = catchDefaultError;
var catchAuthError = function (handler) {
    return function (req, res, next) {
        Promise.resolve(handler(req, res, next)).catch(function (error) {
            console.error('Error caught in catchAsync:', error);
            response_handler_1.default.sendErrorResponse({ res: res, code: 500, error: "Entity could not be processed, try again" });
        });
    };
};
exports.catchAuthError = catchAuthError;
