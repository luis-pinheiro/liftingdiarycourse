import { redirect, notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

type PageProps = {
    params: Promise<{
        workoutId: string;
    }>;
};

export default async function EditWorkoutPage({ params }: PageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { workoutId } = await params;
    const workoutIdNum = parseInt(workoutId, 10);

    if (isNaN(workoutIdNum)) {
        notFound();
    }

    const workout = await getWorkoutById(userId, workoutIdNum);

    if (!workout) {
        notFound();
    }

    return (
        <main className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Workout</h1>
            <EditWorkoutForm workout={workout} />
        </main>
    );
}
