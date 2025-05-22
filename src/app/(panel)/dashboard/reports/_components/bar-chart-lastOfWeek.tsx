"use client"
import {
  Card,
  CardContent,
  CardDescription, CardFooter, CardHeader,
  CardTitle
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { WeeklySummaryProps } from "../types/weekly-summary";
import { formatShortNumber } from "@/utils/formatCurrency";

interface BarChartLastOfWeekProps {
  data: WeeklySummaryProps;
}


export function BarChartLastOfWeek({ data }: BarChartLastOfWeekProps) {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agendamentos da semana atual</CardTitle>
        <CardDescription>Total de agendamentos da semana: {data?.appointmentsOfWeek}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex w-full h-100 text-primary py-5">

          <div className="opacity-80 flex flex-col justify-between text-center text-[9px] w-7 h-full">
            <p>100%</p>
            <p>75%</p>
            <p>50%</p>
            <p>25%</p>
            <p>0%</p>
          </div>

          <div className="w-full h-full">
            <div className="relative w-full h-full grid grid-cols-7 gap-3">
              {data?.daysOfWeekWithCounts.map(daysOfWeekWithCount => (
                <ProgressBar
                  key={daysOfWeekWithCount.daysOfWeek}
                  daysOfWeek={daysOfWeekWithCount.daysOfWeek}
                  max={data.appointmentsOfWeek}
                  width={daysOfWeekWithCount.count + 2}
                  numberValue={10}
                  count={formatShortNumber(daysOfWeekWithCount.count)}
                />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3 w-full">
              {data.daysOfWeekWithCounts.map(days => (
                <div className="" key={days.daysOfWeek}>
                  <p
                    className="capitalize text-xs text-center"
                  >
                    {days.daysOfWeek.replace("-feira", "")}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </CardContent>
    </Card>

  )
}



interface ProgressProps extends ComponentProps<'div'> {
  width: number;
  max: number;
  numberValue: number;
  daysOfWeek: string;
  count: string;
}

export function ProgressBar({ width, max, numberValue, daysOfWeek, count, className, ...props }: ProgressProps) {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    if (currentWidth !== width) {
      const timeout = setTimeout(() => {
        setCurrentWidth(width);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [width])

  const percent = (currentWidth / max) * 100;

  return (
    <div className={twMerge("relative w-full h-full rotate-180", className)} {...props}>

      <div
        className={`bg-gradient-to-b from-violet-600 via-blue-500 to-cyan-500 rounded-b-md h-full transition-all duration-700 ease-in-out`}
        style={{ height: `${percent}%` }}
      />
      <p className="pr-0.5 text-xs text-center rotate-180">
        {count}
      </p>
    </div>
  );
}
