import { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "PAGE_TITLE",
};

export default function PAGE_NAMEPage() {
  return (
    <>
      <PageHeader title="PAGE_TITLE" description="PAGE_DESC" />
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-400">PAGE_TITLE interface will be implemented here</p>
      </div>
    </>
  );
}
