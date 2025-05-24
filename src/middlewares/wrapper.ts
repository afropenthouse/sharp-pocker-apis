import { Request, Response, NextFunction, RequestHandler } from 'express';

import ResponseHandler from '../utils/response-handler';
import { IExpressRequest } from '../interfaces/user.interface';
import * as core from 'express-serve-static-core';


type ExpressQuest = Request<core.ParamsDictionary, any,any>

type CustomHandler = ExpressQuest & IExpressRequest

type CustomRequestHandler = 
    (req: CustomHandler, res: Response<any>, next: NextFunction) => Promise<(Response<any, Record<string, any>>) | void>;
    
type authRequestHandler = 
(req: ExpressQuest, res: Response<any>, next: NextFunction) => Promise<(Response<any, Record<string, any>>) | void>;

//todo, add an error log here
const catchDefaultError = (handler: authRequestHandler) => {
    return (req:Request, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch((error) => {
            console.error('Error caught in catchAsync:', error);
            ResponseHandler.sendErrorResponse({res,code:500,error:"Entity could not be processed, try again"})
        });
    };
};

const catchAuthError = (handler: CustomRequestHandler) => {
    return (req:IExpressRequest, res: Response, next: NextFunction) => {
        Promise.resolve(handler(req, res, next)).catch((error) => {
            console.error('Error caught in catchAsync:', error);
            ResponseHandler.sendErrorResponse({res,code:500,error:"Entity could not be processed, try again"})
        });
    };
};

export {catchDefaultError,catchAuthError};