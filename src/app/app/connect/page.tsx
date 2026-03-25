"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { QrCode, RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function ConnectPage() {
  const [instanceName, setInstanceName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "waiting" | "connected" | "failed"
  >("idle");

  const handleConnect = async () => {
    if (!instanceName.trim()) return;
    setConnecting(true);
    setConnectionStatus("waiting");

    // Simulate QR code generation
    // In production, this calls the tRPC whatsapp.createInstance mutation
    // and then polls for QR code updates
    setTimeout(() => {
      setConnecting(false);
      setQrCode("placeholder-qr-code");
    }, 1500);
  };

  // Poll for connection status when QR code is displayed
  useEffect(() => {
    if (!qrCode || connectionStatus !== "waiting") return;

    const interval = setInterval(() => {
      // In production, this polls whatsapp.connectionStatus
      // and updates when the user scans the QR code
    }, 3000);

    return () => clearInterval(interval);
  }, [qrCode, connectionStatus]);

  return (
    <>
      <PageHeader
        title="Connect WhatsApp Number"
        description="Scan the QR code with your phone to connect a WhatsApp account."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Connection Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">New Connection</h3>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Instance Name
            </label>
            <Input
              placeholder="e.g., my-whatsapp-tv"
              value={instanceName}
              onChange={(e) =>
                setInstanceName(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
              }
            />
            <p className="mt-1 text-xs text-gray-400">
              Letters, numbers, and dashes only.
            </p>
          </div>

          <Button
            onClick={handleConnect}
            disabled={!instanceName.trim() || connecting}
            className="w-full"
          >
            {connecting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            {connecting ? "Creating Instance..." : "Generate QR Code"}
          </Button>
        </div>

        {/* QR Code Display */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">QR Code</h3>
            <StatusPill
              status={
                connectionStatus === "connected"
                  ? "CONNECTED"
                  : connectionStatus === "waiting"
                  ? "CONNECTING"
                  : connectionStatus === "failed"
                  ? "FAILED"
                  : "DISCONNECTED"
              }
            />
          </div>

          <div className="flex flex-col items-center rounded-xl bg-gray-50 p-8">
            {qrCode ? (
              <>
                <div className="mb-4 flex h-64 w-64 items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
                  <QrCode className="h-32 w-32 text-gray-800" />
                </div>
                <p className="text-sm text-gray-500">
                  Open WhatsApp on your phone &rarr; Settings &rarr; Linked
                  Devices &rarr; Scan this code
                </p>
                <Button variant="ghost" size="sm" className="mt-3">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh QR Code
                </Button>
              </>
            ) : (
              <div className="py-8 text-center">
                <QrCode className="mx-auto mb-3 h-16 w-16 text-gray-300" />
                <p className="text-sm text-gray-400">
                  Enter an instance name and click Generate QR Code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Tips */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold">Connection Tips</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Wifi,
              title: "Keep Your Phone Connected",
              desc: "Your phone needs an active internet connection for WhatsApp to work.",
            },
            {
              icon: RefreshCw,
              title: "QR Code Expires",
              desc: "The QR code refreshes every 60 seconds. Scan it quickly.",
            },
            {
              icon: WifiOff,
              title: "Reconnection",
              desc: "If disconnected, come back here to scan a new QR code.",
            },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3">
              <tip.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="text-xs text-gray-500">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
