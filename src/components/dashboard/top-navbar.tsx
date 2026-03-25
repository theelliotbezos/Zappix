"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 lg:hidden">
          Zappix
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User Menu */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  );
}
