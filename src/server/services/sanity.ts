import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ── Blog Queries ────────────────────────────────────────

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown[]; // Portable Text
  mainImage: {
    asset: { _ref: string };
    alt?: string;
  };
  author: {
    name: string;
    image?: { asset: { _ref: string } };
    bio?: string;
  };
  categories: Array<{ title: string; slug: { current: string } }>;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      "author": author->{name, image, bio},
      "categories": categories[]->{ title, slug },
      publishedAt,
      _createdAt,
      _updatedAt
    }`
  );
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      mainImage,
      "author": author->{name, image, bio},
      "categories": categories[]->{ title, slug },
      publishedAt,
      _createdAt,
      _updatedAt
    }`,
    { slug }
  );
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "post"]{ slug }`
  );
  return posts.map((p) => p.slug.current);
}
