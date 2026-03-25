"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Send,
  Clock,
  Smartphone,
  BarChart3,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is an overview of your WhatsApp TV business."
        actions={
          <Link href="/app/connect">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Number
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Connected Accounts"
          value="0"
          icon={<Smartphone className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Total Contacts"
          value="0"
          icon={<Users className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Statuses Posted"
          value="0"
          change="This month"
          icon={<Clock className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Broadcasts Sent"
          value="0"
          change="This month"
          icon={<Send className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            {[
              {
                label: "Schedule a Status",
                href: "/app/status-scheduler",
                icon: Clock,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Send a Broadcast",
                href: "/app/broadcasts",
                icon: Send,
                color: "bg-purple-50 text-purple-600",
              },
              {
                label: "Import Contacts",
                href: "/app/contacts",
                icon: Users,
                color: "bg-orange-50 text-orange-600",
              },
              {
                label: "View Analytics",
                href: "/app/analytics",
                icon: BarChart3,
                color: "bg-green-50 text-green-600",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activity Overview</h3>
            <div className="flex gap-1">
              {["7d", "30d", "90d"].map((p) => (
                <button
                  key={p}
                  className="rounded-lg px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-56 items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">
                Activity chart will render with real analytics data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts + Recent Broadcasts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Connected Accounts */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="font-semibold">Connected Accounts</h3>
            <Link
              href="/app/accounts"
              className="text-sm text-green-600 hover:text-green-500"
            >
              View All
            </Link>
          </div>
          <div className="px-4 py-8 text-center">
            <Smartphone className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400">
              No accounts connected yet
            </p>
            <Link href="/app/connect">
              <Button size="sm" className="mt-3">
                Connect Number
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <div className="px-4 py-8 text-center">
            <Zap className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400">
              No recent activity
            </p>
            <p className="mt-1 text-xs text-gray-300">
              Activity will appear here once you start using Zappix
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-green-800">
          Getting Started
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "1", label: "Connect a WhatsApp number", done: false },
            { step: "2", label: "Import your contacts", done: false },
            { step: "3", label: "Schedule your first status", done: false },
            { step: "4", label: "Choose a subscription plan", done: false },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 rounded-lg bg-white p-3"
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  item.done
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.step}
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
