import { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Manage your subscription and payment history." />
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-400">Billing interface will be implemented here</p>
      </div>
    </>
  );
}
