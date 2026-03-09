import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPostBySlug } from "@/data/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yorksell.com";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

function resolveParams(params: PageProps["params"]) {
  return typeof (params as Promise<{ slug: string }>).then === "function"
    ? (params as Promise<{ slug: string }>)
    : Promise.resolve(params as { slug: string });
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
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Blog
        </Link>

        <article className="mt-8 md:mt-12">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              {post.title}
            </h1>
            <time
              dateTime={post.publishedAt?.toISOString()}
              className="mt-2 block text-sm text-[var(--muted)]"
            >
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null}
            </time>
          </header>

          {post.coverImageUrl && (
            <div className="mb-8 aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)]">
              <img
                src={post.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
