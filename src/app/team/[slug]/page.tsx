import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeamMember, getTeamMemberSlugs } from "@/data/team";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return getTeamMemberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await (typeof (params as Promise<{ slug: string }>).then === "function"
    ? (params as Promise<{ slug: string }>)
    : Promise.resolve(params as { slug: string }));
  const member = getTeamMember(slug);
  if (!member) return { title: "Team Member | Yorksell" };
  return {
    title: `${member.name} | Yorksell`,
    description: member.tagline ?? member.bio.slice(0, 160),
    openGraph: {
      title: `${member.name} | Yorksell Real Estate Group`,
      description: member.tagline ?? member.bio.slice(0, 160),
    },
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await (typeof (params as Promise<{ slug: string }>).then === "function"
    ? (params as Promise<{ slug: string }>)
    : Promise.resolve(params as { slug: string }));

  const member = getTeamMember(slug);
  if (!member) notFound();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Meet The Team
        </Link>

        <article className="mt-8 md:mt-12">
          <div className="grid gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-14">
            <div className="shrink-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <img
                  src={member.image}
                  alt=""
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
                {member.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-[var(--accent)]">{member.role}</p>

              <div className="mt-8 prose prose-invert max-w-none">
                <p className="leading-relaxed text-[var(--foreground)]">{member.bio}</p>
              </div>

              <div className="mt-10 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Contact
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {member.contact.email && (
                    <a
                      href={`mailto:${member.contact.email}`}
                      className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--accent)] hover:underline"
                    >
                      <span className="text-[var(--muted)]">Email</span>
                      {member.contact.email}
                    </a>
                  )}
                  {member.contact.phone && (
                    <a
                      href={`tel:${member.contact.phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--accent)] hover:underline"
                    >
                      <span className="text-[var(--muted)]">Phone</span>
                      {member.contact.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Get in touch
                </Link>
                <Link
                  href="/team"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                >
                  View all team
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
