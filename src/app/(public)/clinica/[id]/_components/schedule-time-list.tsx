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
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelecTime: (time: string) => void;
}

export function ScheduleTimeList({
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedDate,
  selectedTime,
  onSelecTime
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate);
  const selectedDateFormatted = selectedDate.toLocaleDateString('pt-BR');

  // Função para gerar descrição de acessibilidade
  const getSlotAriaLabel = (slot: TimeSlot, slotEnabled: boolean, isSelected: boolean) => {
    const baseLabel = `Horário ${slot.time}`;

    if (isSelected) {
      return `${baseLabel}, selecionado`;
    }

    if (!slotEnabled) {
      const sequenceOK = isSlotSequenceAvailable(
        slot.time,
        requiredSlots,
        clinicTimes,
        blockedTimes,
      );
      const slotIsPast = dateIsToday && isSlotInThePast(slot.time);

      if (!slot.available) {
        return `${baseLabel}, indisponível - já ocupado`;
      }
      if (!sequenceOK) {
        return `${baseLabel}, indisponível - não há tempo suficiente consecutivo`;
      }
      if (slotIsPast) {
        return `${baseLabel}, indisponível - horário já passou`;
      }
    }

    return `${baseLabel}, disponível para agendamento`;
  };

  // Função para gerar descrição do status
  const getSlotStatus = (slot: TimeSlot, slotEnabled: boolean) => {
    if (!slotEnabled) {
      const sequenceOK = isSlotSequenceAvailable(
        slot.time,
        requiredSlots,
        clinicTimes,
        blockedTimes,
      );
      const slotIsPast = dateIsToday && isSlotInThePast(slot.time);

      if (!slot.available) return "Ocupado";
      if (!sequenceOK) return "Tempo insuficiente";
      if (slotIsPast) return "Horário passou";
    }
    return "Disponível";
  };

  return (
    <div
      className="space-y-3"
      role="group"
      aria-labelledby="time-slots-heading"
    >
      <div id="time-slots-heading" className="sr-only">
        Selecione um horário disponível para {selectedDateFormatted}
      </div>

      {/* Legenda dos status */}
      <div className="text-xs text-gray-600 space-y-1" aria-label="Legenda dos horários">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border border-gray-300 rounded" aria-hidden="true"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded" aria-hidden="true"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-500 rounded" aria-hidden="true"></div>
          <span>Indisponível</span>
        </div>
      </div>

      {/* Grade de horários */}
      <div
        className="grid grid-cols-4 md:grid-cols-5 gap-2"
        role="radiogroup"
        aria-label={`Horários disponíveis para ${selectedDateFormatted}`}
        aria-describedby="time-slots-instructions"
      >
        {availableTimeSlots.map((slot, index) => {
          const sequenceOK = isSlotSequenceAvailable(
            slot.time,
            requiredSlots,
            clinicTimes,
            blockedTimes,
          );
          const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
          const slotEnabled = slot.available && sequenceOK && !slotIsPast;
          const isSelected = selectedTime === slot.time;
          const slotStatus = getSlotStatus(slot, slotEnabled);

          return (
            <Button
              key={slot.time}
              onClick={() => slotEnabled && onSelecTime(slot.time)}
              type="button"
              variant="outline"
              role="radio"
              aria-checked={isSelected}
              aria-label={getSlotAriaLabel(slot, slotEnabled, isSelected)}
              aria-describedby={`slot-${index}-status`}
              className={cn(
                "h-10 select-none bg-white relative focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                isSelected && "border-2 bg-primary text-white focus:ring-white",
                !slotEnabled && "opacity-50 cursor-not-allowed border-red-500 bg-red-100"
              )}
              disabled={!slotEnabled}
              tabIndex={slotEnabled ? 0 : -1}
            >
              <span aria-hidden="true">{slot.time}</span>

              {/* Status oculto para leitores de tela */}
              <span
                id={`slot-${index}-status`}
                className="sr-only"
              >
                {slotStatus}
              </span>

              {/* Indicador visual para selecionado */}
              {isSelected && (
                <span className="sr-only">Selecionado</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Instruções ocultas */}
      <div id="time-slots-instructions" className="sr-only">
        Use as setas do teclado para navegar entre os horários disponíveis.
        Pressione Enter ou Espaço para selecionar um horário.
        {requiredSlots > 1 && ` Este serviço requer ${requiredSlots} slots consecutivos.`}
      </div>

      {/* Feedback do horário selecionado */}
      {selectedTime && (
        <div
          className="text-sm text-green-600 font-medium"
          role="status"
          aria-live="polite"
          aria-label={`Horário selecionado: ${selectedTime}`}
        >
          ✓ Horário selecionado: {selectedTime}
        </div>
      )}

      {/* Informações adicionais */}
      {requiredSlots > 1 && (
        <div className="text-xs text-gray-500" role="note">
          Este serviço requer {requiredSlots} períodos consecutivos de 30 minutos.
        </div>
      )}
    </div>
  );
}