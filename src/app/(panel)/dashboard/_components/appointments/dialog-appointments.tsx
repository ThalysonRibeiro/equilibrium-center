import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointment-list";
import { formatCurrency } from "@/utils/formatCurrency";


interface DialogAppointmentsProps {
  appointment: AppointmentWithService | null;
}

export function DialogAppointments({ appointment }: DialogAppointmentsProps) {

  return (
    <DialogContent className="bg-white text-primary">
      <DialogHeader>
        <DialogTitle className="text-center">
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription className="text-center">
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {appointment && (
          <article>
            <p><span className="font-semibold">Horario agendado: </span>{appointment.time}</p>
            <p className="mb-2"><span>Data do agendamento: </span>
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appointment.appointmentDate))}</p>
            <p><span className="font-semibold">Nome: </span>{appointment.name}</p>
            <p><span className="font-semibold">Telefone: </span>{appointment.phone}</p>
            <p><span className="font-semibold">Email: </span>{appointment.email}</p>

            <section className="bg-gray-100 border border-corprimary/50 mt-4 p-2 rounded-md">
              <p><span className="font-bold">Serviço: </span>{appointment.service.name}</p>
              <p><span className="font-bold">Valor: </span>{formatCurrency(appointment.service.price.toString())}</p>
            </section>

          </article>
        )}
      </div>
    </DialogContent>
  )
}