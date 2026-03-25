import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/utils";
import { NextResponse } from "next/server";

/**
 * Clerk webhook handler.
 * Syncs user creation and updates from Clerk to the Neon database.
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = event.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const email = email_addresses[0]?.email_address;
    if (!email) {
      return NextResponse.json(
        { error: "No email found" },
        { status: 400 }
      );
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    // Create user in database
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        email,
        name,
        image: image_url,
      },
    });

    // Generate referral code
    await prisma.referralCode.create({
      data: {
        userId: user.id,
        code: generateReferralCode(),
      },
    });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email ?? undefined,
        name,
        image: image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = event.data;
    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
