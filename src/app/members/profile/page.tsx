import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { ProfileForm } from "./ProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountSection } from "./DeleteAccountSection";

export default async function MembersProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/members/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: {
      name: true,
      email: true,
      phone: true,
      company: true,
      address: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/members/profile");
  }

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-16">
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Members area
        </Link>

        {/* Profile header */}
        <div className="mt-8 flex items-center gap-5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? ""}
              className="h-16 w-16 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/20 text-lg font-bold text-[var(--accent)]">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.name ?? "Your profile"}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
              {user.email && <span>{user.email}</span>}
              {memberSince && (
                <>
                  <span className="text-white/20">·</span>
                  <span>Member since {memberSince}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Account information */}
        <section className="mt-10 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Account information
            </h2>
          </div>
          <div className="mt-6">
            <ProfileForm
              initial={{
                name: user.name,
                email: user.email,
                phone: user.phone,
                company: user.company,
                address: user.address,
                image: user.image,
              }}
            />
          </div>
        </section>

        {/* Change password */}
        <section className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[var(--accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Change password
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            Use a strong password with at least 8 characters.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </section>

        {/* Danger zone */}
        <section className="mt-8">
          <DeleteAccountSection />
        </section>
      </div>
    </main>
  );
}
