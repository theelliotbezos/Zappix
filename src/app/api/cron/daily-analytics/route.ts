import { NextResponse } from "next/server";
import { inngest } from "@/server/inngest/client";

/**
 * Cron job: Trigger daily analytics aggregation via Inngest.
 * This endpoint can be called by an external cron service (e.g., Upstash QStash).
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INNGEST_SIGNING_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await inngest.send({
    name: "analytics/daily",
    data: { triggeredAt: new Date().toISOString() },
  });

  return NextResponse.json({ message: "Daily analytics job triggered" });
}
