import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-section-sm lg:py-section">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50/50 to-white" />

      <div className="section-container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-hero-sm font-bold tracking-tight text-gray-900 lg:text-hero">
            The Operating System for{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              WhatsApp TV
            </span>{" "}
            Businesses
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500 lg:text-xl">
            Schedule statuses, send broadcasts, manage contacts, sell ad slots,
            and grow your WhatsApp TV business - all from one dashboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up" className="btn-gradient px-8 py-4 text-lg">
              Start Free Trial
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-green-300 hover:bg-green-50"
            >
              See Features
            </Link>
          </div>
        </div>

        {/* Floating preview cards */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="flex h-8 items-center gap-2 border-b border-gray-200 bg-gray-50 px-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Contacts", value: "12,450" },
                    { label: "Statuses Today", value: "24" },
                    { label: "Ad Revenue", value: "N45,000" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-gray-50 p-4 text-center"
                    >
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="mt-1 text-xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
