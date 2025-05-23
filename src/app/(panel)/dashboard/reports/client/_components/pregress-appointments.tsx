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
import { RadialProgress } from "@/components/radial-progress";

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-sm inline-flex justify-between font-montserrat">
                  Total de<br />
                  Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-5xl font-montserrat">{countAllAppointments}</span>
                <Activity className="w-8 h-8" />
              </CardContent>
            </Card>
            <CardMetricsStatus
              title={"Completo"}
              countValue={metricStatus?.countByStatus.countCompleted || 0}
              percentage={metricStatus?.percentageByStatus.countCompleted || "0%"}
              width={metricStatus?.countByStatus.countCompleted || 0}
              max={countAllAppointments}
              color="bg-green-500"
              colorRadial="oklch(72.3% 0.219 149.579)"
            />
            <CardMetricsStatus
              title={"Não comparecido"}
              countValue={metricStatus?.countByStatus.countNo_show || 0}
              percentage={metricStatus?.percentageByStatus.countNo_show || "0%"}
              width={metricStatus?.countByStatus.countNo_show || 0}
              max={countAllAppointments}
              color="bg-orange-500"
              colorRadial="oklch(70.5% 0.213 47.604)"
            />
            <CardMetricsStatus
              title={"Cancelado"}
              countValue={metricStatus?.countByStatus.countCancelled || 0}
              percentage={metricStatus?.percentageByStatus.countCancelled || "0"}
              width={metricStatus?.countByStatus.countCancelled || 0}
              max={countAllAppointments}
              color="bg-red-500"
              colorRadial="oklch(63.7% 0.237 25.331)"
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
  colorRadial: string,
}

function CardMetricsStatus({ title, countValue, percentage, width, max, color, colorRadial }: CardMetricsStatusProps) {
  return (
    <Card className="text-sm text-primary relative">
      <CardHeader>
        <div className={`absolute top-0 left-0 ${color} w-2 h-full rounded-l-lg`}></div>
        <CardTitle>
          {title}
          <p className="font-montserrat">Total: <span className="text-2xl">{countValue}</span></p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <RadialProgress
          progress={Number(percentage.replace("%", ""))}
          color={colorRadial}
        />
      </CardContent>
    </Card>
  )
}