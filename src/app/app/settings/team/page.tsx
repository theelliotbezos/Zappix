import { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Team",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team" description="Manage team members and their roles." />
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-400">Team management interface will be implemented here</p>
      </div>
    </>
  );
}
