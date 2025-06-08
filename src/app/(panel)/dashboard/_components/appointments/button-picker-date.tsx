"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

export function ButtonPickerAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function handleSelect(date: Date | undefined) {
    if (!date) return

    setSelectedDate(date)
    setIsOpen(false) // Fecha o popover após seleção

    const formatted = format(date, "yyyy-MM-dd")
    const url = new URL(window.location.href)
    url.searchParams.set("date", formatted)
    router.push(url.toString())
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    // Permite abrir com Enter ou Espaço
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsOpen(!isOpen)
    }
    // Fecha com Escape
    if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  const formattedDate = format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
  const longFormattedDate = format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal px-3 py-2"
          aria-label={`Selecionar data. Data atual: ${longFormattedDate}`}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          onKeyDown={handleKeyDown}
          role="button"
        >
          <CalendarIcon
            className="mr-2 h-4 w-4"
            aria-hidden="true"
          />
          <span aria-live="polite">
            {formattedDate}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="end"
        role="dialog"
        aria-label="Seletor de data"
      >
        <div className="p-3">
          <h2 className="text-sm font-medium mb-2" id="calendar-heading">
            Selecione uma data
          </h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            locale={ptBR}
            className="rounded-md"
            // Props de acessibilidade do calendário
            modifiers={{
              selected: selectedDate,
              today: new Date(),
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }
            }}
            // Navegação por teclado corrigida
            onDayKeyDown={(day: Date, modifiers: any, event: React.KeyboardEvent) => {
              if (event.key === "Escape") {
                setIsOpen(false)
              }
            }}
          />
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground" role="status">
              Use as setas para navegar e Enter para selecionar
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}