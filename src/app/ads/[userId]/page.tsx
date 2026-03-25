"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

/**
 * Public ad booking page.
 * Accessible at /ads/[userId] - allows advertisers to book ad slots.
 *
 * Note: This page uses a simplified fetch approach for public access
 * since tRPC requires auth for most procedures. The public endpoints
 * on the adSlot router handle the data fetching.
 */

interface AdSlot {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: string;
}

interface UserInfo {
  name: string | null;
  image: string | null;
}

export default function PublicAdBookingPage({
  params,
}: {
  params: { userId: string };
}) {
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [formData, setFormData] = useState({
    advertiserName: "",
    advertiserEmail: "",
    advertiserPhone: "",
    caption: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch slots on mount
  useState(() => {
    fetch(`/api/trpc/adSlot.getPublicSlots?input=${encodeURIComponent(JSON.stringify({ json: { userId: params.userId } }))}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.result?.data?.json) {
          const result = data.result.data.json;
          setSlots(result.slots ?? []);
          setUser(result.user ?? null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/trpc/adSlot.createBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            adSlotId: selectedSlot.id,
            advertiserName: formData.advertiserName,
            advertiserEmail: formData.advertiserEmail,
            advertiserPhone: formData.advertiserPhone || undefined,
            caption: formData.caption || undefined,
          },
        }),
      });

      const data = await response.json();
      if (data?.result?.data?.json?.authorizationUrl) {
        // Redirect to Paystack checkout
        window.location.href = data.result.data.json.authorizationUrl;
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading ad slots...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="mt-2 text-gray-500">This ad booking page does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {user.image && (
              <img
                src={user.image}
                alt={user.name ?? ""}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name ? `${user.name}'s Ad Slots` : "Ad Slots"}
              </h1>
              <p className="text-sm text-gray-500">
                Powered by {APP_NAME}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {slots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No ad slots available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                  selectedSlot?.id === slot.id
                    ? "border-green-500 ring-2 ring-green-100"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {slot.title}
                </h3>
                {slot.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {slot.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {formatNaira(slot.price)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {slot.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Form */}
        {selectedSlot && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Book: {selectedSlot.title}
            </h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.advertiserName}
                  onChange={(e) =>
                    setFormData({ ...formData, advertiserName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.advertiserEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, advertiserEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  value={formData.advertiserPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      advertiserPhone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+234..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Caption (optional)
                </label>
                <textarea
                  value={formData.caption}
                  onChange={(e) =>
                    setFormData({ ...formData, caption: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter the text for your ad..."
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting
                    ? "Processing..."
                    : `Pay ${formatNaira(selectedSlot.price)} & Book`}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        Powered by {APP_NAME} - The Operating System for WhatsApp TV Businesses
      </footer>
    </div>
  );
}
