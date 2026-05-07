"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/featured", label: "Featured" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/footprint", label: "Footprint" },
  { href: "/admin/mls-sync", label: "MLS Sync" },
  { href: "/admin/admins", label: "Admins" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {NAV_LINKS.map(({ href, label }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={
              "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
              (active
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50")
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
