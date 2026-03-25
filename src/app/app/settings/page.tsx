"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Camera } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your account settings." />

      {/* Profile Settings */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold">Profile</h3>

        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
              <Camera className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input type="email" placeholder="you@email.com" disabled className="bg-gray-50" />
                <p className="mt-1 text-xs text-gray-400">
                  Managed by Clerk. Change in your Clerk profile.
                </p>
              </div>
            </div>
            <div className="max-w-sm">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input placeholder="+234 8012345678" />
            </div>
          </div>
        </div>

        <Button>Save Changes</Button>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-800">Danger Zone</h3>
        <p className="mb-4 text-sm text-red-600">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </div>
    </>
  );
}
