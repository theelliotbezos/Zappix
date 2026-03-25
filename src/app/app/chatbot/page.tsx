"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/modal";
import { Bot, Plus, MessageSquare, Settings, Trash2, Power } from "lucide-react";

export default function ChatbotPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <PageHeader
        title="Chatbot Builder"
        description="Build FAQ bots and auto-responders for 24/7 support."
      />

      {/* Config Card */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Chatbot Configuration</h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              isActive ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                isActive ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Welcome Message
            </label>
            <Textarea
              placeholder="Hi! Thanks for reaching out. How can I help you today?"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Fallback Message
            </label>
            <Textarea
              placeholder="Sorry, I did not understand that. Please try one of the options below."
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            WhatsApp Account
          </label>
          <select className="flex h-10 w-full max-w-sm rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
            <option>Select account...</option>
          </select>
        </div>

        <Button className="mt-4">Save Configuration</Button>
      </div>

      {/* FAQ Entries */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">FAQ Entries</h3>
          <Modal>
            <ModalTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Add FAQ Entry</ModalTitle>
              </ModalHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Question / Keywords
                  </label>
                  <Input placeholder="e.g., price, how much, cost" />
                  <p className="mt-1 text-xs text-gray-400">
                    Comma-separated keywords that trigger this response
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <Textarea
                    placeholder="Type the auto-reply message..."
                    rows={4}
                  />
                </div>
              </div>
              <ModalFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Add FAQ</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        <EmptyState
          icon={<MessageSquare className="h-8 w-8" />}
          title="No FAQ Entries"
          description="Add frequently asked questions and their answers. The chatbot will automatically respond when keywords are detected."
          action={{ label: "Add Your First FAQ", onClick: () => {} }}
        />
      </div>

      {/* Chatbot Flows */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Automation Flows</h3>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Flow
          </Button>
        </div>
        <EmptyState
          icon={<Bot className="h-8 w-8" />}
          title="No Automation Flows"
          description="Build lead capture, order taking, and other automated conversation flows."
          action={{ label: "Create Your First Flow", onClick: () => {} }}
        />
      </div>
    </>
  );
}
