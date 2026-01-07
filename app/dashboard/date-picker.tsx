"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type DatePickerProps = {
  selectedDate: Date;
};

export function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(newDate, "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="p-3 w-full"
        classNames={{
          months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
        }}
      />
    </div>
  );
}
