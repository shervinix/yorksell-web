import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";

export const metadata = {
  title: "Client Services | Yorksell",
  description: "Your files, stats, notes, and updates as a Yorksell client.",
};

export default async function ClientServicesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/members/client-services");
  }

  const userId = session.user?.id as string;
  if (!userId) {
    redirect("/login?callbackUrl=/members/client-services");
  }

  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      files: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  const hasServices =
    client &&
    (client.buyerClient ||
      client.sellerClient ||
      client.propertyManagementClient);

  const services: string[] = [];
  if (client?.buyerClient) services.push("Buyer");
  if (client?.sellerClient) services.push("Seller");
  if (client?.propertyManagementClient) services.push("Property Management");

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Client Services
        </h1>

        {!hasServices ? (
          <section className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-12">
            <p className="text-lg text-[var(--muted)]">
              You currently don&apos;t have any services as a client on the
              platform.
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Once you become a client for buying, selling, or property
              management, you&apos;ll have access to file sharing, stats, notes,
              and updates here.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Contact us
            </Link>
          </section>
        ) : (
          <>
            <section className="mt-6 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Your services
              </h2>
              <p className="mt-2 text-[var(--foreground)]">
                {services.join(", ")}
              </p>
            </section>

            {client.showFiles && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  File sharing
                </h2>
                {client.files.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-[var(--muted)]">
                      No files shared yet.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {client.files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        <span className="font-medium text-[var(--foreground)]">
                          {file.name}
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[var(--accent)] hover:underline"
                        >
                          View / Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {client.showStats && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Stats
                </h2>
                {!client.statsJson ||
                (typeof client.statsJson === "object" &&
                  Object.keys(client.statsJson as object).length === 0) ? (
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-[var(--muted)]">
                      No stats available yet.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {typeof client.statsJson === "object" &&
                        client.statsJson !== null &&
                        Object.entries(client.statsJson as Record<string, unknown>).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="rounded-xl border border-white/[0.06] bg-[var(--surface)] p-4"
                            >
                              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                                {key}
                              </p>
                              <p className="mt-1 font-semibold text-[var(--foreground)]">
                                {String(value)}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {client.showNotes && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Notes
                </h2>
                {client.notes.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-[var(--muted)]">
                      No notes yet.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {client.notes.map((note) => (
                      <li
                        key={note.id}
                        className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        <p className="whitespace-pre-wrap text-sm text-[var(--foreground)]">
                          {note.content}
                        </p>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {new Date(note.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {client.showUpdates && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Updates
                </h2>
                {client.updates.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-[var(--muted)]">
                      No updates yet.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {client.updates.map((update) => (
                      <li
                        key={update.id}
                        className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {update.title}
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
                          {update.content}
                        </p>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {new Date(update.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            <section className="mt-10">
              <Link
                href="/members"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                ← Back to Members area
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
