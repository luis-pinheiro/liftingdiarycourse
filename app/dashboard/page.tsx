"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for UI demonstration
const mockWorkouts = [
  {
    id: "1",
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: 135,
  },
  {
    id: "2",
    name: "Squat",
    sets: 4,
    reps: 6,
    weight: 225,
  },
  {
    id: "3",
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 275,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Workouts</h2>

        {mockWorkouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No workouts logged for this date.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{workout.name}</CardTitle>
                  <CardDescription>
                    {workout.sets} sets × {workout.reps} reps @ {workout.weight}{" "}
                    lbs
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
