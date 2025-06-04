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

export const getUserNotifications = catchAuthError(async (req, res, next) => {
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

  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, totalCount] = await Promise.all([
    prismaClient.notifications.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
      select: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
      },
    }),
    prismaClient.notifications.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  return ResponseHandler.sendSuccessResponse({
    res,
    data: {
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount,
        hasNextPage: Number(page) < totalPages,
        hasPreviousPage: Number(page) > 1,
      },
    },
  });
});
