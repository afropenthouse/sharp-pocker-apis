import { NextFunction, Request, Response } from "express";

import Joi from "joi";
import ResponseHandler from "../utils/response-handler";

export async function verifySmartCardValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const smartCardSchema = Joi.object({
            smartCardNumber: Joi.string().required(),
        providerCode: Joi.string().required(),
        providerPlanCode: Joi.string().required()
    });

    const validation = smartCardSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}

export async function buyAirtimeValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
        const airtimeSchema = Joi.object({
            network: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            amount: Joi.number().required()
        });

        const validation = airtimeSchema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

            return ResponseHandler.sendErrorResponse({ res, code: 400, error });
        }
        return next()
}

export async function buyCableTvValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
        const cableTvSchema = Joi.object({
            customerName: Joi.string().required(),
            providerCode: Joi.string().required(),
            providerPlanCode: Joi.string().required(),
            smartCardNumber: Joi.string().required(),
            amount: Joi.number().required()
        });

        const validation = cableTvSchema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

            return ResponseHandler.sendErrorResponse({ res, code: 400, error });
        }
        return next()
}

export async function buyDataValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
        const dataSchema = Joi.object({
            providerPlanCode: Joi.string().required(),
            network: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            amount: Joi.number().required()
        });

        const validation = dataSchema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

            return ResponseHandler.sendErrorResponse({ res, code: 400, error });        }
        return next()
}

export async function buyElectricityValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
        const electricitySchema = Joi.object({
            providerCode: Joi.string().required(),
            providerPlanCode: Joi.string().required(),
            meterNumber: Joi.string().required(),
            amount: Joi.number().required(),
            customerName: Joi.string().required()
        });

        const validation = electricitySchema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

            return ResponseHandler.sendErrorResponse({ res, code: 400, error });
        }
        return next()
}

export async function verifyElectricityValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
        const electricitySchema = Joi.object({
            providerPlanCode: Joi.string().required(),
            providerCode: Joi.string().required(),
            meterNumber: Joi.string().required()
        });

        const validation = electricitySchema.validate(req.body);
        if (validation.error) {
            const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

            return ResponseHandler.sendErrorResponse({ res, code: 400, error });
        }
        return next()
}