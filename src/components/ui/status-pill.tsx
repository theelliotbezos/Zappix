import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  // Connection statuses
  CONNECTED: "bg-green-100 text-green-700",
  DISCONNECTED: "bg-gray-100 text-gray-600",
  CONNECTING: "bg-yellow-100 text-yellow-700",
  BANNED: "bg-red-100 text-red-700",

  // General statuses
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-600",
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",

  // Scheduled status states
  QUEUED: "bg-blue-100 text-blue-700",
  POSTING: "bg-yellow-100 text-yellow-700",
  POSTED: "bg-green-100 text-green-700",

  // Broadcast statuses
  DRAFT: "bg-gray-100 text-gray-600",
  SCHEDULED: "bg-blue-100 text-blue-700",
  SENDING: "bg-yellow-100 text-yellow-700",
  SENT: "bg-green-100 text-green-700",
  DELIVERED: "bg-green-100 text-green-700",

  // Payment statuses
  SUCCESS: "bg-green-100 text-green-700",
  REFUNDED: "bg-orange-100 text-orange-700",

  // Ad booking statuses
  PAID: "bg-green-100 text-green-700",
  APPROVED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",

  // Referral
  SIGNED_UP: "bg-blue-100 text-blue-700",
  SUBSCRIBED: "bg-green-100 text-green-700",
  CHURNED: "bg-red-100 text-red-700",

  // Commission
  AVAILABLE: "bg-green-100 text-green-700",
  WITHDRAWN: "bg-gray-100 text-gray-600",

  // Default
  DEFAULT: "bg-gray-100 text-gray-600",
};

interface StatusPillProps {
  status: string;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const style = statusStyles[status] ?? statusStyles.DEFAULT;
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {label.toLowerCase()}
    </span>
  );
}
