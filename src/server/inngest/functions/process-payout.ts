import { inngest } from "../client";
import { prisma } from "@/lib/prisma";
import { paystackTransferService } from "@/server/services/paystack-transfer";
import { emailService } from "@/server/services/email";
import { formatNaira } from "@/lib/utils";

/**
 * Inngest function: Process a referral payout via Paystack Transfer.
 */
export const processPayoutFunction = inngest.createFunction(
  {
    id: "payout-process",
    name: "Process Referral Payout",
    retries: 2,
  },
  { event: "payout/process" },
  async ({ event, step }) => {
    const { withdrawalId } = event.data as { withdrawalId: string };

    // Fetch withdrawal and bank account
    const withdrawal = await step.run("fetch-withdrawal", async () => {
      return prisma.withdrawal.findUnique({
        where: { id: withdrawalId },
        include: {
          user: {
            include: { bankAccount: true },
          },
        },
      });
    });

    if (!withdrawal || !withdrawal.user.bankAccount) {
      throw new Error(
        `Withdrawal ${withdrawalId} not found or no bank account`
      );
    }

    // Initiate Paystack transfer
    const transfer = await step.run("initiate-transfer", async () => {
      return paystackTransferService.initiateTransfer({
        amount: withdrawal.amount,
        recipientCode: withdrawal.user.bankAccount!.paystackRecipientCode,
        reason: `Zappix referral payout - ${withdrawal.id}`,
      });
    });

    // Update withdrawal with transfer info
    await step.run("update-withdrawal", async () => {
      await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          paystackTransferCode: transfer.data.transfer_code,
          paystackReference: transfer.data.reference,
        },
      });
    });

    // Wait for transfer completion (poll or handle via webhook)
    // For now, we mark as processing and let the webhook handle completion
    await step.run("send-notification", async () => {
      await emailService.sendPayoutConfirmation(
        withdrawal.user.email,
        withdrawal.user.name ?? "there",
        formatNaira(withdrawal.amount),
        withdrawal.user.bankAccount!.bankName
      );
    });

    return { withdrawalId, transferCode: transfer.data.transfer_code };
  }
);
