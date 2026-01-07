import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { format, parse } from "date-fns";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Edit, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { getWorkoutsByUserAndDate } from "@/data/workouts";
import { getTranslations } from "next-intl/server";

type DashboardPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();
  const t = await getTranslations("Dashboard");

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/workout/new">{t("logWorkout")}</Link>
          </Button>
          <SignOutButton>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </SignOutButton>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <aside className="w-full md:w-auto">
          <DatePicker selectedDate={selectedDate} />
        </aside>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t("workoutsTitle")}</h2>

          {workouts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p className="mb-4">{t("noWorkouts")}</p>
                <Button asChild>
                  <Link
                    href={`/dashboard/workout/new?date=${format(
                      selectedDate,
                      "yyyy-MM-dd"
                    )}`}
                  >
                    {t("logWorkout")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/dashboard/workout/${workout.id}`}
                  className="block transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Card className="hover:bg-accent/40 transition-colors">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-lg">
                          {workout.name || "Workout"}
                        </CardTitle>
                      </div>
                      <div
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                        })}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("editWorkout")}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {workout.exercises.map((exercise) => (
                          <li key={exercise.id} className="text-sm">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {t("setCount", { count: exercise.sets.length })}
                              {exercise.sets.length > 0 && (
                                <>
                                  {" "}
                                  -{" "}
                                  {exercise.sets
                                    .map((s) => `${s.reps}×${s.weight}kg`)
                                    .join(", ")}
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
