import { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Zappix - The Operating System for WhatsApp TV Businesses",
  description:
    "Schedule WhatsApp statuses, send broadcasts, manage contacts, sell ad slots, and grow your WhatsApp TV business with Zappix.",
};

export default function LandingPage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Social Proof Bar */}
      <section className="border-y border-gray-200 bg-gray-50 py-8">
        <div className="section-container text-center">
          <p className="text-sm font-medium text-gray-500">
            Trusted by WhatsApp TV owners across Nigeria
          </p>
        </div>
      </section>

      {/* 3. Features Grid */}
      <FeaturesGrid />

      {/* 4. How It Works */}
      <section className="bg-gray-50 py-section-sm lg:py-section">
        <div className="section-container">
          <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-gray-500">
            Three simple steps to automate your WhatsApp TV business.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Connect",
                description:
                  "Scan a QR code to connect your WhatsApp number. It takes less than 30 seconds.",
              },
              {
                step: "2",
                title: "Schedule",
                description:
                  "Upload your content and schedule status posts and broadcasts in advance.",
              },
              {
                step: "3",
                title: "Grow",
                description:
                  "Track analytics, manage contacts, and monetize with ad slots while you sleep.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dashboard Preview */}
      <section className="py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Your Command Center
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-500">
            Everything you need to run your WhatsApp TV business, all in one
            place.
          </p>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xl">
            <div className="flex h-8 items-center gap-2 border-b border-gray-200 bg-white px-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="p-8">
              <p className="text-gray-400">
                Dashboard preview will be added here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Pricing Teaser */}
      <PricingCards />

      {/* 8. FAQ */}
      <Faq />

      {/* 9. Final CTA */}
      <section className="bg-gray-900 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Ready to grow your WhatsApp TV?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-400">
            Join hundreds of WhatsApp TV owners who are automating their
            business with Zappix.
          </p>
          <a href="/sign-up" className="btn-gradient text-lg">
            Start Your Free Trial
          </a>
        </div>
      </section>
    </>
  );
}
