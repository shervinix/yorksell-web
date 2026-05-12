import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPostBySlug, getPublishedPosts } from "@/data/blog";
import FadeUp from "@/app/FadeUp";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yorksell.com";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

function resolveParams(params: PageProps["params"]) {
  return typeof (params as Promise<{ slug: string }>).then === "function"
    ? (params as Promise<{ slug: string }>)
    : Promise.resolve(params as { slug: string });
}

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post | Yorksell" };
  const description = post.excerpt.slice(0, 160);
  const ogImage = post.coverImageUrl
    ? [{ url: post.coverImageUrl, width: 1200, height: 630, alt: post.title }]
    : undefined;
  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | Yorksell Real Estate Group`,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const [post, allPosts] = await Promise.all([
    getPublishedPostBySlug(slug),
    getPublishedPosts(),
  ]);
  if (!post) notFound();

  const morePosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${BASE}/blog/${encodeURIComponent(post.slug)}`,
    ...(post.coverImageUrl && { image: post.coverImageUrl }),
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover image — full width above title */}
      {post.coverImageUrl && (
        <div className="relative -mt-[6.5rem] aspect-[21/9] w-full overflow-hidden bg-[var(--surface)] pt-[6.5rem]">
          <img
            src={post.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        </div>
      )}

      <div className={`mx-auto max-w-3xl px-4 sm:px-6 ${post.coverImageUrl ? "py-10 md:py-14" : "mt-[6.5rem] py-10 md:py-16"}`}>

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8l5 5" />
          </svg>
          Blog
        </Link>

        {/* Article header */}
        <article className="mt-8 md:mt-10">
          <header className="mb-8 border-b border-white/[0.06] pb-8">
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt.toISOString()}
                className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
              >
                {formatDate(post.publishedAt)}
              </time>
            )}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] md:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
                {post.excerpt}
              </p>
            )}
            <p className="mt-4 text-xs text-white/30">{readingTime(post.body)}</p>
          </header>

          {/* Body */}
          <div className="blog-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          {/* Bottom back link */}
          <div className="mt-12 border-t border-white/[0.06] pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8l5 5" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>
      </div>

      {/* More from the blog */}
      {morePosts.length > 0 && (
        <section className="border-t border-white/[0.06] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <FadeUp>
              <div className="mb-8">
                <div className="h-px w-8 bg-[var(--accent)]" />
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">More from the blog</p>
              </div>
            </FadeUp>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((related, i) => (
                <FadeUp key={related.id} delay={i * 70} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                    {related.coverImageUrl ? (
                      <Link
                        href={`/blog/${encodeURIComponent(related.slug)}`}
                        className="block aspect-video w-full overflow-hidden bg-[var(--surface)]"
                        tabIndex={-1}
                      >
                        <img
                          src={related.coverImageUrl}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        />
                      </Link>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-[var(--surface)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-8 w-8 text-white/10" aria-hidden>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path strokeLinecap="round" d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      {related.publishedAt && (
                        <time
                          dateTime={related.publishedAt.toISOString()}
                          className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
                        >
                          {formatDate(related.publishedAt)}
                        </time>
                      )}
                      <Link href={`/blog/${encodeURIComponent(related.slug)}`} className="flex-1">
                        <h2 className="text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] transition group-hover:text-white">
                          {related.title}
                        </h2>
                        {related.excerpt && (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                            {related.excerpt}
                          </p>
                        )}
                      </Link>
                      <div className="mt-4 border-t border-white/[0.06] pt-4">
                        <Link
                          href={`/blog/${encodeURIComponent(related.slug)}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                        >
                          Read
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

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
                    We are happy to talk through any buying or selling question directly. No obligation, no pressure.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    More articles
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
