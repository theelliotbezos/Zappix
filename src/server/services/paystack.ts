/**
 * Paystack API client for subscription management.
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

async function paystackRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `Paystack API error: ${data.message ?? response.statusText}`
    );
  }

  return data as T;
}

export const paystackService = {
  /** Initialize a transaction for subscription checkout. */
  async initializeTransaction(params: {
    email: string;
    amount: number; // in kobo
    plan?: string; // Paystack plan code
    reference?: string;
    callbackUrl?: string;
    metadata?: Record<string, unknown>;
  }) {
    return paystackRequest<{
      status: boolean;
      data: { authorization_url: string; access_code: string; reference: string };
    }>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: params.email,
        amount: params.amount,
        plan: params.plan,
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      }),
    });
  },

  /** Verify a transaction. */
  async verifyTransaction(reference: string) {
    return paystackRequest<{
      status: boolean;
      data: {
        status: string;
        amount: number;
        currency: string;
        customer: { email: string; customer_code: string };
        plan?: { plan_code: string };
      };
    }>(`/transaction/verify/${reference}`);
  },

  /** Create a subscription. */
  async createSubscription(params: {
    customer: string; // customer code or email
    plan: string; // plan code
  }) {
    return paystackRequest("/subscription", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  /** Disable a subscription. */
  async disableSubscription(params: {
    code: string;
    token: string;
  }) {
    return paystackRequest("/subscription/disable", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  /** List Nigerian banks. */
  async listBanks() {
    return paystackRequest<{
      status: boolean;
      data: Array<{ name: string; code: string; active: boolean }>;
    }>("/bank?country=nigeria&perPage=100");
  },
};
