"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"

export function DateRangePicker() {
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  })

  // Função para atualizar a URL
  const updateURLWithDates = React.useCallback((range: DateRange | undefined) => {
    if (!range?.from || !range.to) return

    const startDateString = format(range.from, "yyyy-MM-dd")
    const endDateString = format(range.to, "yyyy-MM-dd")

    const url = new URL(window.location.href)
    url.searchParams.set("start-date", startDateString)
    url.searchParams.set("end-date", endDateString)

    // router.push(url.toString());
    router.replace(url.toString());
  }, [router])

  // Atualiza a URL sempre que o intervalo muda
  React.useEffect(() => {
    updateURLWithDates(date)
  }, [date, updateURLWithDates])


  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"secondary"}
            className="w-[260px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
