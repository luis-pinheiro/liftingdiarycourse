'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createWorkout as createWorkoutDb } from '@/data/workouts';

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  startedAt: z.coerce.date(),
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

  const workout = await createWorkoutDb(userId, {
    name: validated.data.name,
    startedAt: validated.data.startedAt,
  });

  redirect(`/dashboard/workout/${workout.id}`);
}
