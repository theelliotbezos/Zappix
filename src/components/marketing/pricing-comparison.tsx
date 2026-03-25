import { Check, X } from "lucide-react";

const features = [
  { name: "WhatsApp Accounts", starter: "1", growth: "3", business: "7", scale: "15" },
  { name: "Contacts", starter: "7,500", growth: "37,500", business: "112,500", scale: "300,000" },
  { name: "Broadcasts/month", starter: "15", growth: "75", business: "225", scale: "600" },
  { name: "Status Posts/month", starter: "45", growth: "225", business: "600", scale: "1,500" },
  { name: "Team Members", starter: "1", growth: "3", business: "7", scale: "15" },
  { name: "Ad Slots", starter: "2", growth: "10", business: "30", scale: "80" },
  { name: "Storage", starter: "2 GB", growth: "10 GB", business: "30 GB", scale: "80 GB" },
  { name: "Analytics", starter: "7 days", growth: "30 days", business: "90 days", scale: "365 days" },
  { name: "CSV Export", starter: false, growth: false, business: true, scale: true },
  { name: "PDF Export", starter: false, growth: false, business: false, scale: true },
  { name: "API Access", starter: false, growth: false, business: true, scale: true },
  { name: "Chatbot", starter: "Basic menu", growth: "Full + FAQ", business: "Full + leads", scale: "All flows" },
  { name: "Priority Support", starter: false, growth: "Email", business: "Email + WhatsApp", scale: "Dedicated" },
];

function CellContent({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-green-500" />
    ) : (
      <X className="mx-auto h-5 w-5 text-gray-300" />
    );
  }
  return <span>{value}</span>;
}

export function PricingComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-4 pr-4 text-left text-sm font-medium text-gray-500">
              Feature
            </th>
            <th className="px-4 py-4 text-center text-sm font-semibold">Starter</th>
            <th className="px-4 py-4 text-center text-sm font-semibold text-green-600">
              Growth
            </th>
            <th className="px-4 py-4 text-center text-sm font-semibold">Business</th>
            <th className="px-4 py-4 text-center text-sm font-semibold">Scale</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr
              key={feature.name}
              className="border-b border-gray-100 hover:bg-green-50/30 transition-colors"
            >
              <td className="py-3 pr-4 text-sm font-medium text-gray-700">
                {feature.name}
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                <CellContent value={feature.starter} />
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600 bg-green-50/30">
                <CellContent value={feature.growth} />
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                <CellContent value={feature.business} />
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                <CellContent value={feature.scale} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
