# Yorksell Web - AI Coding Agent Instructions

## Project Overview
Yorksell is a Next.js 16+ web application for real estate management, built with TypeScript, Tailwind CSS, and PostgreSQL. It uses NextAuth.js for authentication with credentials-based login and a Prisma ORM for database management.

## Tech Stack
- **Framework**: Next.js 16.1+ (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Auth**: NextAuth.js 4 with JWT strategy + Prisma Adapter
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4 with PostCSS
- **Path Alias**: `@/*` resolves to `./src/*`

## Architecture & Key Components

### Authentication Flow
1. **Signup** (`POST /api/auth/signup`):
   - Validates email (unique, lowercase, trimmed) and password (min 8 chars)
   - Hashes password with bcrypt (12 rounds)
   - Returns user object with id, email, name
   - Returns 409 if user exists, 400 for validation failures

2. **Login** (CredentialsProvider in `src/server/auth.ts`):
   - Uses JWT session strategy (not database sessions)
   - Verifies credentials against `User.passwordHash` via bcrypt
   - Token includes user.id for session identification

3. **Authorization**:
   - Middleware (`src/middleware.ts`) protects `/members/*` routes
   - Uses NextAuth middleware, requires valid session to access
   - Client components use `SessionProvider` from `next-auth/react`

4. **Session Extension** (`next-auth.d.ts`):
   - JWT and Session interfaces extended to include `user.id`
   - Required for accessing `session.user.id` in callbacks and server components

### Database Schema
- **User**: email (unique), passwordHash (credentials only), name, image, timestamps
- **Account**: OAuth provider data (if extending OAuth in future)
- **Session**: JWT session tokens
- **VerificationToken**: Reserved for email verification flows

### Database Access
- Singleton instance in `src/server/db/prisma.ts` using global pattern for dev Hot Module Reloading
- Import via: `import { prisma } from "@/server/db/prisma"`
- Logging: warnings + errors in dev, errors only in production

## Developer Workflows

### Setup & Running
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Migrations
```bash
npx prisma migrate dev --name <description>  # Create + apply migration
npx prisma studio   # Open visual database browser
npx prisma db push  # Sync schema to dev database (for rapid iteration)
```

### Environment Setup
- `.env` file must contain: `DATABASE_URL=postgresql://...`
- `NEXTAUTH_URL` and `NEXTAUTH_SECRET` for production (auto-configured in dev)

## Project-Specific Patterns

### API Routes
- Place route handlers in `src/app/api/*/route.ts`
- Use TypeScript for type safety across request/response boundaries
- Validate and sanitize all inputs (see signup endpoint for reference)
- Return NextResponse with appropriate status codes

### Server vs Client Components
- Use `"use client"` for components accessing SessionProvider or Next Auth hooks
- Server components by default; prefer them for database queries via `getServerSession`
- Example: `SignOutButton.tsx` is client component (uses `signOut()` hook)

### Error Handling
- Signup route catches JSON parse errors and returns 400 with "Invalid request"
- Wrap async operations in try-catch; avoid throwing unhandled errors
- Return appropriate HTTP status codes (400 validation, 409 conflict, 500 server error)

### Prisma Patterns
- Use `select` to minimize returned fields (e.g., signup excludes passwordHash)
- Leverage Prisma adapter for session/account management
- Never expose `passwordHash` in API responses

### Styling
- Tailwind 4 with PostCSS (`postcss.config.mjs` configured)
- Global styles in `src/app/globals.css`
- Apply responsive utilities and custom components as needed

## Common Tasks

**Add a protected route**:
1. Create page in `src/app/members/<route>/page.tsx`
2. Use `getServerSession(authOptions)` for session verification
3. Access `session?.user?.id` for user-specific data

**Add database model**:
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <change>`
3. Regenerates Prisma Client automatically

**Create API endpoint**:
1. Add `src/app/api/<path>/route.ts`
2. Export POST/GET/etc. handlers
3. Return NextResponse.json() with proper status codes

## ESLint & Code Quality
- Uses ESLint 9 with Next.js core-web-vitals + TypeScript configs
- Ignore patterns: `.next`, `out`, `build`, `next-env.d.ts`
- Run linting via `npm run lint`
