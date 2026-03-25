"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

const plans = [
  {
    ...PRICING_PLANS.starter,
    badge: "Start Here",
    highlighted: false,
    features: [
      "1 WhatsApp Account",
      "7,500 Contacts",
      "15 Broadcasts/month",
      "45 Status Posts/month",
      "Basic Analytics (7 days)",
      "2 Ad Slots",
      "Basic Menu Bot",
    ],
  },
  {
    ...PRICING_PLANS.growth,
    badge: "Most Popular",
    highlighted: true,
    features: [
      "3 WhatsApp Accounts",
      "37,500 Contacts",
      "75 Broadcasts/month",
      "225 Status Posts/month",
      "Full Analytics (30 days)",
      "10 Ad Slots",
      "Full Chatbot + FAQ",
      "3 Team Members",
      "Email Support",
    ],
  },
  {
    ...PRICING_PLANS.business,
    badge: null,
    highlighted: false,
    features: [
      "7 WhatsApp Accounts",
      "112,500 Contacts",
      "225 Broadcasts/month",
      "600 Status Posts/month",
      "Full Analytics (90 days) + CSV",
      "30 Ad Slots",
      "Full Chatbot + Lead Capture",
      "7 Team Members",
      "API Access",
      "Email + WhatsApp Support",
    ],
  },
  {
    ...PRICING_PLANS.scale,
    badge: null,
    highlighted: false,
    features: [
      "15 WhatsApp Accounts",
      "300,000 Contacts",
      "600 Broadcasts/month",
      "1,500 Status Posts/month",
      "Full Analytics (365 days) + CSV + PDF",
      "80 Ad Slots",
      "Full Chatbot + All Flows",
      "15 Team Members",
      "API Access",
      "Dedicated Account Manager",
    ],
  },
];

export function PricingCards() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-section-sm lg:py-section">
      <div className="section-container">
        <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-500">
          Start with Starter, scale as you grow. All plans include a 7-day
          free trial.
        </p>

        {/* Billing Toggle */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${
              !yearly ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              yearly ? "bg-green-600" : "bg-gray-300"
            }`}
            aria-label="Toggle yearly billing"
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                yearly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              yearly ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Yearly
          </span>
          {yearly && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-600">
              Save 17%
            </span>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`relative overflow-hidden rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-green-500 bg-white shadow-lg shadow-green-100"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                    plan.highlighted
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">
                  {formatNaira(
                    yearly
                      ? Math.round(plan.priceYearly / 12)
                      : plan.priceMonthly
                  )}
                </span>
                <span className="text-gray-500">/mo</span>
                {yearly && (
                  <p className="mt-1 text-sm text-gray-400">
                    {formatNaira(plan.priceYearly)} billed annually
                  </p>
                )}
              </div>

              <Link
                href="/sign-up"
                className={`mb-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "btn-gradient"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                Start Free Trial
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
