"use client"
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { ServiceCard } from "./card-service";
import { createQueryFetcher } from "@/utils/createQueryFetcher";
import { TopServiceProps } from "../../types/topServices";
import { LoadingUI } from "@/components/ui/loading-ui";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDuration } from "@/utils/formatHour";



export function TopServicesContent({ download_pdf }: { download_pdf: boolean }) {
  const {
    data: topServices = [],
    isLoading: isLoadingTopServices,
    refetch: refetchTopServices
  } = useQuery({
    queryKey: ["get-metrics-services"],
    queryFn: createQueryFetcher<TopServiceProps[] | []>("metrics/services"),
    staleTime: 80000,
    refetchInterval: 90000,
  });

  if (isLoadingTopServices) {
    return (
      <LoadingUI />
    )
  }

  // Calculate the highest values for relative scaling
  const maxCount = topServices.reduce((acc, cur) => acc + cur.count, 0);
  const maxAmount = topServices.reduce((acc, cur) => acc + cur.totalAmount, 0);
  const maxDuration = topServices.reduce((acc, cur) => acc + cur.totalDuration, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-primary font-semibold"></h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Top Serviços
          </CardTitle>
          <CardDescription className="text-center">
            Metricas totais dos serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold">{maxCount}</p>
              <p>Total Vendas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{formatCurrency(maxAmount.toString())}</p>
              <p>Receita Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{formatDuration(maxDuration)}</p>
              <p>Tempo Total</p>
            </div>
          </div>


          <div>
            {topServices && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {topServices?.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    maxCount={maxCount}
                    currentCount={service.count}
                    maxAmount={maxAmount}
                    maxDuration={maxDuration}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>

  );
};