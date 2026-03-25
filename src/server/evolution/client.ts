/**
 * Evolution API HTTP client.
 *
 * Provides typed methods for interacting with the Evolution API v2
 * running on Railway. All WhatsApp operations go through this client.
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY ?? "";

interface EvolutionResponse<T = unknown> {
  status: number;
  data: T;
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${EVOLUTION_API_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Evolution API error ${response.status}: ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

// ── Instance Management ─────────────────────────────────

interface CreateInstanceResponse {
  instanceId: string;
  instanceName: string;
  status: string;
}

interface QrCodeResponse {
  base64: string;
  code: string;
}

interface ConnectionStateResponse {
  instance: string;
  state: "open" | "close" | "connecting";
}

interface FetchInstancesResponse {
  instanceId: string;
  instanceName: string;
  status: string;
}

// ── Messaging ───────────────────────────────────────────

interface SendTextPayload {
  number: string;
  text: string;
}

interface SendMediaPayload {
  number: string;
  mediatype: "image" | "video" | "document" | "audio";
  mimetype: string;
  caption?: string;
  media: string; // URL or base64
  fileName?: string;
}

interface SendStatusPayload {
  type: "text" | "image" | "video" | "audio";
  content: string;
  caption?: string;
  statusJidList?: string[];
  allContacts?: boolean;
  backgroundColor?: string;
  font?: number;
}

interface SendMessageResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: Record<string, unknown>;
  messageTimestamp: string;
  status: string;
}

export const evolutionClient = {
  // ── Instance Management ───────────────────────────

  /** Create a new WhatsApp instance. */
  async createInstance(
    instanceName: string
  ): Promise<CreateInstanceResponse> {
    return request<CreateInstanceResponse>("/instance/create", {
      method: "POST",
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS",
      }),
    });
  },

  /** Get QR code for an instance. */
  async getQrCode(instanceId: string): Promise<QrCodeResponse> {
    return request<QrCodeResponse>(
      `/instance/connect/${instanceId}`
    );
  },

  /** Get connection state of an instance. */
  async getConnectionState(
    instanceId: string
  ): Promise<ConnectionStateResponse> {
    return request<ConnectionStateResponse>(
      `/instance/connectionState/${instanceId}`
    );
  },

  /** Delete an instance. */
  async deleteInstance(instanceId: string): Promise<void> {
    await request(`/instance/delete/${instanceId}`, {
      method: "DELETE",
    });
  },

  /** Logout an instance without deleting it. */
  async logoutInstance(instanceId: string): Promise<void> {
    await request(`/instance/logout/${instanceId}`, {
      method: "POST",
    });
  },

  /** List all instances. */
  async fetchInstances(): Promise<FetchInstancesResponse[]> {
    return request<FetchInstancesResponse[]>(
      "/instance/fetchInstances"
    );
  },

  // ── Messaging ─────────────────────────────────────

  /** Send a text message. */
  async sendText(
    instanceId: string,
    payload: SendTextPayload
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendText/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** Send a media message (image, video, document, audio). */
  async sendMedia(
    instanceId: string,
    payload: SendMediaPayload
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendMedia/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** Post a WhatsApp Status/Story. */
  async sendStatus(
    instanceId: string,
    payload: SendStatusPayload
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendStatus/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** Send a poll message. */
  async sendPoll(
    instanceId: string,
    payload: {
      number: string;
      name: string;
      values: string[];
      selectableCount: number;
    }
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendPoll/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** Send a list message. */
  async sendList(
    instanceId: string,
    payload: {
      number: string;
      title: string;
      description: string;
      buttonText: string;
      footerText?: string;
      sections: Array<{
        title: string;
        rows: Array<{
          title: string;
          description?: string;
          rowId: string;
        }>;
      }>;
    }
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendList/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** Send a contact card. */
  async sendContact(
    instanceId: string,
    payload: {
      number: string;
      contact: Array<{
        fullName: string;
        wuid: string;
        phoneNumber: string;
      }>;
    }
  ): Promise<SendMessageResponse> {
    return request<SendMessageResponse>(
      `/message/sendContact/${instanceId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },
};
