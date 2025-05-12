"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query";


interface ChartDataProps {
  date: string;
  current: number;
  previous: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  current: {
    label: "Atual",
    color: "hsl(var(--chart-1))",
  },
  previous: {
    label: "Anterior",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;


export function BarChartMultiple() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["revenue-by-day"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/revenue-by-day`;
      const response = await fetch(url);
      const json = await response.json() as ChartDataProps[];
      if (!response.ok) {
        throw new Error("Erro ao buscar métricas");
      }

      return json;
    },
    staleTime: 20000, // 20 segundos de staletime
    refetchInterval: 30000
  });

  const now = new Date()
  let daysToUse = 90
  if (timeRange === "30d") {
    daysToUse = 30
  } else if (timeRange === "7d") {
    daysToUse = 7
  }

  // cria um mapa com os valores por data
  const sumByDate: Record<string, number> = {}
  data?.forEach((item) => {
    const dateStr = new Date(item.date).toLocaleDateString("en-CA")
    sumByDate[dateStr] = item.current // ou outro campo que você estiver usando
  })

  // gera os últimos X dias e monta os pares current/previous
  const filteredData = Array.from({ length: daysToUse }, (_, i) => {
    const current = new Date(now)
    current.setDate(now.getDate() - i)
    const currentStr = current.toLocaleDateString("en-CA")

    const previous = new Date(current)
    previous.setDate(current.getDate() - daysToUse)
    const previousStr = previous.toLocaleDateString("en-CA")

    return {
      date: currentStr,
      current: sumByDate[currentStr] || 0,
      previous: sumByDate[previousStr] || 0,
    }
  }).reverse()



  return (
    <>
      {isLoading ? (
        <div className="w-full h-100 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-corsecondary rounded-full animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Gráfico de Área - Interativo</CardTitle>
              <CardDescription>
                Mostrando o total de receita dos últimos {timeRange.replace("d", "")} dias
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="oklch(0.696 0.17 162.48)"
                  fill="oklch(0.696 0.17 162.48)"
                  name="Período Atual"
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="oklch(0.627 0.265 303.9)"
                  fill="oklch(0.627 0.265 303.9)"
                  name="Período Anterior"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  )
}
