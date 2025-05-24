import prismaClient from "../prisma/pris-client";
import { WebhookDataProd } from "../interfaces/flutterwave.interface";
import { generateTransactionRef } from "../utils/transaction.utiles";
import { TRANSACTION_DESCRIPTION } from "@prisma/client";

export const updateWithdrawalTransaction = async (
  dataFromWebhook: WebhookDataProd
) => {
  const ref = dataFromWebhook.data.reference;

  const transaction = await prismaClient.transactions.findFirst({
    where: { txRef: ref },
  });

  if (!transaction) {
    await prismaClient.errorLogs.create({
      data: {
        txRef: ref,
        logs: `Transaction with reference ${ref} not found`,
      },
    });
    throw new Error("Transaction not found in the database");
  }

  const isSuccess =
    dataFromWebhook.data.status === "successful" ||
    dataFromWebhook.data.status === "SUCCESSFUL";

  if (isSuccess) {
    await prismaClient.transactions.update({
      where: { id: transaction.id },
      data: { status: "SUCCESS" },
    });
  } else {
    // Mark the transaction as failed
    await prismaClient.transactions.update({
      where: { id: transaction.id },
      data: { status: "FAILED" },
    });

    // Fetch user + wallet for refund
    const transactionData = await prismaClient.transactions.findFirst({
      where: { id: transaction.id },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    if (
      transactionData?.description === "OUTWARD_WITHDRAWAL" &&
      transactionData.type === "DEBIT" &&
      transactionData.user.wallet?.id
    ) {
      try {
        const walletUpdate = prismaClient.userWallet.update({
          where: { id: transactionData.user.wallet.id },
          data: {
            balance: {
              increment: transactionData.amount,
            },
          },
        });

        const newTransaction = prismaClient.transactions.create({
          data: {
            txRef: generateTransactionRef(),
            amount: transactionData.amount,
            userId: transactionData.userId,
            description: TRANSACTION_DESCRIPTION.REFUND,
            type: "CREDIT",
          },
        });

        const notification = prismaClient.notifications.create({
          data: {
            userId: transactionData.userId,
            type: "WALLET",
            content: `₦${transactionData.amount} was refunded to your wallet due to a failed withdrawal.`,
          },
        });

        await prismaClient.$transaction([
          walletUpdate,
          newTransaction,
          notification,
        ]);
      } catch (err: any) {
        await prismaClient.errorLogs.create({
          data: {
            txRef: transactionData.txRef,
            logs: `Refund failed: ${err.message}`,
          },
        });
        throw new Error("Refund process failed");
      }
    }
  }
};
