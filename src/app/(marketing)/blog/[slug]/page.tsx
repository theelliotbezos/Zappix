import { Metadata } from "next";
import { getPostBySlug, getPostSlugs } from "@/server/services/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: "Post Not Found" };

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt,
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="py-section-sm lg:py-section">
      <div className="section-container">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/blog"
              className="text-sm text-gray-500 hover:text-green-600"
            >
              &larr; Back to Blog
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories?.map((cat) => (
                <span
                  key={cat.slug.current}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600"
                >
                  {cat.title}
                </span>
              ))}
            </div>
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {post.author && <span>By {post.author.name}</span>}
              <span>&middot;</span>
              <time>
                {new Date(post.publishedAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          {/* Body - TODO: Render Portable Text */}
          <div className="prose prose-lg prose-green mx-auto">
            <p className="text-gray-500">
              Blog post body will be rendered with Portable Text components.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
