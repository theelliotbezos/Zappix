import { Inngest } from "inngest";

/**
 * Inngest client for Zappix background jobs.
 *
 * Used for scheduling status posts, sending broadcasts,
 * processing payouts, and aggregating analytics.
 */
export const inngest = new Inngest({
  id: "zappix",
  name: "Zappix",
});
