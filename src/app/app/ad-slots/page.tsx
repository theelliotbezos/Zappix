"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Megaphone,
  DollarSign,
  ExternalLink,
  Calendar,
  Eye,
} from "lucide-react";

export default function AdSlotsPage() {
  return (
    <>
      <PageHeader
        title="Ad Slots"
        description="Create ad slots and let advertisers book and pay online."
        actions={
          <Modal>
            <ModalTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Ad Slot
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Create Ad Slot</ModalTitle>
                <ModalDescription>
                  Define an ad slot that advertisers can book through your public
                  booking page.
                </ModalDescription>
              </ModalHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Ad Slot Title
                  </label>
                  <Input placeholder="e.g., Status Ad - 24 Hours" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe what the advertiser gets..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Price (N)
                    </label>
                    <Input type="number" placeholder="e.g., 5000" min={100} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="6h">6 Hours</option>
                      <option value="12h">12 Hours</option>
                      <option value="24h">24 Hours</option>
                      <option value="48h">48 Hours</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    WhatsApp Account
                  </label>
                  <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>Select account...</option>
                  </select>
                </div>
              </div>
              <ModalFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Slot</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        }
      />

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Active Slots", value: "0", icon: Megaphone },
          { label: "Total Bookings", value: "0", icon: Calendar },
          { label: "Total Revenue", value: "N0", icon: DollarSign },
          { label: "Pending Bookings", value: "0", icon: Eye },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Public Booking Link */}
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              Your Public Booking Page
            </p>
            <p className="text-xs text-green-600">
              Share this link with potential advertisers
            </p>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-3 w-3" />
            zappix.ng/ads/your-username
          </Button>
        </div>
      </div>

      {/* Ad Slots List */}
      <div className="mt-6">
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title="No Ad Slots Yet"
          description="Create your first ad slot and share your booking page with advertisers. They can book and pay directly through Paystack."
          action={{ label: "Create Your First Ad Slot", onClick: () => {} }}
        />
      </div>
    </>
  );
}
