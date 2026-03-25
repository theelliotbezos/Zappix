import { prisma } from "@/lib/prisma";
import { evolutionClient } from "./client";

/**
 * High-level instance management operations.
 * Wraps Evolution API client with database operations.
 */
export const instanceManager = {
  /** Create a new instance and save to database. */
  async createAndSave(userId: string, instanceName: string) {
    const instance = await evolutionClient.createInstance(instanceName);

    return prisma.whatsAppAccount.create({
      data: {
        userId,
        instanceId: instance.instanceId,
        instanceName,
        status: "CONNECTING",
      },
    });
  },

  /** Update connection status from webhook. */
  async updateConnectionStatus(
    instanceId: string,
    state: "open" | "close" | "connecting"
  ) {
    const statusMap = {
      open: "CONNECTED" as const,
      close: "DISCONNECTED" as const,
      connecting: "CONNECTING" as const,
    };

    return prisma.whatsAppAccount.update({
      where: { instanceId },
      data: {
        status: statusMap[state],
        ...(state === "open" && { lastConnectedAt: new Date() }),
      },
    });
  },

  /** Sync all instances from Evolution API with database. */
  async syncInstances(userId: string) {
    const apiInstances = await evolutionClient.fetchInstances();
    const dbAccounts = await prisma.whatsAppAccount.findMany({
      where: { userId },
    });

    const dbInstanceIds = new Set(dbAccounts.map((a) => a.instanceId));

    // Find instances that exist in API but not in DB
    for (const apiInstance of apiInstances) {
      if (!dbInstanceIds.has(apiInstance.instanceId)) {
        // Check connection state
        const state = await evolutionClient.getConnectionState(
          apiInstance.instanceId
        );
        const statusMap = {
          open: "CONNECTED" as const,
          close: "DISCONNECTED" as const,
          connecting: "CONNECTING" as const,
        };

        await prisma.whatsAppAccount.create({
          data: {
            userId,
            instanceId: apiInstance.instanceId,
            instanceName: apiInstance.instanceName,
            status: statusMap[state.state],
          },
        });
      }
    }
  },
};
