"use client"
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from "@/components/ui/card";

import { BarChart, Trophy, Clock } from 'lucide-react';
import { TopServiceProps } from '../../types/topServices';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDuration } from '@/utils/formatHour';
import { Progress } from "@/components/ui/progress";


export interface ServiceCardProps {
  service: TopServiceProps;
  maxCount: number;
  currentCount: number;
  maxAmount: number;
  maxDuration: number;
}

export function ServiceCard({ service, maxCount, currentCount, maxAmount, maxDuration }: ServiceCardProps) {

  return (
    <Card className="hover:scale-102 transition-transform duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-semibold text-lg">
          <span className="line-clamp-1">{service.name}</span>
          <span>{formatCurrency(service.price.toString())}</span>
        </CardTitle>
        <CardDescription>
          <hr className="border-gray-200" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <p className="inline-flex items-center gap-2">
              <span className="bg-cyan-100 p-1 rounded">
                <Trophy size={16} />
              </span>
              Agendamentos
              <span className="font-semibold text-lg">
                {service.count}
              </span>
            </p>
            <Progress
              max={maxCount}
              width={currentCount}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="inline-flex items-center gap-2">
              <span className="bg-cyan-100 p-1 rounded">
                <BarChart size={16} />
              </span>
              Receita
              <span className="font-semibold text-lg">
                {formatCurrency(service.totalAmount.toString())}
              </span>
            </p>
            <Progress
              max={maxAmount}
              width={service.totalAmount}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="inline-flex items-center gap-2">
              <span className="bg-cyan-100 p-1 rounded">
                <Clock size={16} />
              </span>
              Tempo total
              <span className="font-semibold text-lg">
                {formatDuration(service.totalDuration)}
              </span>
            </p>
            <Progress
              max={maxDuration}
              width={service.totalDuration}
            />
          </div>
        </div>
      </CardContent>
    </Card>

  );
};
