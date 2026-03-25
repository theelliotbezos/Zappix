"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/dashboard/kpi-card";
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
import {
  Gift,
  Copy,
  DollarSign,
  Users,
  Clock,
  Wallet,
  Building,
  CheckCircle,
} from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "ZAPPIX-XXXXX";
  const referralLink = `https://zappix.ng/sign-up?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Referral Programme"
        description="Earn 25% recurring commission on every user you refer."
        actions={
          <Modal>
            <ModalTrigger asChild>
              <Button>
                <Wallet className="mr-2 h-4 w-4" />
                Request Withdrawal
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Request Withdrawal</ModalTitle>
                <ModalDescription>
                  Withdraw your available earnings to your bank account.
                  Minimum withdrawal: N5,000.
                </ModalDescription>
              </ModalHeader>
              <div className="space-y-4">
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-700">
                    Available Balance: <strong>N0</strong>
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Withdrawal Amount
                  </label>
                  <Input type="number" placeholder="e.g., 5000" min={5000} />
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Bank Account
                  </p>
                  <p className="text-sm text-gray-500">
                    No bank account added. Please add one in Settings &rarr; Billing.
                  </p>
                </div>
              </div>
              <ModalFooter>
                <Button variant="outline">Cancel</Button>
                <Button disabled>Withdraw</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        }
      />

      {/* Referral Link */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-2 font-semibold">Your Referral Link</h3>
        <p className="mb-4 text-sm text-gray-500">
          Share this link with others. When they sign up and subscribe, you
          earn 25% of their subscription fee as recurring commission.
        </p>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="flex-1 bg-gray-50" />
          <Button onClick={copyLink} variant="outline">
            {copied ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Referral code: <strong>{referralCode}</strong>
        </p>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Referrals"
          value="0"
          icon={<Users className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Total Earned"
          value="N0"
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Available Balance"
          value="N0"
          icon={<Wallet className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Pending (30-day hold)"
          value="N0"
          icon={<Clock className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Referral Table */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold">Your Referrals</h3>
        </div>
        <div className="px-4 py-12 text-center text-sm text-gray-400">
          No referrals yet. Share your link to start earning!
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold">Withdrawal History</h3>
        </div>
        <div className="px-4 py-12 text-center text-sm text-gray-400">
          No withdrawals yet.
        </div>
      </div>
    </>
  );
}
