const testimonials = [
  {
    name: "Adebayo O.",
    role: "WhatsApp TV Owner, Lagos",
    quote:
      "Zappix changed my business completely. I used to spend hours manually posting statuses. Now it is all automated.",
  },
  {
    name: "Chioma N.",
    role: "WhatsApp TV Owner, Abuja",
    quote:
      "The ad slot manager alone pays for my subscription. Advertisers can now book and pay without me lifting a finger.",
  },
  {
    name: "Emeka A.",
    role: "Digital Agency Owner",
    quote:
      "Managing 5 WhatsApp TVs for clients used to be a nightmare. With Zappix multi-account, I handle everything from one dashboard.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-section-sm lg:py-section">
      <div className="section-container">
        <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
          Loved by WhatsApp TV Owners
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-gray-500">
          Hear from business owners who are growing with Zappix.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              <p className="mb-6 text-gray-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
