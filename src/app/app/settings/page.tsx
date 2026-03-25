import { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your account settings and preferences." />
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-400">Settings interface will be implemented here</p>
      </div>
    </>
  );
}
