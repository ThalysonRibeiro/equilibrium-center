"use client"
import {
  Card, CardContent, CardDescription, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { MetricStatusProps } from "../../reports/types/allApponitments";
import { LoadingUI } from "@/components/ui/loading-ui";
import { Progress } from "@/components/ui/progress";

interface ProgressAppointmentsProps {
  metricStatus: MetricStatusProps | null;
  countAllAppointments: number | 0;
  loading: boolean;
  startDate: Date;
  endDate: Date;
}

export function ProgressAppointments({ metricStatus, countAllAppointments, loading, startDate, endDate }: ProgressAppointmentsProps) {
  const start = startDate;
  const end = endDate;
  let days = null;

  if (start && end) {
    const diffTime = new Date(end).getTime() - new Date(start).getTime();
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const statusData = [
    {
      label: "Pendente",
      percentage: metricStatus?.percentageByStatus.countPending || "0%",
      count: metricStatus?.countByStatus.countPending || 0,
      color: "bg-yellow-500"
    },
    {
      label: "Confirmado",
      percentage: metricStatus?.percentageByStatus.countScheduled || "0%",
      count: metricStatus?.countByStatus.countScheduled || 0,
      color: "bg-blue-500"
    },
    {
      label: "Completo",
      percentage: metricStatus?.percentageByStatus.countCompleted || "0%",
      count: metricStatus?.countByStatus.countCompleted || 0,
      color: "bg-green-500"
    },
    {
      label: "Não comparecido",
      percentage: metricStatus?.percentageByStatus.countNo_show || "0%",
      count: metricStatus?.countByStatus.countNo_show || 0,
      color: "bg-orange-500"
    },
    {
      label: "Cancelado",
      percentage: metricStatus?.percentageByStatus.countCancelled || "0%",
      count: metricStatus?.countByStatus.countCancelled || 0,
      color: "bg-red-500"
    }
  ];

  return (
    <>
      {loading ? (
        <div
          className="w-full h-full flex justify-center items-center"
          role="status"
          aria-label="Carregando métricas de agendamentos"
        >
          <LoadingUI />
        </div>
      ) : (
        <section
          role="region"
          aria-labelledby="progress-title"
          aria-describedby="progress-description"
        >
          <Card>
            <CardHeader>
              <CardTitle id="progress-title">
                Agendamentos da data selecionada
              </CardTitle>
              <CardDescription id="progress-description">
                Métricas de agendamento por data específica
                {days !== null && (
                  <span aria-label={`Período de ${days} ${days === 1 ? 'dia' : 'dias'}`}>
                    {" — "}Consulta equivalente a <span>{days}</span> dias
                  </span>
                )}
                <span aria-label={`Total de ${countAllAppointments} agendamentos no período`}>
                  {" — "}Total de {countAllAppointments} agendamentos
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div role="group" aria-label="Distribuição de agendamentos por status">
                {statusData.map((status, index) => {
                  const progressValue = Number(status.percentage.replace("%", ""));

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-sm font-medium"
                          id={`status-${index}-label`}
                        >
                          {status.label}
                        </h3>
                        <div
                          className="text-sm text-muted-foreground"
                          aria-label={`${status.count} agendamentos ${status.label.toLowerCase()}, representando ${status.percentage} do total`}
                        >
                          <span className="font-semibold">{status.percentage}</span>
                          {" — "}
                          <span>total: {status.count}</span>
                        </div>
                      </div>
                      <Progress
                        max={100}
                        width={progressValue}
                        aria-labelledby={`status-${index}-label`}
                        aria-valuenow={progressValue}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={`${progressValue}% - ${status.count} agendamentos ${status.label.toLowerCase()}`}
                        role="progressbar"
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Resumo adicional para leitores de tela */}
              <div className="sr-only" aria-live="polite">
                Resumo das métricas:
                {statusData.map((status, index) => (
                  <span key={index}>
                    {status.label}: {status.count} agendamentos ({status.percentage}){index < statusData.length - 1 ? ', ' : '.'}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  )
}