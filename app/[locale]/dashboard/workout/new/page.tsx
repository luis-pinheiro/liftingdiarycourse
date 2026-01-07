import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { parse } from "date-fns";
import { NewWorkoutForm } from "./new-workout-form";

type NewWorkoutPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function NewWorkoutPage({
  searchParams,
}: NewWorkoutPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const dateParam = params.date;
  const initialDate = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">New Workout</h1>
      <NewWorkoutForm initialDate={initialDate} />
    </main>
  );
}
