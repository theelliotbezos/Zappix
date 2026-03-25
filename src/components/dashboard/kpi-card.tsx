"use client";

import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
      {change && (
        <p
          className={cn("mt-1 text-sm", {
            "text-green-600": changeType === "positive",
            "text-red-500": changeType === "negative",
            "text-gray-500": changeType === "neutral",
          })}
        >
          {change}
        </p>
      )}
    </div>
  );
}
