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
    <Card className="pt-0 overflow-auto" role="region" aria-label="Lista de agendamentos">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Table role="table" aria-label="Tabela de agendamentos">
          <TableCaption className="sr-only">
            Lista de {appointments.length} agendamentos. Página {currentPage} de {totalPages}.
            {appointments.length === 0 && "Nenhum agendamento encontrado."}
          </TableCaption>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="text-white" scope="col">Nome</TableHead>
              <TableHead className="text-white" scope="col">Status</TableHead>
              {!isMobile && (<TableHead className="text-white" scope="col">Serviço</TableHead>)}
              {!isMobile && (<TableHead className="text-right text-white" scope="col">Valor</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPage.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 2 : 4}
                  className="text-center py-8 text-muted-foreground"
                  role="cell"
                >
                  Nenhum agendamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              dataPage.map((appointment, index) => (
                <DialogTrigger
                  asChild
                  key={appointment.id}
                  onClick={() => setDetailAppointment(appointment)}
                >
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50 focus-within:bg-muted/50"
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalhes do agendamento de ${appointment.name}, status ${statusMap[appointment.status]}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setDetailAppointment(appointment);
                        setIsDialogOpen(true);
                      }
                    }}
                  >
                    <TableCell className="capitalize" role="cell">
                      {appointment.name.toLowerCase()}
                    </TableCell>
                    <TableCell
                      className={clsx("uppercase", `${colorStatus(appointment.status)}`)}
                      role="cell"
                      aria-label={`Status: ${statusMap[appointment.status]}`}
                    >
                      {statusMap[appointment.status]}
                    </TableCell>
                    {!isMobile && (
                      <TableCell role="cell">
                        {appointment.service.name}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell
                        className="text-right"
                        role="cell"
                        aria-label={`Valor: ${formatCurrency(appointment.service.price.toString())}`}
                      >
                        {formatCurrency(appointment.service.price.toString())}
                      </TableCell>
                    )}
                  </TableRow>
                </DialogTrigger>
              ))
            )}
          </TableBody>
        </Table>
        <DialogAppointments appointment={detailAppointment} permission={planId} />
      </Dialog>

      {appointments.length > itemsPerPages && (
        <CardFooter className="flex items-center justify-center">
          <nav
            role="navigation"
            aria-label="Navegação de páginas da tabela de agendamentos"
            className="flex gap-3"
          >
            <Button
              variant={"ghost"}
              className="hover:bg-transparent hover:text-accent"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = currentPage === pageNumber;

              return (
                <Button
                  key={index}
                  variant={"ghost"}
                  onClick={() => changePage(pageNumber)}
                  className={cn(
                    "hover:bg-transparent hover:text-accent",
                    isCurrentPage && "font-bold text-lg"
                  )}
                  aria-label={`${isCurrentPage ? 'Página atual, ' : ''}Página ${pageNumber}`}
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant={"ghost"}
              className="hover:bg-transparent hover:text-accent"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        </CardFooter>
      )}
    </Card>
  )
}