"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WeeklySummaryProps } from "../types/weekly-summary";
import { Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { da } from "date-fns/locale";

interface TopHoursProps {
  data: WeeklySummaryProps;
}

export function TopHours({ data }: TopHoursProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>
          Horários mas agendados
        </CardTitle>
        <CardDescription>
          Ranking dos horários mais agendados
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.hours.length > 0 ? (
          <div className="flex justify-evenly items-center">
            <div className="flex flex-col items-center justify-center p-2">
              <Trophy
                className="text-[#C0C0C0] w-15 h-15"
              />
              <p className="font-bold">{data.hours[1].time}</p>
              <p className="text-xs">Agendamentos: {data.hours[1].count}</p>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <Trophy
                className="text-[#FFD700] w-25 h-25"
              />
              <p className="font-bold">{data.hours[0].time}</p>
              <p className="text-xs">Agendamentos: {data.hours[0].count}</p>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <Trophy
                className="text-[#CD7F32] w-15 h-15"
              />
              <p className="font-bold">{data.hours[2].time}</p>
              <p className="text-xs">Agendamentos: {data.hours[2].count}</p>
            </div>
          </div>
        ) : (
          <p className="text-center">
            Você ainda não tem horários com agendamentos
          </p>
        )}
      </CardContent>

      {data.hours.length > 2 && (
        <CardFooter>
          <div className="w-full grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data.hours.slice(3).map(hour => (
              <div key={hour.time} className="flex flex-col items-center justify-center p-2">
                <Medal />
                <p className="font-bold">{hour.time}</p>
                <p className="text-xs">Agendamentos: {hour.count}</p>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>

  )
}