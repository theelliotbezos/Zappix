import { serve } from "inngest/next";
import { inngest } from "@/server/inngest/client";
import { scheduleStatusFunction } from "@/server/inngest/functions/schedule-status";
import { sendBroadcastFunction } from "@/server/inngest/functions/send-broadcast";
import { processPayoutFunction } from "@/server/inngest/functions/process-payout";
import { dailyAnalyticsFunction } from "@/server/inngest/functions/daily-analytics";
import { releaseCommissionsFunction } from "@/server/inngest/functions/release-commissions";

/**
 * Inngest API route handler.
 * Serves all Inngest functions for background job processing.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    scheduleStatusFunction,
    sendBroadcastFunction,
    processPayoutFunction,
    dailyAnalyticsFunction,
    releaseCommissionsFunction,
  ],
});
