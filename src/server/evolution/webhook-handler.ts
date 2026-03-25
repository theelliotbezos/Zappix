import { prisma } from "@/lib/prisma";
import { instanceManager } from "./instance";
import { evolutionClient } from "./client";

/**
 * Process incoming webhooks from Evolution API.
 */

interface WebhookPayload {
  event: string;
  instance: string;
  data: Record<string, unknown>;
}

interface MessageData {
  key?: {
    remoteJid?: string;
    fromMe?: boolean;
    id?: string;
  };
  message?: Record<string, unknown>;
  messageType?: string;
  pushName?: string;
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
  const messageData = data as unknown as MessageData;
  const key = messageData.key;

  // Skip messages from self
  if (!key || key.fromMe) return;

  const senderJid = key.remoteJid;
  if (!senderJid) return;

  // Extract sender phone number from JID (format: 234XXXXXXXX@s.whatsapp.net)
  const senderPhone = senderJid.split("@")[0];
  if (!senderPhone) return;

  // Find the account associated with this instance
  const account = await prisma.whatsAppAccount.findUnique({
    where: { instanceId },
    include: {
      chatbotConfig: {
        include: {
          faqEntries: { orderBy: { sortOrder: "asc" } },
          flows: { where: { isActive: true } },
        },
      },
      menuBotConfig: true,
    },
  });

  if (!account) return;

  // Extract message text
  const message = messageData.message;
  const messageText = extractMessageText(message);

  if (!messageText) return;

  // Route to chatbot if active
  if (account.chatbotConfig?.isActive) {
    await handleChatbotMessage(
      instanceId,
      senderPhone,
      messageText,
      account.chatbotConfig
    );
    return;
  }

  // Route to menu bot if active
  if (account.menuBotConfig?.isActive) {
    await handleMenuBotMessage(
      instanceId,
      senderPhone,
      messageText,
      account.menuBotConfig
    );
    return;
  }
}

function extractMessageText(
  message: Record<string, unknown> | undefined
): string | null {
  if (!message) return null;

  // Text message
  if (message.conversation) return message.conversation as string;

  // Extended text message
  const extendedText = message.extendedTextMessage as
    | Record<string, unknown>
    | undefined;
  if (extendedText?.text) return extendedText.text as string;

  // Button reply
  const buttonReply = message.buttonsResponseMessage as
    | Record<string, unknown>
    | undefined;
  if (buttonReply?.selectedButtonId)
    return buttonReply.selectedButtonId as string;

  // List reply
  const listReply = message.listResponseMessage as
    | Record<string, unknown>
    | undefined;
  if (listReply?.singleSelectReply) {
    const reply = listReply.singleSelectReply as Record<string, unknown>;
    return reply.selectedRowId as string;
  }

  return null;
}

interface ChatbotConfigWithEntries {
  id: string;
  welcomeMessage: string | null;
  fallbackMessage: string | null;
  faqEntries: Array<{
    question: string;
    answer: string;
    keywords: string[];
  }>;
  flows: Array<{
    triggerType: string;
    triggerValue: string | null;
    flowData: unknown;
  }>;
}

async function handleChatbotMessage(
  instanceId: string,
  senderPhone: string,
  messageText: string,
  config: ChatbotConfigWithEntries
) {
  const lowerMessage = messageText.toLowerCase().trim();

  // Check for keyword-triggered flows first
  for (const flow of config.flows) {
    if (
      flow.triggerType === "KEYWORD" &&
      flow.triggerValue &&
      lowerMessage.includes(flow.triggerValue.toLowerCase())
    ) {
      // Execute flow (for now, send the first message in the flow data)
      const flowData = flow.flowData as Record<string, unknown>;
      const firstMessage = (flowData.welcomeMessage as string) ?? config.welcomeMessage;
      if (firstMessage) {
        await evolutionClient.sendText(instanceId, {
          number: senderPhone,
          text: firstMessage,
        });
      }
      return;
    }
  }

  // Check FAQ entries by keyword matching
  for (const faq of config.faqEntries) {
    const matchesKeyword = faq.keywords.some((keyword) =>
      lowerMessage.includes(keyword.toLowerCase())
    );

    const matchesQuestion =
      lowerMessage.includes(faq.question.toLowerCase().slice(0, 20));

    if (matchesKeyword || matchesQuestion) {
      await evolutionClient.sendText(instanceId, {
        number: senderPhone,
        text: faq.answer,
      });
      return;
    }
  }

  // Send fallback message
  const fallback =
    config.fallbackMessage ??
    "Thanks for your message! We will get back to you soon.";
  await evolutionClient.sendText(instanceId, {
    number: senderPhone,
    text: fallback,
  });
}

interface MenuBotConfigData {
  id: string;
  menuTree: unknown;
}

async function handleMenuBotMessage(
  instanceId: string,
  senderPhone: string,
  messageText: string,
  config: MenuBotConfigData
) {
  const menuTree = config.menuTree as Record<string, unknown>;
  const items = (menuTree.items as Array<Record<string, unknown>>) ?? [];

  // Check if user selected a menu item number
  const selectedIndex = parseInt(messageText.trim(), 10);

  if (!isNaN(selectedIndex) && selectedIndex > 0 && selectedIndex <= items.length) {
    const selectedItem = items[selectedIndex - 1];
    const response =
      (selectedItem.response as string) ??
      (selectedItem.title as string) ??
      "Option selected.";

    await evolutionClient.sendText(instanceId, {
      number: senderPhone,
      text: response,
    });
    return;
  }

  // Send menu
  let menuText = (menuTree.header as string) ?? "Please select an option:\n\n";
  items.forEach((item, index) => {
    menuText += `${index + 1}. ${item.title ?? "Option"}\n`;
  });
  menuText +=
    "\n" + ((menuTree.footer as string) ?? "Reply with a number to select.");

  await evolutionClient.sendText(instanceId, {
    number: senderPhone,
    text: menuText,
  });
}

async function handleMessageUpdate(
  instanceId: string,
  data: Record<string, unknown>
) {
  // Update delivery status for broadcasts
  const updates = (data as unknown as Array<{
    key: { id: string };
    update: { status: number };
  }>) ?? [];

  // Status codes: 1 = pending, 2 = sent to server, 3 = delivered, 4 = read
  if (Array.isArray(updates)) {
    for (const update of updates) {
      if (update?.update?.status >= 3) {
        // Mark broadcast recipient as delivered if we can match the message ID
        // This is a best-effort approach
        console.log(
          `Message ${update.key?.id} delivered on instance ${instanceId}`
        );
      }
    }
  }
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
  const contacts = data as unknown as Array<{
    id: string;
    name?: string;
    notify?: string;
    imgUrl?: string;
  }>;

  if (!Array.isArray(contacts)) return;

  const account = await prisma.whatsAppAccount.findUnique({
    where: { instanceId },
  });

  if (!account) return;

  for (const whatsappContact of contacts) {
    const phoneNumber = whatsappContact.id?.split("@")[0];
    if (!phoneNumber) continue;

    const name = whatsappContact.name ?? whatsappContact.notify ?? undefined;

    // Upsert contact
    await prisma.contact
      .upsert({
        where: {
          accountId_phoneNumber: {
            accountId: account.id,
            phoneNumber,
          },
        },
        create: {
          userId: account.userId,
          accountId: account.id,
          phoneNumber,
          name,
          profilePicUrl: whatsappContact.imgUrl ?? undefined,
        },
        update: {
          name: name ?? undefined,
          profilePicUrl: whatsappContact.imgUrl ?? undefined,
        },
      })
      .catch(() => {
        // Ignore errors for individual contacts
      });
  }
}
