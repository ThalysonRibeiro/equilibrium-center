"use client"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MetricStatusProps } from "../../types/allApponitments";

interface ProgressAppointmentsProps {
  metricStatus: MetricStatusProps | null;
  countAllAppointments: number | 0;
  loading: boolean;
}

export function ProgressAppointments({ metricStatus, countAllAppointments, loading }: ProgressAppointmentsProps) {
  return (
    <>
      {loading ? (
        <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <article>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="text-sm lg:text-base text-primary">
              <CardHeader>
                <CardTitle className="inline-flex justify-between font-montserrat">
                  Total de Agendamentos <Activity />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-5xl font-montserrat">{countAllAppointments}</span>
              </CardContent>
            </Card>
            <CardMetricsStatus
              title={"Pendente"}
              countValue={metricStatus?.countByStatus.countPending || 0}
              percentage={metricStatus?.percentageByStatus.countPending || "0%"}
              width={metricStatus?.countByStatus.countPending || 0}
              max={countAllAppointments}
              color="bg-yellow-500"
            />
            <CardMetricsStatus
              title={"Confirmado"}
              countValue={metricStatus?.countByStatus.countScheduled || 0}
              percentage={metricStatus?.percentageByStatus.countScheduled || "0%"}
              width={metricStatus?.countByStatus.countScheduled || 0}
              max={countAllAppointments}
              color="bg-blue-500"
            />
            <CardMetricsStatus
              title={"Completo"}
              countValue={metricStatus?.countByStatus.countCompleted || 0}
              percentage={metricStatus?.percentageByStatus.countCompleted || "0%"}
              width={metricStatus?.countByStatus.countCompleted || 0}
              max={countAllAppointments}
              color="bg-green-500"
            />
            <CardMetricsStatus
              title={"Não comparecido"}
              countValue={metricStatus?.countByStatus.countNo_show || 0}
              percentage={metricStatus?.percentageByStatus.countNo_show || "0%"}
              width={metricStatus?.countByStatus.countNo_show || 0}
              max={countAllAppointments}
              color="bg-orange-500"
            />
            <CardMetricsStatus
              title={"Cancelado"}
              countValue={metricStatus?.countByStatus.countCancelled || 0}
              percentage={metricStatus?.percentageByStatus.countCancelled || "0%"}
              width={metricStatus?.countByStatus.countCancelled || 0}
              max={countAllAppointments}
              color="bg-red-500"
            />
          </div>
        </article>
      )}
    </>
  )
}

interface CardMetricsStatusProps {
  title: string,
  countValue: number,
  percentage: string;
  width: number,
  max: number,
  color: string,
}

function CardMetricsStatus({ title, countValue, percentage, width, max, color }: CardMetricsStatusProps) {
  return (
    <Card className="text-sm text-primary relative">
      <CardHeader>
        <div className={`absolute top-0 right-0 ${color} w-full h-2 rounded-t-lg`}></div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-montserrat">Total: <span className="text-2xl">{countValue}</span></p>
        <p className="font-montserrat">Margem: <span className="text-2xl">{percentage}</span></p>
      </CardContent>
      <CardFooter>
        <Progress
          width={width}
          max={max}
          color={color}
        />
      </CardFooter>
    </Card>
  )
}