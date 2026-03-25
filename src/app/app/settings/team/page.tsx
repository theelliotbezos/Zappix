"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Users, Crown, Shield, Eye, Trash2, Mail } from "lucide-react";

const roles = [
  { value: "ADMIN", label: "Admin", desc: "Full access except billing", icon: Shield },
  { value: "EDITOR", label: "Editor", desc: "Can create and edit content", icon: Users },
  { value: "VIEWER", label: "Viewer", desc: "Read-only access", icon: Eye },
];

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Team"
        description="Invite team members and manage their access."
        actions={
          <Modal>
            <ModalTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Invite Team Member</ModalTitle>
                <ModalDescription>
                  Send an invitation to a team member. They will receive an email
                  with instructions to join.
                </ModalDescription>
              </ModalHeader>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input type="email" placeholder="team@example.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Name (optional)
                  </label>
                  <Input placeholder="Their name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <role.icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{role.label}</p>
                          <p className="text-xs text-gray-400">{role.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <ModalFooter>
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        }
      />

      {/* Current User (Owner) */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
              Y
            </div>
            <div>
              <p className="font-medium">You (Account Owner)</p>
              <p className="text-sm text-gray-500">you@email.com</p>
            </div>
          </div>
          <Badge variant="default">
            <Crown className="mr-1 h-3 w-3" />
            Owner
          </Badge>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-4">
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No Team Members"
          description="Invite team members to help manage your WhatsApp TV business. Control what they can access with roles."
          action={{ label: "Invite Your First Member", onClick: () => {} }}
        />
      </div>
    </>
  );
}
