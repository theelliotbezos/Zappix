import {
  Clock,
  Send,
  Users,
  BarChart3,
  Megaphone,
  Bot,
  List,
  Smartphone,
  Gift,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Status Scheduler",
    description: "Schedule and auto-post WhatsApp statuses at the perfect time.",
  },
  {
    icon: Send,
    title: "Broadcast Engine",
    description: "Send messages to thousands of contacts with smart throttling.",
  },
  {
    icon: Users,
    title: "Contact Manager",
    description: "Import, tag, and segment your contacts with ease.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track reach, delivery, growth, and revenue in real time.",
  },
  {
    icon: Megaphone,
    title: "Ad Slot Manager",
    description: "Create ad slots and let advertisers book and pay online.",
  },
  {
    icon: Bot,
    title: "Chatbot Builder",
    description: "Build FAQ bots and auto-responders for 24/7 support.",
  },
  {
    icon: List,
    title: "Menu Bot",
    description: "Create interactive menus for products and services.",
  },
  {
    icon: Smartphone,
    title: "Multi-Account",
    description: "Manage multiple WhatsApp numbers from one dashboard.",
  },
  {
    icon: Gift,
    title: "Referral System",
    description: "Earn 25% recurring commission on every user you refer.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-section-sm lg:py-section">
      <div className="section-container">
        <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
          Everything Your WhatsApp TV Needs
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-gray-500">
          Nine powerful tools designed specifically for Nigerian WhatsApp TV
          businesses.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-hover gradient-border rounded-xl border border-gray-200 bg-white p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
