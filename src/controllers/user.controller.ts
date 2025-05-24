import { catchAuthError } from "../middlewares/wrapper";
import prismaClient from "../prisma/pris-client";
import ResponseHandler from "../utils/response-handler";

export const getUserProfileDetail = catchAuthError(async (req, res, next) => {
  const user = await prismaClient.user.findFirst({
    where: { id: req.user?.userId },
  });

  if (!user) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "User does not exist",
      code: 400,
    });
  }

  const profile = await prismaClient.user.findFirst({
    where: { id: user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      isOnboarded: true,
      isMailVerified: true,
      referralCode: true,
      hasCreatedPin: true,
      _count: {
        select: {
          referrals: true,
        },
      },
    },
  });

  return ResponseHandler.sendSuccessResponse({ res, data: profile });
});
