import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { REFERRAL_COMMISSION_PERCENT } from "@/lib/constants";

/**
 * Paystack webhook handler.
 * Handles subscription events, ad booking payments, and transfer status updates.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("x-paystack-signature");

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "subscription.create":
      await handleSubscriptionCreate(event.data);
      break;

    case "charge.success":
      await handleChargeSuccess(event.data);
      break;

    case "subscription.disable":
      await handleSubscriptionDisable(event.data);
      break;

    case "transfer.success":
      await handleTransferSuccess(event.data);
      break;

    case "transfer.failed":
      await handleTransferFailed(event.data);
      break;

    default:
      console.log(`Unhandled Paystack event: ${event.event}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionCreate(data: Record<string, unknown>) {
  // Update subscription record with Paystack codes
  const customerCode = (data.customer as Record<string, unknown>)
    ?.customer_code as string;

  if (customerCode) {
    const subscription = await prisma.subscription.findFirst({
      where: { paystackCustomerCode: customerCode },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          paystackSubscriptionCode: data.subscription_code as string,
          status: "ACTIVE",
        },
      });
    }
  }
}

async function handleChargeSuccess(data: Record<string, unknown>) {
  const reference = data.reference as string;
  const metadata = data.metadata as Record<string, unknown> | undefined;

  if (!reference) return;

  // Check if this is an ad booking payment
  if (metadata?.type === "ad_booking") {
    await prisma.adBooking.updateMany({
      where: { paystackReference: reference },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });
    return;
  }

  // Subscription payment
  await prisma.payment.updateMany({
    where: { paystackReference: reference },
    data: {
      status: "SUCCESS",
      paidAt: new Date(),
    },
  });

  // Check if this payment is from a referred user and create commission
  if (metadata?.userId) {
    const userId = metadata.userId as string;
    const amount = data.amount as number;

    const referral = await prisma.referral.findUnique({
      where: { referredUserId: userId },
    });

    if (referral && referral.status !== "CHURNED") {
      // Calculate 25% commission
      const commissionAmount = Math.floor(
        (amount * REFERRAL_COMMISSION_PERCENT) / 100
      );

      // Update referral status to subscribed
      await prisma.referral.update({
        where: { id: referral.id },
        data: { status: "SUBSCRIBED" },
      });

      // Create pending commission
      await prisma.commission.create({
        data: {
          referralId: referral.id,
          amount: commissionAmount,
          status: "PENDING",
        },
      });
    }
  }
}

async function handleSubscriptionDisable(data: Record<string, unknown>) {
  const subscriptionCode = data.subscription_code as string;

  if (subscriptionCode) {
    const subscription = await prisma.subscription.findFirst({
      where: { paystackSubscriptionCode: subscriptionCode },
    });

    if (subscription) {
      await prisma.subscription.updateMany({
        where: { paystackSubscriptionCode: subscriptionCode },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });

      // Mark any referral as churned
      await prisma.referral.updateMany({
        where: { referredUserId: subscription.userId, status: "SUBSCRIBED" },
        data: { status: "CHURNED" },
      });
    }
  }
}

async function handleTransferSuccess(data: Record<string, unknown>) {
  const reference = data.reference as string;

  if (reference) {
    await prisma.withdrawal.updateMany({
      where: { paystackReference: reference },
      data: {
        status: "COMPLETED",
        processedAt: new Date(),
      },
    });
  }
}

async function handleTransferFailed(data: Record<string, unknown>) {
  const reference = data.reference as string;

  if (reference) {
    const withdrawal = await prisma.withdrawal.findFirst({
      where: { paystackReference: reference },
    });

    if (withdrawal) {
      await prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: {
          status: "FAILED",
          failedReason: (data.reason as string) ?? "Transfer failed",
        },
      });

      // Restore commissions back to AVAILABLE
      // The withdrawal amount should be converted back to available commissions
      // This is handled by the next commission release cycle
    }
  }
}
