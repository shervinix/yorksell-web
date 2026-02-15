import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[var(--background)] px-4 py-8 text-xs text-[var(--muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Yorksell Real Estate Group.</p>
        <div className="flex flex-wrap gap-6">
          <Link href="/privacy" className="hover:text-[var(--foreground)]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--foreground)]">
            Terms
          </Link>
          <Link href="/login?callbackUrl=/admin" className="hover:text-[var(--foreground)]">
            Yorksell Login
          </Link>
          <Link href="/join" className="hover:text-[var(--foreground)]">
            Join Yorksell
          </Link>
        </div>
      </div>
    </footer>
  );
}
