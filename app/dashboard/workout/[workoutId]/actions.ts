'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { updateWorkout as updateWorkoutDb } from '@/data/workouts';

const updateWorkoutSchema = z.object({
    workoutId: z.number(),
    name: z.string().min(1, 'Workout name is required'),
    startedAt: z.coerce.date(),
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

    const workout = await updateWorkoutDb(userId, validated.data.workoutId, {
        name: validated.data.name,
        startedAt: validated.data.startedAt,
    });

    redirect(`/dashboard/workout/${workout.id}`);
}
