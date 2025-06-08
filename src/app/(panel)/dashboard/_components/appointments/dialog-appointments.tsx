import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentWithService } from "../../reports/types/allApponitments";
import DownloadPDFRecordAppointment from "@/components/generatePDF/download-pdf-record-appointment";

interface DialogAppointmentsProps {
  appointment: AppointmentWithService | null;
  permission: string;
}

export function DialogAppointments({ appointment, permission }: DialogAppointmentsProps) {
  if (!appointment) {
    return (
      <DialogContent className="bg-white">
        <VisuallyHidden>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <DialogDescription className="text-center">
            Nenhum agendamento selecionado
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const formatBirthDate = (date: Date | string) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <DialogContent className="bg-white max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-center">
          Detalhes do agendamento
        </DialogTitle>
        <DialogDescription className="text-center">
          Informações completas do agendamento de {appointment.name}
        </DialogDescription>
        {!["BASIC", "EXPIRED"].includes(permission) && (
          <div className="flex justify-between" role="toolbar" aria-label="Ações do agendamento">
            <DownloadPDFRecordAppointment data={appointment} />
          </div>
        )}
      </DialogHeader>

      <ScrollArea
        className="max-h-125"
        aria-label="Detalhes do agendamento"
      >
        <div className="py-4">
          <article aria-labelledby="patient-info-heading">
            {/* Informações do Agendamento */}
            <section aria-labelledby="appointment-info-heading" className="mb-6">
              <h3 id="appointment-info-heading" className="text-lg font-semibold mb-3 sr-only">
                Informações do Agendamento
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold inline">Horário agendado:</dt>
                  <dd className="inline ml-1" aria-label={`Horário ${appointment.time}`}>
                    {appointment.time}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Data do agendamento:</dt>
                  <dd className="inline ml-1">
                    <time dateTime={appointment.appointmentDate.toString()}>
                      {formatDate(appointment.appointmentDate)}
                    </time>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Informações Pessoais */}
            <section aria-labelledby="personal-info-heading" className="mb-6">
              <h3 id="personal-info-heading" className="text-lg font-semibold mb-3 sr-only">
                Informações Pessoais
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold inline">Nome:</dt>
                  <dd className="inline ml-1 capitalize">{appointment.name.toLowerCase()}</dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Telefone:</dt>
                  <dd className="inline ml-1" aria-label={`Número de telefone ${appointment.phone}`}>
                    {appointment.phone}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Email:</dt>
                  <dd className="inline ml-1">
                    <a
                      href={`mailto:${appointment.email}`}
                      className="text-blue-600 hover:underline focus:underline focus:outline-2 focus:outline-blue-600"
                      aria-label={`Enviar email para ${appointment.email}`}
                    >
                      {appointment.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Idade:</dt>
                  <dd className="inline ml-1">
                    {appointment.age || <span className="text-gray-500">Não informado</span>}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Data de nascimento:</dt>
                  <dd className="inline ml-1">
                    {appointment.dateOfBirth ? (
                      <time dateTime={appointment.dateOfBirth.toString()}>
                        {formatBirthDate(appointment.dateOfBirth)}
                      </time>
                    ) : (
                      <span className="text-gray-500">Não informado</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Informações Médicas */}
            <section aria-labelledby="medical-info-heading" className="mb-6">
              <h3 id="medical-info-heading" className="text-lg font-semibold mb-3 sr-only">
                Informações Médicas
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold inline">Sintomas:</dt>
                  <dd className="inline ml-1">
                    {appointment.symptoms || <span className="text-gray-500">Não informado</span>}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Sintomas secundários:</dt>
                  <dd className="inline ml-1">
                    {appointment.secondary || <span className="text-gray-500">Não informado</span>}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Histórico dessas queixas:</dt>
                  <dd className="inline ml-1">
                    {appointment.complaints || <span className="text-gray-500">Não informado</span>}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Faz uso de alguma medicação:</dt>
                  <dd className="inline ml-1">
                    {appointment.useOfAnyMedication || "Não"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Está ou pode estar grávida:</dt>
                  <dd className="inline ml-1">
                    {appointment.bePregnant || "Não"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Faz atividades físicas:</dt>
                  <dd className="inline ml-1">
                    {appointment.eatingRoutine || "Não"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold inline">Como é sua rotina alimentar:</dt>
                  <dd className="inline ml-1">
                    {appointment.physicalActivities || <span className="text-gray-500">Não informado</span>}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Informações do Serviço */}
            <section
              aria-labelledby="service-info-heading"
              className="border border-corprimary/50 mt-4 p-4 rounded-md bg-gray-50"
            >
              <h3 id="service-info-heading" className="text-lg font-semibold mb-3">
                Informações do Serviço
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="font-bold inline">Serviço:</dt>
                  <dd className="inline ml-1">{appointment.service.name}</dd>
                </div>
                <div>
                  <dt className="font-bold inline">Valor:</dt>
                  <dd className="inline ml-1" aria-label={`Valor do serviço: ${formatCurrency(appointment.service.price.toString())}`}>
                    {formatCurrency(appointment.service.price.toString())}
                  </dd>
                </div>
              </dl>
            </section>
          </article>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}