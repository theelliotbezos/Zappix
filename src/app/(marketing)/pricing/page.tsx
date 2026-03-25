import { Metadata } from "next";
import { PricingCards } from "@/components/marketing/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for WhatsApp TV businesses. Start at N10,000/month with no hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h1 className="mb-4 text-4xl font-bold lg:text-hero-sm">
            Simple, Honest Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            No hidden fees, no surprises. Pick a plan that fits your WhatsApp
            TV business and start growing today.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingCards />

      {/* Feature Comparison Table */}
      <section className="py-section-sm lg:py-section">
        <div className="section-container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Compare Plans
          </h2>
          <div className="overflow-x-auto">
            <p className="text-center text-gray-400">
              Detailed feature comparison table will be implemented here
            </p>
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="bg-gray-50 py-section-sm lg:py-section">
        <div className="section-container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Pricing FAQ
          </h2>
          <div className="mx-auto max-w-2xl space-y-6">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 7-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all Nigerian bank cards, bank transfers, and USSD payments via Paystack.",
              },
              {
                q: "What is your refund policy?",
                a: "We offer a full refund within 7 days of your first payment. See our refund policy for details.",
              },
              {
                q: "Can I pay yearly?",
                a: "Yes! Save 17% when you pay annually. That is 2 months free.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-2 font-semibold">{faq.q}</h3>
                <p className="text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h2 className="mb-4 text-3xl font-bold">Need a custom plan?</h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-500">
            Running an agency or managing more than 15 accounts? Let us talk
            about a custom plan that fits your needs.
          </p>
          <a
            href="mailto:hello@zappix.ng"
            className="btn-gradient text-lg"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </>
  );
}
