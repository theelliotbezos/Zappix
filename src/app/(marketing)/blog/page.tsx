import { Metadata } from "next";
import { getAllPosts } from "@/server/services/sanity";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights for growing your WhatsApp TV business in Nigeria.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    posts = await getAllPosts();
  } catch {
    // Sanity might not be configured yet
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h1 className="mb-4 text-4xl font-bold lg:text-hero-sm">
            Zappix Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Tips, guides, and insights for growing your WhatsApp TV business.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-section-sm lg:py-section">
        <div className="section-container">
          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <h2 className="mb-2 text-xl font-semibold">
                Coming Soon
              </h2>
              <p className="text-gray-500">
                We are working on some great content. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="card-hover group overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="h-48 bg-gray-100" />
                  <div className="p-6">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.categories?.map((cat) => (
                        <span
                          key={cat.slug.current}
                          className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600"
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                    <h2 className="mb-2 text-lg font-semibold group-hover:text-green-600">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString(
                        "en-NG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-green-50 py-section-sm lg:py-section">
        <div className="section-container text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Get WhatsApp TV tips in your inbox
          </h2>
          <p className="mx-auto mb-8 max-w-md text-gray-500">
            Weekly insights on growing your WhatsApp TV business. No spam,
            unsubscribe anytime.
          </p>
          <form className="mx-auto flex max-w-md gap-3">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            <button type="submit" className="btn-gradient whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
