import { catchAuthError } from "../middlewares/wrapper";
import { getAirtimeOptions, getCableOptions, getElectricityOptions, getDataOptions } from "../services/cashwyre.services";
import ResponseHandler from "../utils/response-handler";

export const getAirtimeOption = catchAuthError(async (req, res, next) => {
    const airtimeOptions = await getAirtimeOptions();
    if (!airtimeOptions) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Service is temporally  unavailable",
        code: 500,
      });
    }
    return ResponseHandler.sendSuccessResponse({ res, data: airtimeOptions.data });
  });



export const getCableOption = catchAuthError(async (req, res, next) => {
    const cableOptions = await getCableOptions();
    if (!cableOptions) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Service is temporally  unavailable",
        code: 500,
        });
    }
    return ResponseHandler.sendSuccessResponse({ res, data: cableOptions.data });
  });


export const getElectricityOption = catchAuthError(async (req, res, next) => {
    const electricityOptions = await getElectricityOptions();
    if (!electricityOptions) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Service is temporally  unavailable",
        code: 500,
        });
    }
    return ResponseHandler.sendSuccessResponse({ res, data: electricityOptions.data });
  });


            export const getDataOption = catchAuthError(async (req, res, next) => {
    const dataOptions = await getDataOptions();
    if (!dataOptions) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: "Service is temporally  unavailable",
        code: 500,
        });
    }
    return ResponseHandler.sendSuccessResponse({ res, data: dataOptions.data });
  });

