import { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is an overview of your WhatsApp TV business."
      />

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Connected Accounts", value: "0", change: "" },
          { label: "Total Contacts", value: "0", change: "" },
          { label: "Statuses Posted", value: "0", change: "" },
          { label: "Broadcasts Sent", value: "0", change: "" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Status Activity</h3>
          <div className="flex h-48 items-center justify-center text-gray-400">
            Chart will be rendered here
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">Broadcast Performance</h3>
          <div className="flex h-48 items-center justify-center text-gray-400">
            Chart will be rendered here
          </div>
        </div>
      </div>
    </>
  );
}
