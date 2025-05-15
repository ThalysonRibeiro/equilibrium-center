"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface CardPerformanceProps {
  title: string;
  description: string;
  titleContent?: string;
  percent: number;
  total: number | string;
}

export function CardPerformance({ title, description, titleContent, percent, total }: CardPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-montserrat inline-flex justify-between w-full">
          {title}

          {typeof percent === "number" && (
            <div className="border rounded-md px-2 py-1 inline-flex items-center text-sm font-normal">
              {percent >= 100 ? (
                <span className="text-green-500 font-semibold inline-flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +{percent.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500 font-semibold inline-flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" /> {percent.toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        <span className="font-montserrat text-4xl">
          {typeof percent === "number"
            ? `${Math.abs(percent).toFixed(2)}%`
            : "0.00%"}
        </span>
        <span className="text-2xl font-montserrat">
          {titleContent} {total}
        </span>
      </CardContent>
    </Card>
  )
}