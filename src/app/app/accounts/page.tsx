"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Smartphone,
  Plus,
  QrCode,
  Signal,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

export default function AccountsPage() {
  const accounts: Array<{
    id: string;
    instanceName: string;
    phoneNumber: string;
    status: string;
    warmUpProgress: number;
    lastConnected: string;
  }> = [];

  return (
    <>
      <PageHeader
        title="WhatsApp Accounts"
        description="Manage your connected WhatsApp numbers."
        actions={
          <Link href="/app/connect">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Number
            </Button>
          </Link>
        }
      />

      {accounts.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Smartphone className="h-8 w-8" />}
            title="No WhatsApp Accounts Connected"
            description="Connect your first WhatsApp number by scanning a QR code. It takes less than 30 seconds."
            action={{
              label: "Connect Your First Number",
              onClick: () => {},
            }}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{account.instanceName}</p>
                    <p className="text-sm text-gray-500">
                      {account.phoneNumber}
                    </p>
                  </div>
                </div>
                <StatusPill status={account.status} />
              </div>

              {/* Warm-up Progress */}
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Warm-up Progress</span>
                  <span className="font-medium">{account.warmUpProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${account.warmUpProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Last connected: {account.lastConnected}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
