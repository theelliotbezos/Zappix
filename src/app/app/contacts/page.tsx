"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
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
import { Plus, Upload, Users, Tag, Download, Filter } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const contacts: Record<string, unknown>[] = [];

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-600">
            {(row.name as string)?.charAt(0) ?? "?"}
          </div>
          <div>
            <p className="font-medium">{(row.name as string) ?? "Unknown"}</p>
            <p className="text-xs text-gray-400">{row.phoneNumber as string}</p>
          </div>
        </div>
      ),
    },
    { key: "phoneNumber", header: "Phone" },
    {
      key: "tags",
      header: "Tags",
      render: () => (
        <div className="flex gap-1">
          <Badge variant="default">VIP</Badge>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Added",
      render: (row: Record<string, unknown>) => (
        <span className="text-gray-500">{row.createdAt as string}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Contacts"
        description="Manage your WhatsApp contacts, lists, and tags."
        actions={
          <div className="flex gap-2">
            <Modal>
              <ModalTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Import Contacts</ModalTitle>
                  <ModalDescription>
                    Upload a CSV file with your contacts. The file should have
                    columns for phone number and name.
                  </ModalDescription>
                </ModalHeader>
                <div className="space-y-4">
                  <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-green-400">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">
                        Drop your CSV file here or click to browse
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-600">
                      Expected CSV format:
                    </p>
                    <code className="mt-1 block text-xs text-gray-500">
                      phone_number,name
                      <br />
                      2348012345678,John Doe
                    </code>
                  </div>
                </div>
                <ModalFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Import Contacts</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal>
              <ModalTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Add Contact</ModalTitle>
                  <ModalDescription>
                    Add a new contact to your WhatsApp contact list.
                  </ModalDescription>
                </ModalHeader>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input placeholder="e.g., 2348012345678" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Input placeholder="Contact name" />
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
                  <Button>Add Contact</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        }
      />

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Contacts", value: "0", icon: Users },
          { label: "Contact Lists", value: "0", icon: Filter },
          { label: "Tags", value: "0", icon: Tag },
          { label: "Opted Out", value: "0", icon: Download },
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

      {/* Contacts Table */}
      <div className="mt-6">
        {contacts.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="No Contacts Yet"
            description="Add contacts manually or import from a CSV file to start building your audience."
            action={{ label: "Import Contacts", onClick: () => {} }}
          />
        ) : (
          <DataTable
            columns={columns}
            data={contacts}
            searchPlaceholder="Search contacts..."
            searchValue={search}
            onSearchChange={setSearch}
          />
        )}
      </div>
    </>
  );
}
