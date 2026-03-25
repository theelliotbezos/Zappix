import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COMMISSION_HOLD_DAYS } from "@/lib/constants";

/**
 * Cron job: Release commissions after the hold period.
 * Run monthly to move PENDING commissions to AVAILABLE.
 */
export async function GET(req: Request) {
  // Verify cron secret (use a header or query param)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INNGEST_SIGNING_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const holdDate = new Date();
  holdDate.setDate(holdDate.getDate() - COMMISSION_HOLD_DAYS);

  const result = await prisma.commission.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lte: holdDate },
    },
    data: {
      status: "AVAILABLE",
      releasedAt: new Date(),
    },
  });

  return NextResponse.json({
    released: result.count,
    message: `Released ${result.count} commissions`,
  });
}
