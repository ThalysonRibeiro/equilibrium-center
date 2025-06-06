"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus, Prisma } from "@/generated/prisma";
import { extractPhoneNumber } from "@/utils/fomatPhone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { changeStatusAppointment } from "../../_actions/change-status-appointment";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogAppointments } from "./dialog-appointments";
import { ButtonPickerAppointment } from "./button-picker-date";
import { AppointmentWithService } from "../../reports/types/allApponitments";

interface AppointmentListProps {
  times: string[];
  permission: boolean;
  planId: string;
}

export function AppointmentList({ times, permission, planId }: AppointmentListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const statusQuery = searchParams.get('status');
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null);


  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date, statusQuery],
    queryFn: async () => {
      //buscar da rota
      let activeDate = date;
      let activeStatus = statusQuery;
      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd");
        activeDate = today;
      }
      if (!activeStatus) {
        activeStatus = "PENDING,SCHEDULED"
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}&status=${activeStatus}`;
      const response = await fetch(url);

      const json = await response.json() as AppointmentWithService[];

      if (!response.ok) return [];

      return json;
    },
    staleTime: 20000, // 20 segundos de staletime
    refetchInterval: 30000
  });

  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      const requiredSlots = Math.ceil(appointment.service.duration / 30) + 1;
      const startIndex = times.indexOf(appointment.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  function confirmToWhatsapp(phone: string, name: string, date: string | Date, time: string) {
    if (!date) {
      return;
    }
    const isoString = typeof date === "string" ? date : date.toISOString();
    const [year, month, day] = isoString.split("T")[0].split("-");
    const formatted = `${day}/${month}/${year}`;
    const message = `Olá ${name}, sua consulta foi agendada com sucesso para o dia ${formatted} às ${time}. Posso confirmar o agendamento?`;
    const url = `https://wa.me/55${extractPhoneNumber(phone)}?text=${encodeURIComponent(message)}`;

    return window.open(url, "_blank");
  }


  async function handleStatusAppointment(appointmentId: string, status: AppointmentStatus) {

    const response = await changeStatusAppointment({ appointmentId, status });

    if (response.error) {
      toast.error(response.error);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["get-appointments"] });
    refetch();
    toast.success(response.data);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg xl:text-2xl font-montserrat">
            Agendamentos
          </CardTitle>
          <ButtonPickerAppointment />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <div className="w-full h-[calc(100vh-15rem)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              times.map(slot => {
                const occupant = occupantMap[slot];
                const statusMap = {
                  PENDING: "Pendente",
                  SCHEDULED: "Confirmado",
                  COMPLETED: "Completo",
                  NO_SHOW: "Não comparecido",
                  CANCELLED: "Cancelado"
                };
                if (occupant) {
                  return (
                    <div
                      key={slot}
                      className="flex items-center justify-between py-2 border-t last:border-b w-full"
                    >
                      <div className="w-full">
                        <div className="flex gap-3">
                          <div className="font-bold">{slot}</div>
                          <div>
                            <div className="text-sm font-montserrat font-bold capitalize line-clamp-1">
                              {occupant.name.toLowerCase()}
                            </div>
                            <div className="text-sm">{occupant.phone}</div>
                          </div>
                          {!permission && planId !== "TRIAL" && (
                            <div className="ml-auto">
                              <DialogTrigger asChild>
                                <Button
                                  variant={"ghost"}
                                  size={"icon"}
                                  onClick={() => setDetailAppointment(occupant)}
                                >
                                  <Eye />
                                </Button>
                              </DialogTrigger>
                            </div>
                          )}
                        </div>
                        {(permission || planId === "TRIAL") && (
                          <div className="flex gap-3 items-center justify-between">
                            <Select onValueChange={(value: AppointmentStatus) => {
                              handleStatusAppointment(occupant.id, value)
                            }}>
                              <SelectTrigger className="w-[185px] border-primary/50">
                                <SelectValue placeholder={statusMap[occupant.status]} />
                              </SelectTrigger>
                              <SelectContent className="border-primary/50">
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="SCHEDULED">Confimado</SelectItem>
                                <SelectItem value="COMPLETED">Completo</SelectItem>
                                <SelectItem value="NO_SHOW">Não comparecimento</SelectItem>
                                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2.5">
                              <Button
                                size={"icon"}
                                onClick={() => confirmToWhatsapp(occupant.phone, occupant.name, occupant.appointmentDate, occupant.time)}
                                className="bg-green-400 hover:bg-accent rounded-md text-white text-sm font-semibold cursor-pointer"
                              >
                                <FaWhatsapp />
                              </Button>

                              <DialogTrigger asChild>
                                <Button
                                  variant={"ghost"}
                                  size={"icon"}
                                  onClick={() => setDetailAppointment(occupant)}
                                >
                                  <Eye />
                                </Button>
                              </DialogTrigger>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                return (
                  <div
                    key={slot}
                    className="flex items-center gap-3 py-2 border-t last:border-b"
                  >
                    <div className="font-bold">{slot}</div>
                    <div>Disponível</div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <DialogAppointments appointment={detailAppointment} permission={planId} />
    </Dialog>
  )
}