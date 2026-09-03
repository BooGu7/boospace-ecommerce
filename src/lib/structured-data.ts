import { siteConfig } from "./config";
import type { Brand, Category, Product } from "@/types";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };
}

export function productJsonLd(
  product: Product,
  brand?: Brand | null,
  category?: Category | null,
) {
  const variant = product.variants?.[0];
  const price = variant ? Math.round(variant.price / 100) : 0;
  const currentStock =
    product.stock ?? variant?.inventory?.quantity ?? 0;
  const inStock = currentStock > 0;

  const images = (product.images || [])
    .map((img) => (typeof img === "string" ? img : img.url))
    .filter(Boolean);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.length > 0 ? images : undefined,
    description: product.shortDescription || product.description,
    sku: product.sku || variant?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: brand?.name || siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/${product.slug}`,
      priceCurrency: "VND",
      price: price.toString(),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  if (category) {
    schema.category = category.name;
  }

  if (product.rating && product.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating.toFixed(1)),
      reviewCount: Math.max(product.reviewCount || 1, 1),
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address.street,
    addressLocality: siteConfig.contact.address.city,
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.contact.phone,
    contactType: "customer service",
    areaServed: "VN",
    availableLanguage: ["Vietnamese", "English"],
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.tiktok,
    siteConfig.social.youtube,
  ].filter(Boolean),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
