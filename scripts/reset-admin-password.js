/**
 * One-off script to set a new password for a user (e.g. admin).
 * From project root, with DATABASE_URL loaded (Node 20+):
 *   node --env-file=.env.local scripts/reset-admin-password.js <email> <newPassword>
 * Or load .env.local yourself first, then:
 *   node scripts/reset-admin-password.js <email> <newPassword>
 * Example:
 *   node --env-file=.env.local scripts/reset-admin-password.js acelllix@gmail.com MyNewSecurePass123
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Usage: node --env-file=.env.local scripts/reset-admin-password.js <email> <newPassword>");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const emailLower = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: emailLower },
  });

  if (!user) {
    console.error("No user found with email:", emailLower);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log("Password updated for:", user.email ?? user.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
