import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/data/blog";
import FadeUp from "@/app/FadeUp";

export const metadata: Metadata = {
  title: "Blog | Yorksell",
  description:
    "Insights and advice from Yorksell Real Estate Group. Toronto & GTA real estate tips, market updates, and guides for buyers and sellers.",
  openGraph: {
    title: "Blog | Yorksell Real Estate Group",
    description:
      "Insights and advice from Yorksell. Toronto & GTA real estate tips, market updates, and guides.",
    type: "website",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2600&q=80";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[36vh] overflow-hidden pt-[6.5rem]">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-end px-4 pb-12 pt-4 sm:px-6 md:pb-16 md:pt-6">
          <h1 className="hero-enter-1 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Blog
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Market insights, buying and selling guides, and straight talk about Toronto real estate.
          </p>
        </div>
      </header>

      {/* Posts */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">

          {posts.length === 0 ? (
            <FadeUp>
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-white/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-base font-medium text-[var(--foreground)]">No posts yet</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Check back soon. Articles are coming.</p>
              </div>
            </FadeUp>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
              {posts.map((post, i) => (
                <FadeUp key={post.id} delay={i * 60} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                      {post.coverImageUrl ? (
                        <Link
                          href={`/blog/${encodeURIComponent(post.slug)}`}
                          className="relative block aspect-video w-full overflow-hidden bg-[var(--surface)]"
                          tabIndex={-1}
                        >
                          <img
                            src={post.coverImageUrl}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        </Link>
                      ) : (
                        <div className="flex aspect-video w-full items-center justify-center bg-[var(--surface)]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-10 w-10 text-white/10" aria-hidden>
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path strokeLinecap="round" d="M3 9h18M9 21V9" />
                          </svg>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        {post.publishedAt && (
                          <time
                            dateTime={post.publishedAt.toISOString()}
                            className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
                          >
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="flex-1">
                          <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)] transition group-hover:text-white">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                              {post.excerpt}
                            </p>
                          )}
                        </Link>
                        <div className="mt-5 border-t border-white/[0.06] pt-4">
                          <Link
                            href={`/blog/${encodeURIComponent(post.slug)}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                          >
                            Read article
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                    Have a question?
                  </h2>
                  <p className="mt-3 text-[var(--muted)]">
                    If you did not find what you were looking for, get in touch. We are happy to talk through any buying or selling question directly.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
