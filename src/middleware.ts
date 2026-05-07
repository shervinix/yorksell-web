import { withAuth } from "next-auth/middleware";

// Protect /admin and /members routes at the edge — requires a valid session JWT.
// Fine-grained admin checks (isAdmin) still happen inside the admin layout.
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/admin/:path*", "/members/:path*"],
};