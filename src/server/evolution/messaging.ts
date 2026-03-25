import { evolutionClient } from "./client";
import { delay } from "@/lib/utils";
import { BROADCAST_DELAY_MS, STATUS_POST_DELAY_MS } from "@/lib/constants";

/**
 * High-level messaging operations with throttling and error handling.
 */
export const messagingService = {
  /** Send a text status post. */
  async postTextStatus(instanceId: string, text: string) {
    return evolutionClient.sendStatus(instanceId, {
      type: "text",
      content: text,
      allContacts: true,
    });
  },

  /** Send a media status post (image or video). */
  async postMediaStatus(
    instanceId: string,
    type: "image" | "video",
    mediaUrl: string,
    caption?: string
  ) {
    return evolutionClient.sendStatus(instanceId, {
      type,
      content: mediaUrl,
      caption,
      allContacts: true,
    });
  },

  /** Send a broadcast text message to multiple numbers with throttling. */
  async broadcastText(
    instanceId: string,
    numbers: string[],
    text: string,
    onProgress?: (sent: number, total: number) => void
  ) {
    const results: Array<{
      number: string;
      success: boolean;
      error?: string;
    }> = [];

    for (let i = 0; i < numbers.length; i++) {
      try {
        await evolutionClient.sendText(instanceId, {
          number: numbers[i],
          text,
        });
        results.push({ number: numbers[i], success: true });
      } catch (error) {
        results.push({
          number: numbers[i],
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      onProgress?.(i + 1, numbers.length);

      // Throttle between messages
      if (i < numbers.length - 1) {
        await delay(BROADCAST_DELAY_MS);
      }
    }

    return results;
  },

  /** Send a broadcast media message to multiple numbers with throttling. */
  async broadcastMedia(
    instanceId: string,
    numbers: string[],
    mediaUrl: string,
    mediaType: "image" | "video" | "document" | "audio",
    caption?: string,
    onProgress?: (sent: number, total: number) => void
  ) {
    const results: Array<{
      number: string;
      success: boolean;
      error?: string;
    }> = [];

    for (let i = 0; i < numbers.length; i++) {
      try {
        await evolutionClient.sendMedia(instanceId, {
          number: numbers[i],
          mediatype: mediaType,
          mimetype: getMimeType(mediaType),
          media: mediaUrl,
          caption,
        });
        results.push({ number: numbers[i], success: true });
      } catch (error) {
        results.push({
          number: numbers[i],
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      onProgress?.(i + 1, numbers.length);

      if (i < numbers.length - 1) {
        await delay(BROADCAST_DELAY_MS);
      }
    }

    return results;
  },
};

function getMimeType(
  type: "image" | "video" | "document" | "audio"
): string {
  const mimeMap = {
    image: "image/jpeg",
    video: "video/mp4",
    document: "application/pdf",
    audio: "audio/mpeg",
  };
  return mimeMap[type];
}
