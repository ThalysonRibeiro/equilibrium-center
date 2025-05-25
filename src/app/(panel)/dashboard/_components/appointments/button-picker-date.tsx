"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function ButtonPickerAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const router = useRouter()

  function handleSelect(date: Date | undefined) {
    if (!date) return

    setSelectedDate(date)

    const formatted = format(date, "yyyy-MM-dd")
    const url = new URL(window.location.href)
    url.searchParams.set("date", formatted)
    router.push(url.toString())
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border px-2 py-1 rounded-md">
          {format(selectedDate, "dd/MM/yyyy")}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
