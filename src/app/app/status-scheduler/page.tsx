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
import {
  Plus,
  Clock,
  Calendar,
  Image,
  Video,
  Type,
  Upload,
  Trash2,
} from "lucide-react";

interface ScheduledStatus {
  id: string;
  type: "TEXT" | "IMAGE" | "VIDEO";
  caption: string;
  scheduledAt: string;
  status: string;
  account: string;
}

// Mock data for UI demo
const mockStatuses: ScheduledStatus[] = [];

export default function StatusSchedulerPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusType, setStatusType] = useState<"TEXT" | "IMAGE" | "VIDEO">(
    "TEXT"
  );

  return (
    <>
      <PageHeader
        title="Status Scheduler"
        description="Schedule WhatsApp status posts to go out automatically."
        actions={
          <Modal>
            <ModalTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Status
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Schedule New Status</ModalTitle>
                <ModalDescription>
                  Create a status post to be published at a specific time.
                </ModalDescription>
              </ModalHeader>

              <div className="space-y-4">
                {/* Status Type */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status Type
                  </label>
                  <div className="flex gap-2">
                    {[
                      { type: "TEXT" as const, icon: Type, label: "Text" },
                      { type: "IMAGE" as const, icon: Image, label: "Image" },
                      { type: "VIDEO" as const, icon: Video, label: "Video" },
                    ].map((opt) => (
                      <button
                        key={opt.type}
                        onClick={() => setStatusType(opt.type)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          statusType === opt.type
                            ? "border-green-500 bg-green-50 text-green-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Account */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    WhatsApp Account
                  </label>
                  <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option>Select account...</option>
                  </select>
                </div>

                {/* Media Upload (for IMAGE/VIDEO) */}
                {statusType !== "TEXT" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Upload {statusType === "IMAGE" ? "Image" : "Video"}
                    </label>
                    <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/30">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-xs text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    {statusType === "TEXT" ? "Status Text" : "Caption"}
                  </label>
                  <Textarea
                    placeholder={
                      statusType === "TEXT"
                        ? "Type your status message..."
                        : "Add a caption (optional)"
                    }
                    rows={3}
                  />
                </div>

                {/* Schedule Time */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Schedule For
                  </label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <ModalFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Schedule Status</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        }
      />

      {/* View Toggle */}
      <div className="mt-6 flex items-center gap-2">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          <Clock className="mr-1.5 h-4 w-4" />
          List
        </Button>
        <Button
          variant={view === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("calendar")}
        >
          <Calendar className="mr-1.5 h-4 w-4" />
          Calendar
        </Button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {mockStatuses.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-8 w-8" />}
            title="No Scheduled Statuses"
            description="Schedule your first WhatsApp status post. It will be published automatically at the time you set."
            action={{
              label: "Schedule Your First Status",
              onClick: () => {},
            }}
          />
        ) : (
          <div className="space-y-3">
            {mockStatuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    {status.type === "TEXT" ? (
                      <Type className="h-5 w-5 text-gray-500" />
                    ) : status.type === "IMAGE" ? (
                      <Image className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Video className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {status.caption || "No caption"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {status.account} &middot; {status.scheduledAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={status.status} />
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
