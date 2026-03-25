"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  BarChart3,
  TrendingUp,
  Users,
  Send,
  Clock,
  Download,
  Calendar,
} from "lucide-react";

type Period = "today" | "7d" | "30d" | "90d" | "custom";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your WhatsApp TV performance and growth."
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {/* Period Selector */}
      <div className="mt-6 flex items-center gap-2">
        {[
          { id: "today" as const, label: "Today" },
          { id: "7d" as const, label: "7 Days" },
          { id: "30d" as const, label: "30 Days" },
          { id: "90d" as const, label: "90 Days" },
          { id: "custom" as const, label: "Custom" },
        ].map((p) => (
          <Button
            key={p.id}
            variant={period === p.id ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(p.id)}
          >
            {p.id === "custom" && <Calendar className="mr-1.5 h-3 w-3" />}
            {p.label}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Statuses Posted"
          value="0"
          change="vs previous period"
          icon={<Clock className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Broadcasts Sent"
          value="0"
          change="vs previous period"
          icon={<Send className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Messages Received"
          value="0"
          change="vs previous period"
          icon={<BarChart3 className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Contacts Gained"
          value="0"
          change="vs previous period"
          icon={<Users className="h-5 w-5 text-green-600" />}
        />
        <KpiCard
          label="Ad Revenue"
          value="N0"
          change="vs previous period"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Status Reach Over Time</h3>
          <div className="flex h-64 items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">
                Chart will render with real data from analytics snapshots
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Broadcast Delivery</h3>
          <div className="flex h-64 items-center justify-center text-gray-400">
            <div className="text-center">
              <Send className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">
                Delivery rate chart with sent vs delivered vs failed
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Audience Growth</h3>
          <div className="flex h-64 items-center justify-center text-gray-400">
            <div className="text-center">
              <Users className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">
                Contact growth over time with cumulative line chart
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Ad Revenue</h3>
          <div className="flex h-64 items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">
                Revenue chart with daily/weekly breakdown
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
