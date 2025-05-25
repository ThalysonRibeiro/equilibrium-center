"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesListProps } from "./services-list";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { updateStatusService } from "../_actions/update-status-service";
import { toast } from "sonner";

interface AllServiceListProps extends Partial<ServicesListProps> { }

export function AllServiceList({ services }: AllServiceListProps) {
  if (!services) return [];

  async function handleStatusService(serviceId: string, status: string) {
    const response = await updateStatusService({ serviceId: serviceId, status });
    if (response.error) {
      toast.error(response.error)
      return;
    }
    toast.success(response.data);
  }

  return (
    <section className="mx-auto">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-xl font-montserrat">Todos os Serviços</CardTitle>
        </CardHeader>

        <CardContent>
          <section className="space-y-2 mt-5 text-primary">
            {services.map(service => (
              <article
                key={service.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center justify-between rounded-md space-x-2 px-2 w-full h-9 border text-sm lg:text-base">
                  <span className="font-semibold line-clamp-1">{service.name}</span>
                  <span className="font-semibold text-green-500">{formatCurrency(service.price)}</span>
                </div>

                <div className="space-x-2 flex items-center justify-end">
                  {service.status === false ? (
                    <Button
                      variant={"ghost"}
                      className="border"
                      onClick={() => handleStatusService(service.id, "active")}
                    >
                      <p>Ativar</p>
                    </Button>
                  ) : (
                    <Button
                      variant={"ghost"}
                      disabled
                      className="w-18"
                    ></Button>
                  )}
                </div>
              </article>
            ))}
          </section>
        </CardContent>
      </Card>
    </section>
  )
}