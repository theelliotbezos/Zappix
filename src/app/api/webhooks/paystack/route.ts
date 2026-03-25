import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Paystack webhook handler.
 * Handles subscription events and transfer status updates.
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

  if (reference) {
    await prisma.payment.updateMany({
      where: { paystackReference: reference },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });
  }
}

async function handleSubscriptionDisable(data: Record<string, unknown>) {
  const subscriptionCode = data.subscription_code as string;

  if (subscriptionCode) {
    await prisma.subscription.updateMany({
      where: { paystackSubscriptionCode: subscriptionCode },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
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
    await prisma.withdrawal.updateMany({
      where: { paystackReference: reference },
      data: {
        status: "FAILED",
        failedReason: (data.reason as string) ?? "Transfer failed",
      },
    });
  }
}
