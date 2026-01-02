# Data Fetching Guidelines

## Critical Rules

### 1. Server Components Only

**All data fetching MUST be done via server components.**

Do NOT fetch data via:
- Route handlers (`app/api/...`)
- Client components (`'use client'`)
- Any other method

Only server components should perform data fetching operations.

### 2. Database Query Helper Functions

All database queries MUST be done via helper functions located in the `/data` directory.

```
/data
  ├── workouts.ts      # Workout-related queries
  ├── exercises.ts     # Exercise-related queries
  └── ...              # Other domain-specific query files
```

### 3. Drizzle ORM Required

**DO NOT USE RAW SQL.**

All database queries must use Drizzle ORM. This ensures:
- Type safety
- SQL injection protection
- Consistent query patterns

```typescript
// CORRECT - Using Drizzle ORM
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getWorkouts(userId: string) {
  return await db.select().from(workouts).where(eq(workouts.userId, userId));
}

// WRONG - Raw SQL
// db.execute('SELECT * FROM workouts WHERE user_id = ?', [userId])
```

### 4. User Data Isolation (CRITICAL)

**A logged-in user can ONLY access their own data.**

Every database query function MUST:
1. Accept the current user's ID as a parameter
2. Filter results to only return data belonging to that user
3. Never expose data from other users

```typescript
// CORRECT - Always filter by userId
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

// WRONG - No user filtering (security vulnerability!)
export async function getAllWorkouts() {
  return await db.select().from(workouts);
}
```

## Example Pattern

```typescript
// /data/workouts.ts
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getWorkoutsByUser(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(userId: string, workoutId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // Always include user filter!
      )
    );
  return result[0] ?? null;
}
```

```typescript
// app/workouts/page.tsx (Server Component)
import { auth } from '@clerk/nextjs/server';
import { getWorkoutsByUser } from '@/data/workouts';

export default async function WorkoutsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const workouts = await getWorkoutsByUser(userId);

  return <WorkoutList workouts={workouts} />;
}
```
