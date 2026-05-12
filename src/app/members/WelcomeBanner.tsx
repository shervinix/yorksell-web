"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  displayName: string;
  initials: string;
  image: string | null;
  memberSince: string | null;
  agentName: string | null;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ displayName, initials, image, memberSince, agentName }: Props) {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const firstName = displayName.split(" ")[0];

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {image ? (
            <img
              src={image}
              alt={displayName}
              className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/15 text-lg font-bold text-[var(--accent)]">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">
              {greeting}, {firstName}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-[var(--muted)]">
              {memberSince && <span>Member since {memberSince}</span>}
              {agentName && (
                <>
                  {memberSince && <span className="text-white/20">·</span>}
                  <span>Working with {agentName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-white/[0.14] hover:text-[var(--foreground)]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </div>
    </section>
  );
}
