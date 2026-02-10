"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-xl border px-4 py-2 text-sm font-medium"
    >
      Sign out
    </button>
  );
}