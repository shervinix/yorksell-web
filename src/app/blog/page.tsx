import Link from "next/link";
import { getPublishedPosts } from "@/data/blog";

export const metadata = {
  title: "Blog",
  description:
    "Insights and advice from Yorksell Real Estate Group. Toronto & GTA real estate tips, market updates, and guides for buyers and sellers.",
  openGraph: {
    title: "Blog | Yorksell Real Estate Group",
    description:
      "Insights and advice from Yorksell. Toronto & GTA real estate tips, market updates, and guides.",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Insights and advice from Yorksell Real Estate Group.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-[var(--muted)]">No posts yet. Check back soon.</p>
        ) : (
          <ul className="mt-12 space-y-8">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/10">
                  <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="block">
                    {post.coverImageUrl && (
                      <div className="mb-4 aspect-video overflow-hidden rounded-xl">
                        <img
                          src={post.coverImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          sizes="(max-width: 768px) 100vw, 672px"
                        />
                      </div>
                    )}
                    <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] hover:text-[var(--accent)]">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                      {post.excerpt}
                    </p>
                    <time
                      dateTime={post.publishedAt?.toISOString()}
                      className="mt-3 block text-xs text-[var(--muted)]"
                    >
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : null}
                    </time>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
