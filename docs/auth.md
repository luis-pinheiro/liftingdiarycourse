# Authentication Coding Standards

## Authentication Provider

**Use Clerk for all authentication.** No other authentication solutions are permitted in this project.

- All auth functionality must use `@clerk/nextjs`
- Do not implement custom authentication logic
- Do not use NextAuth, Auth.js, or other auth libraries

## Setup

### ClerkProvider

The app must be wrapped with `ClerkProvider` in the root layout:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware

Use `clerkMiddleware()` from `@clerk/nextjs/server` in `middleware.ts`:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

## UI Components

**Use Clerk's pre-built components for auth UI.** Do not create custom sign-in/sign-up forms.

### Available Components

| Component | Usage |
|-----------|-------|
| `<SignInButton>` | Trigger sign-in flow |
| `<SignUpButton>` | Trigger sign-up flow |
| `<SignedIn>` | Render children only when signed in |
| `<SignedOut>` | Render children only when signed out |
| `<UserButton>` | User profile dropdown with sign-out |

### Example Usage

```typescript
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

// In a header component
<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

## Server-Side Authentication

### Getting User ID in Server Components

Use `auth()` from `@clerk/nextjs/server` to get the current user:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // userId is now available for database queries
}
```

### Protected Route Pattern

Always check for `userId` at the top of protected server components and redirect if not authenticated:

```typescript
const { userId } = await auth();

if (!userId) {
  redirect("/sign-in");
}
```

## Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Get these keys from the [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys).
