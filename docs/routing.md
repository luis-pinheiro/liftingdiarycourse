# Routing Standards

This document defines the routing architecture and coding standards for this application.

## Route Structure

All application routes **MUST** be prefixed with `/dashboard`:

```
/dashboard              → Main dashboard page
/dashboard/workouts     → Workouts section
/dashboard/exercises    → Exercises section
/dashboard/settings     → User settings
```

### Rules

- **NEVER** create routes outside of `/dashboard` for authenticated user content
- **ALWAYS** nest new feature routes under `/dashboard/[feature-name]`
- The root `/` route should redirect to `/dashboard` for logged-in users or to login for guests

---

## Route Protection

All `/dashboard` routes are **protected routes** and require authentication.

### Implementation: Next.js Middleware

Route protection **MUST** be implemented using Next.js middleware (`middleware.ts`):

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = // ... check auth (e.g., session cookie, token)
  
  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

### Rules

- **ALWAYS** use middleware for route protection, not client-side guards
- **ALWAYS** include `/dashboard/:path*` in the middleware matcher
- **NEVER** rely solely on page-level auth checks for protected routes
- **ALWAYS** redirect unauthenticated users to `/login`
- **ALWAYS** configure the middleware matcher to target only protected routes (not static assets)

---

## Summary

| Rule | Description |
|------|-------------|
| Route prefix | All app routes under `/dashboard` |
| Protection method | Next.js middleware |
| Auth redirect | Unauthenticated users → `/login` |
| New features | Always nest under `/dashboard/[feature]` |
