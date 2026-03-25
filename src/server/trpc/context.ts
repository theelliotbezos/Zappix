import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const { userId: clerkId } = await auth();

  let user = null;
  if (clerkId) {
    user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        subscription: { include: { plan: true } },
      },
    });
  }

  return {
    user,
    clerkId,
    prisma,
    headers: opts?.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
