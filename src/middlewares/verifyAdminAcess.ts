import { Response, NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { IExpressRequest } from '../interfaces/user.interface';

export const verifyAdminAccess = async (req: IExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  const user = req.user;

  if (!user) {
    return ResponseHandler.sendErrorResponse({
      res,  
      error: "Unauthorized access",
      code: 401,
    });
  }

  // Get admin emails from environment variable
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  
  if (adminEmails.length === 0) {
    console.error('ADMIN_EMAILS environment variable not set or empty');
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Admin access configuration error",
      code: 500,
    });
  }

  // Check if user's email is in the admin list
  if (!adminEmails.includes(user.email)) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "Admin access required",
      code: 403,
    });
  }

  // User is an admin, proceed to next middleware/controller
  return next();
};