import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover all the tools Zappix gives you to automate and grow your WhatsApp TV business.",
};

const features = [
  {
    title: "Status Scheduler",
    description:
      "Schedule WhatsApp status posts in advance. Upload images, videos, or text and let Zappix post them automatically at the perfect time.",
    icon: "Clock",
  },
  {
    title: "Broadcast Engine",
    description:
      "Send messages to thousands of contacts at once with smart throttling. Track delivery rates and optimize your reach.",
    icon: "Send",
  },
  {
    title: "Contact Manager",
    description:
      "Import, organize, and segment your contacts with tags and custom lists. CSV import and smart filtering built in.",
    icon: "Users",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track your growth with detailed analytics. See status reach, broadcast delivery, audience growth, and ad revenue over time.",
    icon: "BarChart3",
  },
  {
    title: "Ad Slot Manager",
    description:
      "Create ad slots and share a public booking page. Advertisers pay via Paystack, you approve and deliver. Passive income on autopilot.",
    icon: "Megaphone",
  },
  {
    title: "Chatbot Builder",
    description:
      "Build FAQ bots, lead capture flows, and auto-responders. Handle customer inquiries 24/7 without lifting a finger.",
    icon: "Bot",
  },
  {
    title: "Menu Bot",
    description:
      "Create an interactive menu system for your WhatsApp. Guide customers through products, services, and ordering flows.",
    icon: "List",
  },
  {
    title: "Multi-Account Manager",
    description:
      "Connect and manage multiple WhatsApp numbers from a single dashboard. Perfect for running multiple TVs or managing client accounts.",
    icon: "Smartphone",
  },
  {
    title: "Referral System",
    description:
      "Earn 25% recurring commission on every user you refer. Payouts go directly to your Nigerian bank account via Paystack.",
    icon: "Gift",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h1 className="mb-4 text-4xl font-bold lg:text-hero-sm">
            Everything You Need to Run a WhatsApp TV
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Nine powerful features designed specifically for Nigerian WhatsApp
            TV businesses. No bloat, just what you need.
          </p>
        </div>
      </section>

      {/* Feature Deep Dives */}
      <section className="py-section-sm lg:py-section">
        <div className="section-container space-y-24">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center gap-12 lg:flex-row ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <h2 className="mb-4 text-3xl font-bold">{feature.title}</h2>
                <p className="text-lg text-gray-500">{feature.description}</p>
              </div>
              <div className="flex-1">
                <div className="flex h-64 items-center justify-center rounded-2xl bg-gray-100">
                  <p className="text-gray-400">
                    {feature.title} illustration
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-50 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Start using all these features today
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-500">
            Plans start at just N10,000/month. No contracts, cancel anytime.
          </p>
          <a href="/pricing" className="btn-gradient text-lg">
            View Pricing
          </a>
        </div>
      </section>
    </>
  );
}
