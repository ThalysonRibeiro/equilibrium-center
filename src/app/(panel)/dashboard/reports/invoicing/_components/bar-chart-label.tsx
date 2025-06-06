"use client"

import { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MonthlyDataProps } from "../../types/invoicing-date";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency, formatShortNumber } from "@/utils/formatCurrency";
import GeneratePDFForSixMonth from "../../../../../../components/generatePDF/generate-pdf-invoicing-six-month";

interface BarProps {
  chartData: MonthlyDataProps[];
  totalSixMonth: number;
  download_pdf: boolean;
}

export function BarChartLabel({ chartData, totalSixMonth, download_pdf }: BarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex justify-between items-center">
          Faturamento dos últimos 6 meses
          {download_pdf && (
            <GeneratePDFForSixMonth chartData={chartData} totalSixMonth={totalSixMonth} />
          )}
        </CardTitle>
        <CardDescription>
          Dados gerados automaticamente dos últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex w-full h-100 text-primary py-5">

          <div className="w-full h-[90%] opacity-50 pl-7 absolute flex flex-col justify-between">
            <hr />
            <hr />
            <hr />
            <hr />
            <hr />
          </div>
          <div className="opacity-80 flex flex-col justify-between text-center text-[9px] w-7 h-full">
            <p>100%</p>
            <p>75%</p>
            <p>50%</p>
            <p>25%</p>
            <p>0%</p>
          </div>

          <div className="w-full h-full">
            <div className="w-full h-full grid grid-cols-6 gap-3">
              {chartData.map(item => (
                <ProgressBar
                  key={item.month}
                  width={item.total}
                  max={totalSixMonth}
                  numberValue={item.total}
                  month={item.month.slice(0, 3)}
                />
              )
              )}
            </div>
            <div className="grid grid-cols-6 gap-3 w-full">
              {chartData.map(item => (
                <div key={item.month}>
                  <p className="text-center">{item.month.slice(0, 3)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
      <CardFooter>
        <p>
          Receita gerada nos últimos 6 meses: <span className="text-md md:text-2xl font-montserrat font-bold">{formatCurrency(String(totalSixMonth))}</span>
        </p>
      </CardFooter>
    </Card>
  )
}

interface ProgressProps extends ComponentProps<'div'> {
  width: number;
  max: number;
  numberValue: number;
  month?: string;
}

export function ProgressBar({ width, max, numberValue, month, className, ...props }: ProgressProps) {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    if (currentWidth !== width) {
      const timeout = setTimeout(() => {
        setCurrentWidth(width);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [width])

  const percent = max === 0 ? 0 : (currentWidth / max) * 100;

  return (
    <div className={twMerge("relative group w-full h-full rotate-180", className)} {...props}>
      <div
        className={`bg-gradient-to-b from-violet-600 via-blue-500 to-cyan-500 rounded-b-md h-full transition-all duration-700 ease-in-out`}
        style={{ height: `${percent}%` }}
      />
      <div className="flex flex-col items-end bg-white rounded-md border border-blue-500 z-10 w-20 h-fit px-3 py-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1">
          <p className="rotate-180 text-center text-xs font-bold">R$ {formatShortNumber(numberValue)}</p>
          <div className="w-1 h-3 bg-blue-500 rounded" />
        </div>
        {month && (
          <div className="rotate-180 flex gap-1 items-center">
            <div className="w-1 h-3 bg-indigo-500 rounded" />
            <p className="text-xs">{month}</p>
          </div>
        )}
      </div>
    </div>
  );
}