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

export interface ServicesListProps {
  services: ServiceProps[];
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

export function ServicesList({ services }: ServicesListProps) {
  const isMobile = useIsMobile(1024);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<null | ServiceProps>(null);

  async function handleStatusService(serviceId: string, status: string) {
    const response = await updateStatusService({ serviceId: serviceId, status });
    if (response.error) {
      toast.error(response.error)
      return;
    }
    toast.success(response.data);
  }

  async function handleEditService(service: ServiceProps) {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingService(null)
        }
      }}>
      <section className="mx-auto text-primary">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-xl font-montserrat">Serviços Ativo</CardTitle>
            <DialogTrigger asChild>
              <Button className="hover:bg-accent">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent
              className="bg-white"
              onInteractOutside={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingService(null);
              }}
            >
              <DialogService
                closeModal={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
                }}
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
            <section className="space-y-4 mt-5">
              {services.map(service => (
                <article
                  key={service.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center justify-between rounded-md space-x-2 px-2 w-full h-9 border text-sm lg:text-base">
                    <span className="font-medium line-clamp-1">{service.name}</span>
                    <span className="font-medium text-green-500">{formatCurrency(service.price)}</span>
                  </div>

                  <div className="space-x-2 flex items-center">
                    <Button
                      variant={"ghost"}
                      className="border"
                      onClick={() => handleEditService(service)}
                    >
                      {isMobile ? (
                        <>
                          <Pencil className="w-4 h-4" />
                        </>
                      ) : (
                        <p>
                          Editar
                        </p>
                      )}
                    </Button>
                    <Button
                      variant={"ghost"}
                      className="border text-red-500"
                      onClick={() => handleStatusService(service.id, "deactivate")}
                    >
                      {isMobile ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <p>Desativar</p>
                      )}
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}