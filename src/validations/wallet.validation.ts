import Joi from "joi";
import ResponseHandler from "../utils/response-handler";
import { NextFunction, Request, Response } from "express";

export async function CreateVirtualWalletValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const walletSchema = Joi.object({
        nin: Joi.string().length(11).required(),
        pin: Joi.string().length(4).required()
    });

    const validation = walletSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}

export async function createPinValidation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const pinSchema = Joi.object({
        pin: Joi.string().length(4).required(),
    });
  
    const validation = pinSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next();
  }

  export async function walletWithdrawalValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{

    const accountSchema = Joi.object({
        accountNumber: Joi.string().required(),
        bankCode: Joi.string().required(),
        amount: Joi.number().required()
    });

    const validation = accountSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    if(req.body.amount < 100){
        return ResponseHandler.sendErrorResponse({res,error:"Minimum withdrawal amount is NGN 100"})
    }
    return next()
}

export async function verifyAccountValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{

    const accountSchema = Joi.object({
        accountNumber: Joi.string().required(),
        bankCode: Joi.string().required(),
    });

    const validation = accountSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}
export async function inAppTransferValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{
    const walletSchema = Joi.object({
        email: Joi.string().email().required(),
        pin: Joi.string().required(),
        amount: Joi.number().positive().min(50).required()
    });

    const validation = walletSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    return next()
}


export async function cashwyreWalletWithdrawalValidation (req:Request,
    res:Response,
    next:NextFunction):Promise<Response | void>{

    const accountSchema = Joi.object({
        accountNumber: Joi.string().required(),
        bankCode: Joi.string().required(),
        accountName: Joi.string().required(),
        amount: Joi.number().required(),
        pin: Joi.string().required()
    });

    const validation = accountSchema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    if(req.body.amount < 100){
        return ResponseHandler.sendErrorResponse({res,error:"Minimum withdrawal amount is NGN 100"})
    }
    return next()
}