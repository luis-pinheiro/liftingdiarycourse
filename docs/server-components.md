# Server Components Coding Standards

This document outlines the coding standards and best practices for Next.js Server Components in this project.

## 🚨 Critical: Params Must Be Awaited

In Next.js 15+, route parameters (`params`) are returned as **Promises** and **MUST** be awaited before use.

### ❌ Incorrect Usage

```typescript
// DO NOT DO THIS - Will cause runtime errors
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id; // ERROR: params is a Promise
  return <div>{id}</div>;
}
```

### ✅ Correct Usage

```typescript
// ALWAYS await params
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

## Server Component Best Practices

### 1. Type Definitions for Params

Always properly type your params as a Promise:

```typescript
type PageProps = {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id, slug } = await params;
  const search = await searchParams;
  // ... rest of component
}
```

### 2. SearchParams Also Require Awaiting

Just like `params`, `searchParams` is also a Promise in Next.js 15+:

```typescript
export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams;
  // Use query safely
}
```

### 3. generateMetadata Function

When generating metadata, params must also be awaited:

```typescript
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Item ${id}`,
  };
}
```

### 4. generateStaticParams

For static site generation, ensure proper typing:

```typescript
export async function generateStaticParams() {
  // Fetch your data
  const items = await fetchItems();
  
  return items.map((item) => ({
    id: item.id.toString(),
  }));
}
```

## Common Patterns

### Fetching Data Based on Params

```typescript
export default async function WorkoutPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  // Fetch data using the awaited param
  const workout = await fetchWorkout(id);
  
  return (
    <div>
      <h1>{workout.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### Multiple Dynamic Segments

```typescript
export default async function Page({
  params
}: {
  params: Promise<{ userId: string; workoutId: string }>
}) {
  const { userId, workoutId } = await params;
  
  // Use both params
  const data = await fetchUserWorkout(userId, workoutId);
  
  return <div>{/* ... */}</div>;
}
```

## Migration Checklist

If migrating from Next.js 14 or earlier:

- [ ] Update all `params` type definitions to `Promise<...>`
- [ ] Add `await` before accessing `params` properties
- [ ] Update all `searchParams` type definitions to `Promise<...>`
- [ ] Add `await` before accessing `searchParams` properties
- [ ] Update `generateMetadata` functions to await params
- [ ] Ensure all page components are `async` functions
- [ ] Test all dynamic routes thoroughly

## Why This Change?

This change was introduced in Next.js 15 to better support:
- Partial Prerendering (PPR)
- Async Request APIs
- More predictable server component behavior
- Better streaming and suspense integration

## Additional Resources

- [Next.js Server Components Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
