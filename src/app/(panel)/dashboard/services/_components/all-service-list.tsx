"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesListProps } from "./services-list";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { updateStatusService } from "../_actions/update-status-service";
import { toast } from "sonner";
import { useState } from "react";

interface AllServiceListProps extends Partial<ServicesListProps> { }

export function AllServiceList({ services }: AllServiceListProps) {
  const [loadingServices, setLoadingServices] = useState<Record<string, boolean>>({});

  if (!services || services.length === 0) {
    return (
      <section className="mx-auto" role="region" aria-labelledby="services-heading">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle id="services-heading" className="text-xl font-montserrat">
              Todos os Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8" role="status">
              Nenhum serviço encontrado
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  async function handleStatusService(serviceId: string, status: string) {
    setLoadingServices(prev => ({ ...prev, [serviceId]: true }));

    try {
      const response = await updateStatusService({ serviceId: serviceId, status });
      if (response.error) {
        toast.error(response.error)
        return;
      }
      toast.success(response.data);
    } catch (error) {
      toast.error("Erro ao atualizar status do serviço");
    } finally {
      setLoadingServices(prev => ({ ...prev, [serviceId]: false }));
    }
  }

  const activeServices = services.filter(service => service.status === true);
  const inactiveServices = services.filter(service => service.status === false);

  return (
    <section className="mx-auto" role="region" aria-labelledby="services-heading">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <CardTitle id="services-heading" className="text-xl font-montserrat">
            Todos os Serviços
          </CardTitle>
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {services.length} {services.length === 1 ? 'serviço' : 'serviços'}
            ({activeServices.length} ativo{activeServices.length !== 1 ? 's' : ''}, {inactiveServices.length} inativo{inactiveServices.length !== 1 ? 's' : ''})
          </div>
        </CardHeader>

        <CardContent>
          {services.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" role="status">
              Nenhum serviço encontrado
            </p>
          ) : (
            <div className="space-y-2 mt-5" role="list" aria-label="Lista de serviços">
              {services.map(service => (
                <article
                  key={service.id}
                  className="flex items-center justify-between gap-2"
                  role="listitem"
                  aria-labelledby={`service-name-${service.id}`}
                  aria-describedby={`service-details-${service.id}`}
                >
                  <div
                    className="flex items-center justify-between rounded-md space-x-2 px-2 w-full h-9 border text-sm lg:text-base"
                    id={`service-details-${service.id}`}
                  >
                    <span
                      id={`service-name-${service.id}`}
                      className="font-semibold line-clamp-1"
                      title={service.name}
                    >
                      {service.name}
                    </span>
                    <span
                      className="font-semibold text-green-500"
                      aria-label={`Preço: ${formatCurrency(service.price)}`}
                    >
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <div className="space-x-2 flex items-center justify-end">
                    {service.status === false ? (
                      <Button
                        variant="ghost"
                        className="border"
                        onClick={() => handleStatusService(service.id, "active")}
                        disabled={loadingServices[service.id]}
                        aria-label={`Ativar serviço ${service.name}`}
                        aria-describedby={`status-${service.id}`}
                      >
                        {loadingServices[service.id] ? (
                          <>
                            <div
                              className="w-4 h-4 border-2 border-t-2 border-gray-300 rounded-full animate-spin mr-2"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Ativando...</span>
                            Ativando
                          </>
                        ) : (
                          "Ativar"
                        )}
                      </Button>
                    ) : (
                      <div
                        className="w-18 h-9 flex items-center justify-center"
                        aria-label={`Serviço ${service.name} está ativo`}
                      >
                        <span
                          className="text-sm text-green-600 font-medium"
                          aria-label="Status ativo"
                        >
                          Ativo
                        </span>
                      </div>
                    )}
                    <div
                      id={`status-${service.id}`}
                      className="sr-only"
                      aria-live="polite"
                    >
                      Status atual: {service.status ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}