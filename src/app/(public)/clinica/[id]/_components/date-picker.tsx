"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  minDate?: Date
  className?: string
  initialDate?: Date
  onChange: (date: Date) => void
}

export function DateTimePicker({
  className,
  minDate,
  initialDate,
  onChange,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate ?? new Date())
  const [open, setOpen] = useState(false)

  function handleChange(newDate: Date | undefined) {
    if (!newDate) return
    setDate(newDate)
    onChange(newDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn("border", !date && "text-muted-foreground", className)}
        >
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha a data</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          initialFocus
          locale={ptBR}
          fromDate={minDate ?? new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
