"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react"
import { DialogService } from "./dialog-sevice";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "sonner";
import { deleteService } from "../_actions/delete-service";

interface ServicesListProps {
  services: ServiceProps[];
}

interface ServiceProps {
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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<null | ServiceProps>(null);

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId: serviceId });
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
      <section className="mx-auto">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-xl text-corsecondary">Servoços</CardTitle>
            <DialogTrigger asChild>
              <Button className="bg-corsecondary hover:bg-corprimary">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent
              className="border-corprimary"
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
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{service.name}</span>
                    <span className="font-medium text-green-500">{formatCurrency(service.price)}</span>
                  </div>

                  <div className="space-x-2">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="border border-corsecondary"
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="w-4 h-4 text-corsecondary" />
                    </Button>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="border border-red-500"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <X className="w-4 h-4 text-red-500" />
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