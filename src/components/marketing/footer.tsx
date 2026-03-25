import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "mailto:hello@zappix.ng" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Refund Policy", href: "/legal/refund-policy" },
  ],
  Connect: [
    { label: "Twitter", href: "https://twitter.com/zappixng" },
    { label: "Instagram", href: "https://instagram.com/zappixng" },
    { label: "WhatsApp", href: "https://wa.me/2348000000000" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="section-container py-16">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <span className="text-lg font-bold text-white">Z</span>
              </div>
              <span className="text-xl font-bold text-white">Zappix</span>
            </div>
            <p className="max-w-xs text-sm text-gray-400">
              The operating system for WhatsApp TV businesses in Nigeria.
              Schedule, broadcast, analyze, and grow.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Zappix. Built for Nigeria&apos;s
            WhatsApp economy.
          </p>
        </div>
      </div>
    </footer>
  );
}
