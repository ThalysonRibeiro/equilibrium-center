import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointment-list";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";


interface DialogAppointmentsProps {
  appointment: AppointmentWithService | null;
}

export function DialogAppointments({ appointment }: DialogAppointmentsProps) {

  return (
    <DialogContent className="border-corprimary">
      <DialogHeader>
        <DialogTitle className="text-center text-corprimary">
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription className="text-center">
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {appointment && (
          <article>
            <p><span className="font-bold text-corprimary">Horario agendado: </span>{appointment.time}</p>
            <p className="mb-2"><span className="font-bold text-corprimary">Data do agendamento: </span>
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appointment.appointmentDate))}</p>
            <p><span className="font-bold text-corprimary">Nome: </span>{appointment.name}</p>
            <p><span className="font-bold text-corprimary">Telefone: </span>{appointment.phone}</p>
            <p><span className="font-bold text-corprimary">Email: </span>{appointment.email}</p>

            <section className="bg-corsecondary border border-corprimary/50 mt-4 p-2 rounded-md">
              <p><span className="font-bold text-corprimary">Serviço: </span>{appointment.service.name}</p>
              <p><span className="font-bold text-corprimary">Valor: </span>{formatCurrency(appointment.service.price.toString())}</p>
            </section>

          </article>
        )}
      </div>
    </DialogContent>
  )
}