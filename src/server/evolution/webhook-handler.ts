import { prisma } from "@/lib/prisma";
import { instanceManager } from "./instance";

/**
 * Process incoming webhooks from Evolution API.
 */

interface WebhookPayload {
  event: string;
  instance: string;
  data: Record<string, unknown>;
}

export async function handleEvolutionWebhook(payload: WebhookPayload) {
  const { event, instance: instanceId, data } = payload;

  switch (event) {
    case "CONNECTION_UPDATE":
      await handleConnectionUpdate(instanceId, data);
      break;

    case "QRCODE_UPDATED":
      await handleQrCodeUpdate(instanceId, data);
      break;

    case "MESSAGES_UPSERT":
      await handleMessageReceived(instanceId, data);
      break;

    case "MESSAGES_UPDATE":
      await handleMessageUpdate(instanceId, data);
      break;

    case "SEND_MESSAGE":
      await handleMessageSent(instanceId, data);
      break;

    case "CONTACTS_UPSERT":
      await handleContactsUpdate(instanceId, data);
      break;

    default:
      console.log(`Unhandled Evolution webhook event: ${event}`);
  }
}

async function handleConnectionUpdate(
  instanceId: string,
  data: Record<string, unknown>
) {
  const state = data.state as "open" | "close" | "connecting";
  await instanceManager.updateConnectionStatus(instanceId, state);
}

async function handleQrCodeUpdate(
  instanceId: string,
  data: Record<string, unknown>
) {
  // QR code updates are handled via polling from the frontend.
  // We could store the latest QR in Redis for faster access.
  console.log(`QR code updated for instance ${instanceId}`);
}

async function handleMessageReceived(
  instanceId: string,
  data: Record<string, unknown>
) {
  // Process incoming messages for chatbot/menu bot responses
  // TODO: Route to chatbot handler based on account config
  console.log(`Message received on instance ${instanceId}`);
}

async function handleMessageUpdate(
  instanceId: string,
  data: Record<string, unknown>
) {
  // Update delivery status for broadcasts
  console.log(`Message status updated on instance ${instanceId}`);
}

async function handleMessageSent(
  instanceId: string,
  data: Record<string, unknown>
) {
  // Confirm message sent for status posts and broadcasts
  console.log(`Message sent confirmed on instance ${instanceId}`);
}

async function handleContactsUpdate(
  instanceId: string,
  data: Record<string, unknown>
) {
  // Sync contacts from WhatsApp to the contacts database
  console.log(`Contacts updated on instance ${instanceId}`);
}
