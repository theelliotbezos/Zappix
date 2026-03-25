"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal";
import { PRICING_PLANS } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { Check, CreditCard, Building, ArrowUpRight } from "lucide-react";

export default function BillingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage your subscription, payment method, and bank account."
      />

      {/* Current Plan */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Current Plan</h3>
            <p className="text-sm text-gray-500">
              You are not subscribed to any plan yet.
            </p>
          </div>
          <Badge variant="secondary">Free Trial</Badge>
        </div>

        {/* Plan Cards */}
        <div className="mb-4 flex items-center gap-3">
          <span className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              yearly ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                yearly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-gray-900" : "text-gray-400"}`}>
            Yearly
          </span>
          {yearly && (
            <Badge variant="success">Save 17%</Badge>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(PRICING_PLANS).map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-xl border p-4 transition-colors hover:border-green-400 ${
                plan.slug === "growth"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{plan.name}</span>
                {plan.slug === "growth" && (
                  <Badge variant="default">Popular</Badge>
                )}
              </div>
              <p className="text-2xl font-bold">
                {formatNaira(yearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly)}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-500">
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  {plan.maxWhatsappAccounts} WhatsApp account{plan.maxWhatsappAccounts > 1 ? "s" : ""}
                </li>
                <li className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  {plan.maxContacts.toLocaleString()} contacts
                </li>
              </ul>
              <Button
                className="mt-3 w-full"
                size="sm"
                variant={plan.slug === "growth" ? "default" : "outline"}
              >
                Subscribe
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Account for Payouts */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Bank Account (for Payouts)</h3>
        <p className="mb-4 text-sm text-gray-500">
          Add your Nigerian bank account to receive referral commission payouts
          via Paystack Transfer.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Bank
            </label>
            <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
              <option>Select bank...</option>
              <option value="058">GTBank</option>
              <option value="011">First Bank</option>
              <option value="044">Access Bank</option>
              <option value="033">UBA</option>
              <option value="057">Zenith Bank</option>
              <option value="050">Ecobank</option>
              <option value="070">Fidelity Bank</option>
              <option value="030">Heritage Bank</option>
              <option value="082">Keystone Bank</option>
              <option value="076">Polaris Bank</option>
              <option value="221">Stanbic IBTC</option>
              <option value="068">Standard Chartered</option>
              <option value="032">Union Bank</option>
              <option value="035">Wema Bank</option>
              <option value="215">Unity Bank</option>
              <option value="090110">VFD MFB</option>
              <option value="100004">Opay</option>
              <option value="090267">Kuda</option>
              <option value="100033">Palmpay</option>
              <option value="090405">Moniepoint</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <Input placeholder="0123456789" maxLength={10} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <Input placeholder="Auto-verified" disabled className="bg-gray-50" />
          </div>
        </div>
        <Button className="mt-4">
          <Building className="mr-2 h-4 w-4" />
          Verify & Save Account
        </Button>
      </div>

      {/* Payment History */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold">Payment History</h3>
        </div>
        <div className="px-4 py-12 text-center text-sm text-gray-400">
          No payments yet.
        </div>
      </div>
    </>
  );
}
