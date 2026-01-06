# User Rules

This file contains project-specific coding standards and rules that must be followed.

## Next.js Server Components

### Critical: Params and SearchParams Must Be Awaited

In Next.js 15+, route parameters are Promises and **MUST** be awaited:

- **ALWAYS** await `params` before accessing properties
- **ALWAYS** await `searchParams` before accessing properties
- **ALWAYS** type `params` as `Promise<{ ... }>`
- **ALWAYS** type `searchParams` as `Promise<{ ... }>`
- **ALWAYS** make page components with params `async` functions
- **ALWAYS** await params in `generateMetadata` functions

**Example:**
```typescript
// CORRECT
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  // ... use id
}

// INCORRECT - DO NOT DO THIS
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id; // ERROR
}
```

For complete server component coding standards, see `docs/server-components.md`.

## Routing

All routes must be under `/dashboard` and protected via Next.js middleware:

- **ALWAYS** prefix application routes with `/dashboard`
- **ALWAYS** protect `/dashboard` routes using middleware (`middleware.ts`)
- **NEVER** rely on client-side guards for route protection
- Unauthenticated users must be redirected to `/login`

For complete routing standards, see `docs/routing.md`.

## General Guidelines

- Follow all coding standards defined in the `docs/` folder
- Maintain consistent code style throughout the project
- Write clear, self-documenting code with appropriate comments

## Documentation Sync

- **ALWAYS** update this `user_rules.md` file when adding new documentation to `docs/`
- Reference the new documentation file with a brief summary of its key rules
- This ensures guidelines stay visible and discoverable by the AI assistant
