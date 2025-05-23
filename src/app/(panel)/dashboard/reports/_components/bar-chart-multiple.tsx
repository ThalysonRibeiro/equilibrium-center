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
import { LoadingUI } from "@/components/ui/loading-ui"


interface ChartDataProps {
  dailyData: DailyDataProps[];
  summary: {
    "7d": SummaryProps;
    "30d": SummaryProps;
    "90d": SummaryProps;
  }
}

interface SummaryProps {
  currentPeriodTotal: number;
  previousPeriodTotal: number;
  percentageChange: number;
}

interface DailyDataProps {
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
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["revenue-by-day"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/metrics/revenue-by-day`;
      const response = await fetch(url);
      const json = await response.json() as ChartDataProps;
      if (!response.ok) {
        throw new Error("Erro ao buscar métricas");
      }

      return json;
    },
    staleTime: 20000, // 20 segundos de staletime
    refetchInterval: 30000
  });

  // Filtrar os dados com base no período selecionado
  const getFilteredData = () => {
    if (!data?.dailyData) return [];

    const daysToUse = parseInt(timeRange.replace("d", ""));

    // Ordenamos os dados primeiro por data
    const sortedData = [...data.dailyData].sort((a, b) => {
      // Comparação de datas no formato YYYY-MM-DD (pode ser comparada como string)
      return a.date < b.date ? 1 : -1;
    });

    // Pegamos apenas os X dias mais recentes e invertemos para exibição cronológica
    return sortedData.slice(0, daysToUse).reverse();
  };

  const filteredData = getFilteredData();
  const currentSummary = data?.summary?.[timeRange];

  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingUI />
        </div>
      ) : (
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="font-montserrat">Gráfico de Área - Interativo</CardTitle>
              <CardDescription>
                Mostrando o total de receita dos últimos {timeRange.replace("d", "")} dias
                {currentSummary && (
                  <>
                    {" "}- Variação: <span className={currentSummary.percentageChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {currentSummary.percentageChange >= 0 ? "+" : ""}{currentSummary.percentageChange.toFixed(2)}%
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
            <Select value={timeRange}
              onValueChange={(value) => {
                if (value === "7d" || value === "30d" || value === "90d") {
                  setTimeRange(value);
                }
              }}
            >
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Últimos 3 meses
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Últimos 30 dias
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Últimos 7 dias
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
                    // Garante que o parse da data seja consistente
                    const [year, month, day] = value.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        // Garante que o parse da data seja consistente
                        const [year, month, day] = value.split('-').map(Number);
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="oklch(62.3% 0.214 259.815)"
                  fill="oklch(62.3% 0.214 259.815)"
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