"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal";
import { Plus, Send, Users, BarChart3, Clock } from "lucide-react";

export default function BroadcastsPage() {
  return (
    <>
      <PageHeader
        title="Broadcasts"
        description="Send messages to thousands of contacts with smart throttling."
        actions={
          <Modal>
            <ModalTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Broadcast
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-xl">
              <ModalHeader>
                <ModalTitle>Create Broadcast</ModalTitle>
                <ModalDescription>
                  Send a message to a contact list. Messages are throttled to
                  avoid WhatsApp restrictions.
                </ModalDescription>
              </ModalHeader>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Broadcast Name
                  </label>
                  <Input placeholder="e.g., Monday Promo" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      WhatsApp Account
                    </label>
                    <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option>Select account...</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Contact List
                    </label>
                    <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option>All Contacts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <Textarea
                    placeholder="Type your broadcast message..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Schedule (optional)
                  </label>
                  <Input type="datetime-local" />
                  <p className="mt-1 text-xs text-gray-400">
                    Leave empty to send immediately
                  </p>
                </div>
              </div>

              <ModalFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        }
      />

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Broadcasts", value: "0", icon: Send },
          { label: "Messages Sent", value: "0", icon: Users },
          { label: "Delivery Rate", value: "0%", icon: BarChart3 },
          { label: "Scheduled", value: "0", icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <stat.icon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast List */}
      <div className="mt-6">
        <EmptyState
          icon={<Send className="h-8 w-8" />}
          title="No Broadcasts Yet"
          description="Create your first broadcast to send messages to your contacts. You can send text, images, videos, and more."
          action={{ label: "Create First Broadcast", onClick: () => {} }}
        />
      </div>
    </>
  );
}
