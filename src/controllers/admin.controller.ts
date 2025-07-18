import { Prisma, SERVICE_TYPE } from "@prisma/client";
import { catchAuthError } from "../middlewares/wrapper";
import prismaClient from "../prisma/pris-client";
import ResponseHandler from "../utils/response-handler";

export const getAdminStats = catchAuthError(async (req, res, next) => {
  // Get total users count
  const totalUsers = await prismaClient.user.count();

  // Get total transactions count
  const totalTransactions = await prismaClient.transactions.count();

  // Get total wallet balance across all users
  const totalWalletBalance = await prismaClient.userWallet.aggregate({
    _sum: {
      balance: true,
    },
  });

  // Get total revenue/volume (sum of all successful transactions)
  const totalRevenue = await prismaClient.transactions.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "SUCCESS",
    },
  });

  // Get amount spent on each bill type
  const billTypeBreakdown = await prismaClient.billTransaction.groupBy({
    by: ["serviceType"],
    _sum: {
      amount: true,
    },
    where: {
      status: "SUCCESS",
    },
  });

  // Format bill type breakdown for easier consumption
  const formattedBillBreakdown = {
    AIRTIME: 0,
    DATA: 0,
    ELECTRICITY: 0,
    CABLE: 0,
    OTHER: 0,
  };

  billTypeBreakdown.forEach((item) => {
    formattedBillBreakdown[item.serviceType] = item._sum.amount || 0;
  });

  const stats = {
    totalUsers,
    totalTransactions,
    totalWalletBalance: totalWalletBalance._sum.balance || 0,
    totalRevenue: totalRevenue._sum.amount || 0,
    billTypeBreakdown: formattedBillBreakdown,
  };

  return ResponseHandler.sendSuccessResponse({
    res,
    data: stats,
    message: "Admin stats retrieved successfully",
  });
});

export const getAllUsers = catchAuthError(async (req, res, next) => {
  const { page = 1, limit = 20, search = "" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereClause = search
    ? {
        OR: [
          { firstName: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search as string, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prismaClient.user.findMany({
      where: whereClause,
      include: {
        wallet: {
          select: {
            balance: true,
            referralBalance: true,
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prismaClient.user.count({ where: whereClause }),
  ]);

  const formattedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    walletBalance: user.wallet?.balance || 0,
    totalTransactions: user._count.transactions,
    joinDate: user.createdAt,
  }));

  const totalPages = Math.ceil(totalCount / Number(limit));

  return ResponseHandler.sendSuccessResponse({
    res,
    data: {
      users: formattedUsers,
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

export const getAllTransactions = catchAuthError(async (req, res, next) => {
  const { page = 1, limit = 20, status, type, startDate, endDate } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build where clause based on filters
  const whereClause: any = {};

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) {
      whereClause.createdAt.gte = new Date(startDate as string);
    }
    if (endDate) {
      whereClause.createdAt.lte = new Date(endDate as string);
    }
  }

  const [transactions, totalCount] = await Promise.all([
    prismaClient.transactions.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        billTransaction: {
          select: {
            serviceType: true,
            provider: true,
            phoneNumber: true,
            accountNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prismaClient.transactions.count({ where: whereClause }),
  ]);

  const formattedTransactions = transactions.map((transaction) => ({
    id: transaction.id,
    txRef: transaction.txRef,
    amount: transaction.amount,
    status: transaction.status,
    type: transaction.type,
    description: transaction.description,
    createdAt: transaction.createdAt,
    user: {
      name: `${transaction.user.firstName} ${transaction.user.lastName}`,
      email: transaction.user.email,
    },
    billInfo: transaction.billTransaction
      ? {
          serviceType: transaction.billTransaction.serviceType,
          provider: transaction.billTransaction.provider,
          phoneNumber: transaction.billTransaction.phoneNumber,
          accountNumber: transaction.billTransaction.accountNumber,
        }
      : null,
  }));

  const totalPages = Math.ceil(totalCount / Number(limit));

  return ResponseHandler.sendSuccessResponse({
    res,
    data: {
      transactions: formattedTransactions,
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

export const getUserDetails = catchAuthError(async (req, res, next) => {
  const { userId } = req.params;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      _count: {
        select: {
          transactions: true,
          billTransactions: true,
          referrals: true,
        },
      },
    },
  });

  if (!user) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: "User not found",
      code: 404,
    });
  }

  const userDetails = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    joinDate: user.createdAt,
    wallet: {
      id: user.wallet?.id,
      balance: user.wallet?.balance || 0,
      walletRef: user.wallet?.walletRef,
      lastWithdrawalAt: user.wallet?.lastWithdrawalAt,
      lastDepositedAt: user.wallet?.lastDepositedAt,
      virtualAccountNumber: user.wallet?.virtualAccountNumber,
      virtualAccountBankName: user.wallet?.virtualAccountBankName,
      virtualAccountCreatedAt: user.wallet?.virtualAccountCreatedAt,
      createdAt: user.wallet?.createdAt,
      updatedAt: user.wallet?.updatedAt,
    },
    stats: {
      totalTransactions: user._count.transactions,
      totalBillTransactions: user._count.billTransactions,
      totalReferrals: user._count.referrals,
    },
  };

  return ResponseHandler.sendSuccessResponse({
    res,
    data: userDetails,
  });
});