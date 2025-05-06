"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";
import { isSlotInThePast, isSlotSequenceAvailable, isToday } from "./schedule-utils";

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimesSlots: TimeSlot[];
  clinicTimes: string[];
  onSelecTime: (time: string) => void;
}

export function ScheduleTimeList({
  availableTimesSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedDate,
  selectedTime,
  onSelecTime
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate);

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
      {availableTimesSlots.map(slot => {

        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        );
        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        const slotEnabled = slot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            onClick={() => slotEnabled && onSelecTime(slot.time)}
            type="button"
            variant={"outline"}
            key={slot.time}
            className={cn("h-10 select-none bg-white",
              selectedTime === slot.time && "border-2 border-corsecondary bg-corsecondary text-white",
              !slotEnabled && "opacity-50 cursor-not-allowed border-red-500 bg-red-100"
            )}
            disabled={!slotEnabled}
          >
            {slot.time}
          </Button>
        )
      })}
    </div>
  )
}