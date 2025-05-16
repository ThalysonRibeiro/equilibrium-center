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
import { formatCurrency } from "@/utils/formatCurrency";
import GeneratePDFForSixMonth from "../../_components/generatePDF/generate-pdf-invoicing-six-month";

interface BarProps {
  chartData: MonthlyDataProps[];
  totalSixMonth: number;
}

export function BarChartLabel({ chartData, totalSixMonth }: BarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex justify-between items-center">
          Faturamento dos últomos 6 meses
          <GeneratePDFForSixMonth chartData={chartData} totalSixMonth={totalSixMonth} />
        </CardTitle>
        <CardDescription>
          Dados gerados automaticamente dos últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-100 flex justify-center gap-1 p-3 text-primary border rounded">
          <div className="absolute w-[97%] h-[90%] opacity-80 flex flex-col justify-between  text-[10px]">
            <div>
              <p>100%</p>
            </div>
            <div>
              <p>75%</p><hr />
            </div>
            <div>
              <p>50%</p><hr />
            </div>
            <div>
              <p>25%</p><hr />
            </div>
            <div>
              <p>0%</p>
            </div>
          </div>

          <div className="w-[95%] flex gap-3">
            {chartData.map(item => {

              return (
                <div key={item.month} className="w-full h-full max-h-[95%]">
                  <ProgressBar
                    width={item.total}
                    max={totalSixMonth}
                    color="bg-ring"
                    numberValue={item.total}
                  />
                  <p className="text-center">{item.month.slice(0, 3)}</p>
                </div>
              )
            })}
          </div>

        </div>
      </CardContent>
      <CardFooter>
        <p>Receita gerada nos últomos 6 meses: <span className="text-md md:text-2xl font-montserrat font-black">{formatCurrency(String(totalSixMonth))}</span></p>
      </CardFooter>
    </Card>
  )
}

interface ProgressProps extends ComponentProps<'div'> {
  width: number;
  max: number;
  color: string;
  numberValue: number;
}

export function ProgressBar({ width, max, color, numberValue, className, ...props }: ProgressProps) {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentWidth(width);
    }, 100); // pequeno delay para garantir que a transição ocorra

    return () => clearTimeout(timeout);
  }, [width]);

  const percent = (currentWidth / max) * 100;

  return (
    <div className={twMerge("w-full h-full rotate-180", className)} {...props}>
      <div
        className={`${color} rounded-b-md h-full transition-all duration-700 ease-in-out`}
        style={{ height: `${percent}%` }}
      />
      <p className="rotate-180 text-center font-montserrat">{numberValue}</p>
    </div>
  );
}