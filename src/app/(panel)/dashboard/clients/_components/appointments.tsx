"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogTrigger
} from "@/components/ui/dialog";
import { AppointmentWithService } from "../../reports/types/allApponitments";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { colorStatus, statusMap } from "@/utils/colorStatus";
import { useState } from "react";
import { DialogAppointments } from "../../_components/appointments/dialog-appointments";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/app/hooks/useMobile";

interface AppointmentProps {
  appointments: AppointmentWithService[] | [];
  planId: string;
}
export function Appointment({ appointments, planId }: AppointmentProps) {
  const isMobile = useIsMobile(1280)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPages: number = 20;

  const totalPages = Math.ceil(appointments.length / itemsPerPages);
  const dataPage = appointments.slice(
    (currentPage - 1) * itemsPerPages,
    currentPage * itemsPerPages
  );

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <Card className="pt-0 overflow-auto">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Status</TableHead>
              {!isMobile && (<TableHead className="text-white">Serviço</TableHead>)}
              {!isMobile && (<TableHead className="text-right text-white">Valor</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPage.map(appointment => (
              <DialogTrigger asChild key={appointment.id} onClick={() => setDetailAppointment(appointment)}>
                <TableRow className="cursor-pointer">
                  <TableCell className="capitalize">{appointment.name.toLowerCase()}</TableCell>
                  <TableCell className={clsx("uppercase", `${colorStatus(appointment.status)}`)}>
                    {statusMap[appointment.status]}
                  </TableCell>
                  {!isMobile && (<TableCell>{appointment.service.name}</TableCell>)}
                  {!isMobile && (<TableCell className="text-right">{formatCurrency(appointment.service.price.toString())}</TableCell>)}
                </TableRow>
              </DialogTrigger>
            ))}
          </TableBody>
        </Table>
        <DialogAppointments appointment={detailAppointment} permission={planId} />
      </Dialog>
      <CardFooter className="flex items-center justify-center">
        {appointments.length > itemsPerPages && (
          <div className="flex gap-3">
            <Button variant={"ghost"} className="hover:bg-gray-100 hover:text-primary" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft />
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={"ghost"}
                onClick={() => changePage(index + 1)}
                className={cn("hover:bg-gray-100 hover:text-primary", currentPage === index + 1 && "font-bold text-lg")}
              >
                {index + 1}
              </Button>
            ))}
            <Button variant={"ghost"} className="hover:bg-gray-100 hover:text-primary" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}