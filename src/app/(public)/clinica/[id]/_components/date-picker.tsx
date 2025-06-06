"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Calendar1 } from "lucide-react"

interface DateTimePickerProps {
  minDate?: Date
  className?: string
  initialDate?: Date
  onChange: (date: Date) => void;
  activeYear?: boolean;
}

export function DateTimePicker({
  className,
  minDate,
  initialDate,
  onChange,
  activeYear = false
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate ?? new Date());
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(date?.getFullYear());

  function handleChange(newDate: Date | undefined) {
    if (!newDate) return;

    // Se há um ano selecionado, preserve-o
    if (selectedYear && selectedYear !== newDate.getFullYear()) {
      const dateWithSelectedYear = new Date(selectedYear, newDate.getMonth(), newDate.getDate());
      setDate(dateWithSelectedYear);
      onChange(dateWithSelectedYear);
    } else {
      setDate(newDate);
      onChange(newDate);
    }
    setOpen(false);
  }

  const handleYearChange = (y: string) => {
    const newYear = parseInt(y);
    setSelectedYear(newYear);

    // Preserve o mês e dia atuais se existirem, senão use valores padrão
    const currentMonth = date?.getMonth() ?? 0;
    const currentDay = date?.getDate() ?? 1;

    const newDate = new Date(newYear, currentMonth, currentDay);
    setDate(newDate);
    onChange(newDate);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn("border flex justify-around", !date && "text-muted-foreground", className)}
        >
          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha a data</span>}
          <Calendar1 />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {activeYear && (
          <div className="p-2">
            <Select onValueChange={handleYearChange} value={selectedYear?.toString()}>
              <SelectTrigger className="w-fit">Ano: {selectedYear}</SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {Array.from({ length: 125 }, (_, i) => {
                  const y = 2025 - i;
                  return (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          initialFocus
          locale={ptBR}
          fromDate={minDate ?? new Date()}
          // Força o calendário a mostrar o ano selecionado
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}