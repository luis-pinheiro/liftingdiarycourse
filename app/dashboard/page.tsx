import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { parse } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { getWorkoutsByUserAndDate } from "@/data/workouts";

type DashboardPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const dateParam = params.date;
  const selectedDate = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : new Date();

  const workouts = await getWorkoutsByUserAndDate(userId, selectedDate);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <aside className="w-full md:w-auto">
          <DatePicker selectedDate={selectedDate} />
        </aside>

        <section>
          <h2 className="text-xl font-semibold mb-4">Workouts</h2>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No workouts logged for this date.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {workout.name || "Workout"}
                    </CardTitle>
                    <CardDescription>
                      {workout.exercises.length} exercise
                      {workout.exercises.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <li key={exercise.id} className="text-sm">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-muted-foreground ml-2">
                            {exercise.sets.length} set
                            {exercise.sets.length !== 1 ? "s" : ""}
                            {exercise.sets.length > 0 && (
                              <>
                                {" "}
                                - {exercise.sets.map((s) => `${s.reps}×${s.weight}kg`).join(", ")}
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
