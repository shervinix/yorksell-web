import type { PrismaClient } from "@prisma/client";

const ADMIN_EMAILS_KEY = "admin_emails";

/**
 * Check if an email has admin access. Checks ADMIN_EMAILS env first, then
 * SiteSetting "admin_emails" (list of emails granted via admin panel).
 * Pass prisma to include DB-granted admins.
 */
export async function isAdmin(
  email: string | null | undefined,
  prisma?: PrismaClient
): Promise<boolean> {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  const envList = process.env.ADMIN_EMAILS;
  if (envList) {
    const envEmails = envList.split(",").map((e) => e.trim().toLowerCase());
    if (envEmails.includes(lower)) return true;
  }
  if (!prisma) return false;
  const row = await prisma.siteSetting.findUnique({
    where: { key: ADMIN_EMAILS_KEY },
  });
  const value = row?.value;
  if (!Array.isArray(value)) return false;
  const list = value
    .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
    .filter(Boolean);
  return list.includes(lower);
}

export { ADMIN_EMAILS_KEY };
