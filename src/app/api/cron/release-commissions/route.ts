import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COMMISSION_HOLD_DAYS } from "@/lib/constants";

/**
 * Cron job: Release commissions after the hold period.
 * Run daily to move PENDING commissions to AVAILABLE.
 * Also handled by Inngest function as backup.
 */
export async function GET(req: Request) {
  // Verify cron secret (use a header or query param)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INNGEST_SIGNING_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const holdDate = new Date();
  holdDate.setDate(holdDate.getDate() - COMMISSION_HOLD_DAYS);

  // Only release commissions where the referred user is still subscribed
  const pendingCommissions = await prisma.commission.findMany({
    where: {
      status: "PENDING",
      createdAt: { lte: holdDate },
    },
    include: {
      referral: {
        select: { status: true },
      },
    },
  });

  let released = 0;
  let voided = 0;

  for (const commission of pendingCommissions) {
    if (commission.referral.status === "SUBSCRIBED") {
      await prisma.commission.update({
        where: { id: commission.id },
        data: {
          status: "AVAILABLE",
          releasedAt: new Date(),
        },
      });
      released++;
    } else if (commission.referral.status === "CHURNED") {
      await prisma.commission.delete({
        where: { id: commission.id },
      });
      voided++;
    }
  }

  return NextResponse.json({
    checked: pendingCommissions.length,
    released,
    voided,
    message: `Released ${released} commissions, voided ${voided}`,
  });
}
