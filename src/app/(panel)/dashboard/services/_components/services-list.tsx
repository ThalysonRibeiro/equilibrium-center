"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { DialogService } from "./dialog-sevice";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "sonner";
import { updateStatusService } from "../_actions/update-status-service";
import { useIsMobile } from "@/app/hooks/useMobile";
import { FormatHour } from "@/utils/formatHour";
import { PLAN_PROP, ResultPermissionProps } from "@/utils/permissions/canPermission";
import Link from "next/link";

export interface ServicesListProps {
  services: ServiceProps[];
  permission: ResultPermissionProps;
}

export interface ServiceProps {
  userId: string;
  id: string;
  name: string;
  price: string;
  duration: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function ServicesList({ services, permission }: ServicesListProps) {
  const isMobile = useIsMobile(1024);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<null | ServiceProps>(null);
  const [loadingServices, setLoadingServices] = useState<Record<string, boolean>>({});

  const getServicesForPlan = (permission: { hasPermission: boolean; planId: PLAN_PROP }) => {
    switch (permission.planId) {
      case "EXPIRED":
        return []; // Nenhum serviço disponível

      case "TRIAL":
      case "PROFESSIONAL":
        return services; // Ilimitado

      case "NORMAL":
        return services.slice(0, 30);

      case "BASIC":
        return services.slice(0, 3);

      default:
        return []; // Fallback seguro
    }
  };

  const servicesList = getServicesForPlan(permission);

  const getPlanLimitText = (planId: PLAN_PROP) => {
    switch (planId) {
      case "BASIC":
        return "3 serviços";
      case "NORMAL":
        return "30 serviços";
      case "TRIAL":
      case "PROFESSIONAL":
        return "Ilimitado";
      case "EXPIRED":
        return "0 serviços";
      default:
        return "Nenhum";
    }
  };

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

  async function handleEditService(service: ServiceProps) {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingService(null);
  }

  const isEditing = Boolean(editingService);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingService(null)
        }
      }}
    >
      <section
        className="mx-auto"
        role="region"
        aria-labelledby="active-services-heading"
        aria-describedby="services-description"
      >
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <div className="flex flex-col">
              <CardTitle id="active-services-heading" className="text-xl font-montserrat">
                Serviços Ativos
              </CardTitle>
              <p
                id="services-description"
                className="text-sm text-muted-foreground mt-1"
                aria-live="polite"
              >
                {servicesList.length} de {getPlanLimitText(permission.planId)} disponíveis
              </p>
            </div>

            {permission.hasPermission ? (
              <DialogTrigger asChild>
                <Button
                  className="hover:bg-accent"
                  aria-label="Adicionar novo serviço"
                  aria-describedby="add-service-help"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Adicionar</span>
                </Button>
              </DialogTrigger>
            ) : (
              <Button
                variant="link"
                aria-label="Limite de serviços atingido - Fazer upgrade do plano"
              >
                <Link
                  href="/dashboard/plans"
                  className="text-red-500"
                  aria-describedby="limit-reached-message"
                >
                  Limite de serviços atingido
                </Link>
              </Button>
            )}

            <div id="add-service-help" className="sr-only">
              Abre formulário para adicionar novo serviço
            </div>
            <div id="limit-reached-message" className="sr-only">
              Você atingiu o limite de serviços do seu plano atual. Clique para fazer upgrade.
            </div>

            <DialogContent
              className="bg-white"
              onInteractOutside={(e) => {
                e.preventDefault();
                handleCloseDialog();
              }}
              aria-describedby={isEditing ? "edit-service-description" : "add-service-description"}
            >
              <div className="sr-only">
                <p id="edit-service-description">
                  Formulário para editar serviço existente
                </p>
                <p id="add-service-description">
                  Formulário para adicionar novo serviço
                </p>
              </div>

              <DialogService
                closeModal={handleCloseDialog}
                serviceId={editingService ? editingService.id : undefined}
                initialValues={editingService ? {
                  name: editingService.name,
                  price: editingService.price,
                  hours: Math.floor(editingService.duration / 60).toString(),
                  minutes: (editingService.duration % 60).toString()
                } : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            {servicesList.length === 0 ? (
              <div className="text-center py-8" role="status">
                <p className="text-muted-foreground">
                  {permission.planId === "EXPIRED"
                    ? "Seu plano expirou. Renove para gerenciar serviços."
                    : "Nenhum serviço ativo encontrado"
                  }
                </p>
              </div>
            ) : (
              <div
                className="space-y-4 mt-5"
                role="list"
                aria-label={`Lista de ${servicesList.length} serviços ativos`}
              >
                {servicesList.map(service => (
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
                        className="font-semibold line-clamp-1 w-1/2"
                        title={service.name}
                      >
                        {service.name}
                      </span>
                      <span
                        className="font-semibold line-clamp-1"
                        aria-label={`Duração: ${FormatHour(service.duration)}`}
                        title={`Duração: ${FormatHour(service.duration)}`}
                      >
                        {FormatHour(service.duration)}
                      </span>
                      <span
                        className="font-semibold text-green-500 justify-items-end"
                        aria-label={`Preço: ${formatCurrency(service.price)}`}
                      >
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <div className="space-x-2 flex items-center" role="group" aria-label="Ações do serviço">
                      <Button
                        variant="ghost"
                        className="border"
                        onClick={() => handleEditService(service)}
                        aria-label={`Editar serviço ${service.name}`}
                        disabled={loadingServices[service.id]}
                      >
                        {isMobile ? (
                          <>
                            <Pencil className="w-4 h-4" aria-hidden="true" />
                            <span className="sr-only">Editar</span>
                          </>
                        ) : (
                          "Editar"
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        className="border text-red-500"
                        onClick={() => handleStatusService(service.id, "deactivate")}
                        aria-label={`Desativar serviço ${service.name}`}
                        disabled={loadingServices[service.id]}
                      >
                        {loadingServices[service.id] ? (
                          <>
                            <div
                              className="w-4 h-4 border-2 border-t-2 border-red-300 rounded-full animate-spin"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Desativando...</span>
                          </>
                        ) : isMobile ? (
                          <>
                            <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                            <span className="sr-only">Desativar</span>
                          </>
                        ) : (
                          "Desativar"
                        )}
                      </Button>
                    </div>

                    <div
                      className="sr-only"
                      aria-live="polite"
                      id={`status-${service.id}`}
                    >
                      {loadingServices[service.id] && "Processando ação..."}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}