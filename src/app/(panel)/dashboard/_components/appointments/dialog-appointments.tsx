import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointment-list";
import { format } from "date-fns";
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
            <p className="font-lato"><span className="font-montserrat">Horario agendado: </span>{appointment.time}</p>
            <p className="mb-2 font-lato"><span className="font-montserrat">Data do agendamento: </span>
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appointment.appointmentDate))}</p>
            <p className="font-lato"><span className="font-montserrat">Nome: </span>{appointment.name}</p>
            <p className="font-lato"><span className="font-montserrat">Telefone: </span>{appointment.phone}</p>
            <p className="font-lato"><span className="font-montserrat">Email: </span>{appointment.email}</p>

            <section className="bg-gray-100 border border-corprimary/50 mt-4 p-2 rounded-md">
              <p className="font-lato"><span className="font-montserrat">Serviço: </span>{appointment.service.name}</p>
              <p className="font-lato"><span className="font-montserrat">Valor: </span>{formatCurrency(appointment.service.price.toString())}</p>
            </section>

          </article>
        )}
      </div>
    </DialogContent>
  )
}