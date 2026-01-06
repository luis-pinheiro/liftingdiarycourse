# Data Mutations Guidelines

## Critical Rules

### 1. Server Actions Only

**All data mutations MUST be done via server actions.**

Server actions must be:
- Colocated with the page/component that uses them
- Defined in a file named `actions.ts`
- Marked with `'use server'` directive

```
app/
  ├── workouts/
  │   ├── page.tsx         # Server component
  │   ├── actions.ts       # Colocated server actions
  │   └── ...
  ├── exercises/
  │   ├── page.tsx
  │   ├── actions.ts
  │   └── ...
```

### 2. Database Mutation Helper Functions

All database mutations MUST be done via helper functions located in the `/data` directory.

```
/data
  ├── workouts.ts      # Workout queries AND mutations
  ├── exercises.ts     # Exercise queries AND mutations
  └── ...              # Other domain-specific files
```

### 3. Drizzle ORM Required

**DO NOT USE RAW SQL.**

All database mutations must use Drizzle ORM. This ensures:
- Type safety
- SQL injection protection
- Consistent mutation patterns

```typescript
// CORRECT - Using Drizzle ORM
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createWorkout(userId: string, data: NewWorkout) {
  return await db.insert(workouts).values({
    userId,
    ...data,
  }).returning();
}

// WRONG - Raw SQL
// db.execute('INSERT INTO workouts ...', [...values])
```

### 4. Typed Parameters (NO FormData)

**Server action parameters MUST be typed. Do NOT use FormData.**

```typescript
// CORRECT - Typed parameters
export async function createWorkout(name: string, date: Date) {
  // ...
}

// CORRECT - Object parameter with type
type CreateWorkoutInput = {
  name: string;
  date: Date;
};

export async function createWorkout(input: CreateWorkoutInput) {
  // ...
}

// WRONG - FormData
export async function createWorkout(formData: FormData) {
  const name = formData.get('name');  // NO!
}
```

### 5. Zod Validation Required

**All server actions MUST validate their arguments using Zod.**

Every server action must:
1. Define a Zod schema for its input
2. Parse/validate the input before processing
3. Return appropriate errors for invalid input

```typescript
// CORRECT - Zod validation
import { z } from 'zod';

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.coerce.date(),
});

export async function createWorkout(input: z.infer<typeof createWorkoutSchema>) {
  const validated = createWorkoutSchema.safeParse(input);

  if (!validated.success) {
    return { error: validated.error.flatten() };
  }

  // Proceed with validated.data
}

// WRONG - No validation
export async function createWorkout(input: { name: string; date: Date }) {
  // Directly using input without validation - NO!
}
```

### 6. User Data Isolation (CRITICAL)

**A logged-in user can ONLY mutate their own data.**

Every mutation function MUST:
1. Verify the user is authenticated
2. Verify the user owns the resource being mutated
3. Include userId in all INSERT operations
4. Filter by userId in all UPDATE/DELETE operations

```typescript
// CORRECT - Always verify ownership
export async function deleteWorkout(userId: string, workoutId: string) {
  return await db
    .delete(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)  // Always include user filter!
      )
    );
}

// WRONG - No user filtering (security vulnerability!)
export async function deleteWorkout(workoutId: string) {
  return await db.delete(workouts).where(eq(workouts.id, workoutId));
}
```

### 7. No Redirects in Server Actions

**DO NOT use `redirect()` inside server actions.**

Redirects must be handled client-side after the server action resolves. This ensures:
- Proper error handling before navigation
- Better user experience with loading states
- Predictable action return values

```typescript
// WRONG - redirect() in server action
import { redirect } from 'next/navigation';

export async function createWorkout(input: CreateWorkoutInput) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');  // NO!
  }

  const workout = await createWorkoutDb(userId, input);
  redirect(`/workouts/${workout.id}`);  // NO!
}

// CORRECT - Return data, redirect client-side
export async function createWorkout(input: CreateWorkoutInput) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const workout = await createWorkoutDb(userId, input);
  return { data: workout };
}

// Client component handles redirect
'use client';
import { useRouter } from 'next/navigation';

function CreateWorkoutForm() {
  const router = useRouter();

  async function handleSubmit(data: CreateWorkoutInput) {
    const result = await createWorkout(data);

    if (result.error) {
      // Handle error
      return;
    }

    // Redirect client-side after success
    router.push(`/workouts/${result.data.id}`);
  }
}
```

## Complete Example Pattern

### Data Layer (`/data/workouts.ts`)

```typescript
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export type NewWorkout = {
  name: string;
  date: Date;
};

export async function createWorkout(userId: string, data: NewWorkout) {
  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      date: data.date,
    })
    .returning();

  return workout;
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  data: Partial<NewWorkout>
) {
  const [workout] = await db
    .update(workouts)
    .set(data)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    )
    .returning();

  return workout;
}

export async function deleteWorkout(userId: string, workoutId: string) {
  await db
    .delete(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    );
}
```

### Server Actions (`app/workouts/actions.ts`)

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createWorkout as createWorkoutDb,
  updateWorkout as updateWorkoutDb,
  deleteWorkout as deleteWorkoutDb,
} from '@/data/workouts';

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.coerce.date(),
});

export async function createWorkout(input: z.infer<typeof createWorkoutSchema>) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const validated = createWorkoutSchema.safeParse(input);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const workout = await createWorkoutDb(userId, validated.data);

  revalidatePath('/workouts');

  return { data: workout };
}

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Workout name is required').optional(),
  date: z.coerce.date().optional(),
});

export async function updateWorkout(input: z.infer<typeof updateWorkoutSchema>) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const validated = updateWorkoutSchema.safeParse(input);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { id, ...data } = validated.data;
  const workout = await updateWorkoutDb(userId, id, data);

  if (!workout) {
    return { error: 'Workout not found' };
  }

  revalidatePath('/workouts');

  return { data: workout };
}

const deleteWorkoutSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteWorkout(input: z.infer<typeof deleteWorkoutSchema>) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const validated = deleteWorkoutSchema.safeParse(input);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  await deleteWorkoutDb(userId, validated.data.id);

  revalidatePath('/workouts');

  return { success: true };
}
```

### Client Component Usage

```typescript
'use client';

import { createWorkout } from './actions';

export function CreateWorkoutForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Convert FormData to typed object before calling action
    const result = await createWorkout({
      name: formData.get('name') as string,
      date: new Date(formData.get('date') as string),
    });

    if (result.error) {
      // Handle error
      console.error(result.error);
      return;
    }

    // Success - workout created
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Summary Checklist

- [ ] Server action is in a colocated `actions.ts` file
- [ ] Server action has `'use server'` directive
- [ ] Parameters are typed (no FormData)
- [ ] Input is validated with Zod schema
- [ ] Authentication is verified before mutation
- [ ] Database call uses helper function from `/data`
- [ ] Helper function uses Drizzle ORM (no raw SQL)
- [ ] User ownership is verified for UPDATE/DELETE operations
- [ ] UserId is included for INSERT operations
- [ ] Path is revalidated after successful mutation
- [ ] No `redirect()` calls in server actions (handle redirects client-side)
