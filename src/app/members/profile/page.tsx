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
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/members/profile");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-16">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Members area
        </Link>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
          Profile &amp; settings
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Manage your account, security, and preferences.
        </p>

        {/* Account information */}
        <section className="mt-10 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Account information
          </h2>
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
        <section className="mt-10 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Change password
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Use a strong password with at least 8 characters.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </section>

        {/* Danger zone */}
        <section className="mt-10">
          <DeleteAccountSection />
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/members"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
          >
            Back to Members area
          </Link>
        </div>
      </div>
    </main>
  );
}
