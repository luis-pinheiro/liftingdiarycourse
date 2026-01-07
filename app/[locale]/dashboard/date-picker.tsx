"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

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
          months: "flex w-full flex-col  space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full h-full border-collapse space-y-1",
          head_row: "",
          row: "w-full mt-2",
          month_caption: "hidden",
        }}
        components={{
          Nav: ({ onPreviousClick, onNextClick, previousMonth, nextMonth }) => (
            <nav className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPreviousClick}
                disabled={!previousMonth}
                aria-label="Go to the Previous Month"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <span className="text-sm font-medium select-none">
                {format(selectedDate, "MMMM yyyy")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNextClick}
                disabled={!nextMonth}
                aria-label="Go to the Next Month"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </nav>
          ),
        }}
      />
    </div>
  );
}
