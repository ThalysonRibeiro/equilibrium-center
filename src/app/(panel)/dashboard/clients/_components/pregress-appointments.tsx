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
  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingUI />
        </div>
      ) : (
        <article>
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos da data selecionada</CardTitle>
              <CardDescription>
                Métricas de agendamento por data específica
                {days !== null && <> — Consulta equivalente a <span>{days}</span> dias</>}{" — "}
                Total de {countAllAppointments} agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h3>Pendente <span>{metricStatus?.percentageByStatus.countPending}</span> total: {metricStatus?.countByStatus.countPending}</h3>
                <Progress max={100} width={Number(metricStatus?.percentageByStatus.countPending.replace("%", ""))} />
              </div>

              <div>
                <h3>Confirmado <span>{metricStatus?.percentageByStatus.countScheduled}</span> total: {metricStatus?.countByStatus.countScheduled}</h3>
                <Progress max={100} width={Number(metricStatus?.percentageByStatus.countScheduled.replace("%", ""))} />
              </div>

              <div>
                <h3>Completo <span>{metricStatus?.percentageByStatus.countCompleted}</span> total: {metricStatus?.countByStatus.countCompleted}</h3>
                <Progress max={100} width={Number(metricStatus?.percentageByStatus.countCompleted.replace("%", ""))} />
              </div>

              <div>
                <h3>Não comparecido <span>{metricStatus?.percentageByStatus.countNo_show}</span> total: {metricStatus?.countByStatus.countNo_show}</h3>
                <Progress max={100} width={Number(metricStatus?.percentageByStatus.countNo_show.replace("%", ""))} />
              </div>

              <div>
                <h3>Cancelado <span>{metricStatus?.percentageByStatus.countCancelled}</span> total: {metricStatus?.countByStatus.countCancelled}</h3>
                <Progress max={100} width={Number(metricStatus?.percentageByStatus.countCancelled.replace("%", ""))} />
              </div>
            </CardContent>
          </Card>
        </article>
      )}
    </>
  )
}


