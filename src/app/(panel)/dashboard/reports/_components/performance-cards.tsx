"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface PerformanceCardsProps {
}

export function PerformanceCards({ }: PerformanceCardsProps) {


  return (
    <section className="grid grid-cols-2 gap-3 mb-3">
      {infoCads.map((item, index) => (
        <Card
          key={item.title}
          className=""
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {item.title}
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-500">{item.value}</span>
            <p>{item.metrics}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

const infoCads = [
  { title: "Agendamentos", metrics: "+15% até esta data", value: "+110" },
  { title: "Total de ganhos", metrics: "+55% até esta data", value: "+R$ 2.110,00" },
];