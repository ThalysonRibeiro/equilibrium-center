import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointment-list";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import DownloadPDFRecordAppointment from "./download-pdf-record-appointment";


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
        <div className="flex justify-between">
          <DownloadPDFRecordAppointment data={appointment || null} />

        </div>
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

            <p><span className="font-semibold">Idade: </span>{appointment.age ? appointment.age : "Não informado"}</p>
            <p><span className="font-semibold">Data de nascimento: </span>{format(appointment.dateOfBirth || "1900-01-00T03:00:00.000Z", "dd/MM/yyyy")}</p>

            <p><span className="font-semibold">Sintomas: </span>{appointment.symptoms ? appointment.symptoms : "Não informado"}</p>
            <p><span className="font-semibold">Sintomas secundários: </span>{appointment.secondary ? appointment.secondary : "Não informado"}</p>
            <p><span className="font-semibold">Histórico dessas queixas: </span>{appointment.complaints ? appointment.complaints : "Não informado"}</p>

            <p><span className="font-semibold">Faz uso de alguma medicação: </span>{appointment.useOfAnyMedication ? appointment.useOfAnyMedication : "Não"}</p>
            <p><span className="font-semibold">Está ou pode estar grávida: </span>{appointment.bePregnant ? appointment.bePregnant : "Não"}</p>
            <p><span className="font-semibold">Faz atividades físicas: </span>{appointment.eatingRoutine ? appointment.eatingRoutine : "Não"}</p>

            <p><span className="font-semibold">Como é sua rotina alimentar: </span>{appointment.physicalActivities ? appointment.physicalActivities : "Não informado"}</p>

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