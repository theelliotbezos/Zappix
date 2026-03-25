import { NextResponse } from "next/server";
import { handleEvolutionWebhook } from "@/server/evolution/webhook-handler";

/**
 * Evolution API webhook handler.
 * Receives events from the Evolution API on Railway.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify webhook secret if configured
    const webhookSecret = process.env.EVOLUTION_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${webhookSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    await handleEvolutionWebhook(payload);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Evolution webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
