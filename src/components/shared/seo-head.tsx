import { SEO_DEFAULTS } from "@/lib/constants";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * SEO component for structured data injection.
 * Metadata is handled via Next.js Metadata API in page files.
 * This component adds JSON-LD structured data.
 */
export function SeoHead({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
}: SeoHeadProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Zappix",
    description,
    url: "https://zappix.ng",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NGN",
      lowPrice: "10000",
      highPrice: "100000",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
