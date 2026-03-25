import { createTRPCRouter } from "./root";
import { userRouter } from "./routers/user";
import { whatsappRouter } from "./routers/whatsapp";
import { statusRouter } from "./routers/status";
import { broadcastRouter } from "./routers/broadcast";
import { contactRouter } from "./routers/contact";
import { analyticsRouter } from "./routers/analytics";
import { referralRouter } from "./routers/referral";
import { adSlotRouter } from "./routers/ad-slot";
import { botRouter } from "./routers/bot";
import { billingRouter } from "./routers/billing";
import { teamRouter } from "./routers/team";

/**
 * The root tRPC router for the Zappix app.
 * All sub-routers are merged here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  whatsapp: whatsappRouter,
  status: statusRouter,
  broadcast: broadcastRouter,
  contact: contactRouter,
  analytics: analyticsRouter,
  referral: referralRouter,
  adSlot: adSlotRouter,
  bot: botRouter,
  billing: billingRouter,
  team: teamRouter,
});

export type AppRouter = typeof appRouter;
