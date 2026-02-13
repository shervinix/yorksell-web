import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import Link from "next/link";

function isAdmin(email: string | null | undefined): boolean {
  const list = process.env.ADMIN_EMAILS;
  if (!list || !email) return false;
  const emails = list.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!isAdmin(session.user?.email)) {
    redirect("/members");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {session.user?.email}
            </span>
            <Link
              href="/members"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Members
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
