import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { AppointmentWithService } from "./appointment-list";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentWithService } from "../../reports/types/allApponitments";
import DownloadPDFRecordAppointment from "@/components/generatePDF/download-pdf-record-appointment";


interface DialogAppointmentsProps {
  appointment: AppointmentWithService | null;
  permission: string;
}

export function DialogAppointments({ appointment, permission }: DialogAppointmentsProps) {

  return (
    <DialogContent className="bg-white text-primary">
      <DialogHeader>
        <DialogTitle className="text-center">
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription className="text-center">
          Veja todos os detalhes do agendamento
        </DialogDescription>
        {!["BASIC", "EXPIRED"].includes(permission) && (
          <div className="flex justify-between">
            <DownloadPDFRecordAppointment data={appointment || null} />
          </div>
        )}
      </DialogHeader>


      <ScrollArea className="max-h-125">
        <div className="py-4">
          {appointment && (
            <article>
              <p><span className="font-semibold">Horario agendado: </span>{appointment.time}</p>
              <p className="mb-2"><span className="font-semibold">Data do agendamento: </span>
                {new Intl.DateTimeFormat('pt-BR', {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(appointment.appointmentDate))}</p>
              <p><span className="font-semibold">Nome: </span>{appointment.name}</p>
              <p><span className="font-semibold">Telefone: </span>{appointment.phone}</p>
              <p><span className="font-semibold">Email: </span>{appointment.email}</p>

              <p><span className="font-semibold">Idade: </span>
                {appointment.age ? appointment.age : "Não informado"}
              </p>
              <p><span className="font-semibold">Data de nascimento: </span>
                {appointment.dateOfBirth ? format(new Date(appointment.dateOfBirth), "dd/MM/yyyy") : "Não informado"}
              </p>

              <p><span className="font-semibold">Sintomas: </span>
                {appointment.symptoms ? appointment.symptoms : "Não informado"}
              </p>
              <p><span className="font-semibold">Sintomas secundários: </span>
                {appointment.secondary ? appointment.secondary : "Não informado"}
              </p>
              <p><span className="font-semibold">Histórico dessas queixas: </span>
                {appointment.complaints ? appointment.complaints : "Não informado"}
              </p>

              <p><span className="font-semibold">Faz uso de alguma medicação: </span>
                {appointment.useOfAnyMedication ? appointment.useOfAnyMedication : "Não"}
              </p>
              <p><span className="font-semibold">Está ou pode estar grávida: </span>
                {appointment.bePregnant ? appointment.bePregnant : "Não"}
              </p>
              <p><span className="font-semibold">Faz atividades físicas: </span>
                {appointment.eatingRoutine ? appointment.eatingRoutine : "Não"}
              </p>

              <p><span className="font-semibold">Como é sua rotina alimentar: </span>
                {appointment.physicalActivities ? appointment.physicalActivities : "Não informado"}
              </p>

              <section className="border border-corprimary/50 mt-4 p-2 rounded-md">
                <p><span className="font-bold">Serviço: </span>
                  {appointment.service.name}
                </p>
                <p><span className="font-bold">Valor: </span>
                  {formatCurrency(appointment.service.price.toString())}
                </p>
              </section>

            </article>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}