import { db } from "@/app/src/db";
import { workouts, workoutExercises, exercises, sets } from "@/app/src/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export type NewWorkout = {
  name: string | null;
  startedAt: Date;
  completedAt?: Date | null;
};

export async function createWorkout(userId: string, data: NewWorkout) {
  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: data.name,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    })
    .returning();

  return workout;
}

export type UpdateWorkout = {
  name: string | null;
  startedAt: Date;
  completedAt?: Date | null;
};

export async function getWorkoutById(userId: string, workoutId: number) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    );

  return workout || null;
}

export async function updateWorkout(userId: string, workoutId: number, data: UpdateWorkout) {
  const [workout] = await db
    .update(workouts)
    .set({
      name: data.name,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
    })
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    )
    .returning();

  return workout;
}

export type WorkoutWithExercises = {
  id: number;
  name: string | null;
  startedAt: Date;
  exercises: {
    id: number;
    name: string;
    sets: {
      setNumber: number;
      reps: number;
      weight: string;
    }[];
  }[];
};

export async function getWorkoutsByUserAndDate(
  userId: string,
  date: Date
): Promise<WorkoutWithExercises[]> {
  // Get start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch workouts for the user on the specified date
  const userWorkouts = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lt(workouts.startedAt, endOfDay)
      )
    );

  // For each workout, fetch exercises and sets
  const workoutsWithExercises: WorkoutWithExercises[] = await Promise.all(
    userWorkouts.map(async (workout) => {
      const workoutExerciseRows = await db
        .select({
          workoutExerciseId: workoutExercises.id,
          exerciseId: exercises.id,
          exerciseName: exercises.name,
          order: workoutExercises.order,
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.order);

      const exercisesWithSets = await Promise.all(
        workoutExerciseRows.map(async (we) => {
          const exerciseSets = await db
            .select({
              setNumber: sets.setNumber,
              reps: sets.reps,
              weight: sets.weight,
            })
            .from(sets)
            .where(eq(sets.workoutExerciseId, we.workoutExerciseId))
            .orderBy(sets.setNumber);

          return {
            id: we.exerciseId,
            name: we.exerciseName,
            sets: exerciseSets,
          };
        })
      );

      return {
        id: workout.id,
        name: workout.name,
        startedAt: workout.startedAt,
        exercises: exercisesWithSets,
      };
    })
  );

  return workoutsWithExercises;
}
