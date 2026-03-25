import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SEO_DEFAULTS } from "@/lib/constants";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SEO_DEFAULTS.title,
    template: "%s | Zappix",
  },
  description: SEO_DEFAULTS.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://zappix.ng"
  ),
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: "https://zappix.ng",
    siteName: "Zappix",
    images: [{ url: SEO_DEFAULTS.ogImage, width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.ogImage],
    creator: SEO_DEFAULTS.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={nunito.variable}>
        <body className="font-body">{children}</body>
      </html>
    </ClerkProvider>
  );
}
