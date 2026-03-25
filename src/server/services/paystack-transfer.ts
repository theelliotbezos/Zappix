/**
 * Paystack Transfer API for bank payouts (referral commissions).
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
      `Paystack Transfer API error: ${data.message ?? response.statusText}`
    );
  }

  return data as T;
}

export const paystackTransferService = {
  /** Resolve/verify a bank account number. */
  async resolveAccountNumber(accountNumber: string, bankCode: string) {
    return paystackRequest<{
      status: boolean;
      data: { account_number: string; account_name: string; bank_id: number };
    }>(
      `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
    );
  },

  /** Create a transfer recipient (for receiving payouts). */
  async createTransferRecipient(params: {
    name: string;
    accountNumber: string;
    bankCode: string;
    currency?: string;
  }) {
    return paystackRequest<{
      status: boolean;
      data: { recipient_code: string; name: string; type: string };
    }>("/transferrecipient", {
      method: "POST",
      body: JSON.stringify({
        type: "nuban",
        name: params.name,
        account_number: params.accountNumber,
        bank_code: params.bankCode,
        currency: params.currency ?? "NGN",
      }),
    });
  },

  /** Initiate a transfer (payout) to a recipient's bank account. */
  async initiateTransfer(params: {
    amount: number; // in kobo
    recipientCode: string;
    reason?: string;
    reference?: string;
  }) {
    return paystackRequest<{
      status: boolean;
      data: {
        transfer_code: string;
        reference: string;
        amount: number;
        status: string;
      };
    }>("/transfer", {
      method: "POST",
      body: JSON.stringify({
        source: "balance",
        amount: params.amount,
        recipient: params.recipientCode,
        reason: params.reason ?? "Zappix referral payout",
        reference: params.reference,
      }),
    });
  },

  /** Get transfer status. */
  async getTransferStatus(transferCode: string) {
    return paystackRequest<{
      status: boolean;
      data: { status: string; amount: number; transfer_code: string };
    }>(`/transfer/${transferCode}`);
  },
};
