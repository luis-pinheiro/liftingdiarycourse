"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { updateWorkout } from "./actions";

import { differenceInMinutes } from "date-fns";

type EditWorkoutFormProps = {
    workout: {
        id: number;
        name: string | null;
        startedAt: Date;
        completedAt: Date | null;
    };
};

export function EditWorkoutForm({ workout }: EditWorkoutFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(workout.startedAt));
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialDuration = workout.completedAt
        ? differenceInMinutes(new Date(workout.completedAt), new Date(workout.startedAt))
        : "";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const result = await updateWorkout({
            workoutId: workout.id,
            name: formData.get("name") as string,
            startedAt: selectedDate,
            duration: Number(formData.get("duration")) || undefined,
        });

        if (result?.error) {
            setError(
                typeof result.error === "string"
                    ? result.error
                    : "Failed to update workout"
            );
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Workout</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workout Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Upper Body, Leg Day"
                            defaultValue={workout.name || ""}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            placeholder="Total time in minutes"
                            defaultValue={initialDuration}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(selectedDate, "do MMM yyyy")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Workout"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
