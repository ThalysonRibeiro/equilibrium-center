"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody, TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { useIsMobile } from "@/app/hooks/useMobile";
import { AppointmentWithService } from "../../types/allApponitments";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";


interface CustomerTableProps {
  appointment: AppointmentWithService[];
  loading: boolean;
}

export function CustomerTable({ appointment, loading }: CustomerTableProps) {
  const isMobile = useIsMobile(1024);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPages: number = 20;

  const totalPages = Math.ceil(appointment.length / itemsPerPages);
  const dataPage = appointment.slice(
    (currentPage - 1) * itemsPerPages,
    currentPage * itemsPerPages
  );

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function colorStatus(status: string): string {
    switch (status) {
      case "SCHEDULED":
        return "text-blue-500";
      case "COMPLETED":
        return "text-green-500";
      case "NO_SHOW":
        return "text-orange-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-yellow-400"; // PENDING ou qualquer outro
    }
  }
  const statusMap = {
    PENDING: "Pendente",
    SCHEDULED: "Confirmado",
    COMPLETED: "Completo",
    NO_SHOW: "Não comparecido",
    CANCELLED: "Cancelado"
  };
  return (
    <>
      {loading ? (
        <div className="w-full h-50 border rounded-lg bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-300 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              Agendamentos
            </CardTitle>
            <CardDescription>
              Agendamentos até a data selecionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="h-full rounded-lg bg-white text-gray-700 text-[10px] md:text-[12px] xl:text-base">
              <TableHeader>
                <TableRow className="bg-cyan-600">
                  <TableHead className="text-gray-700 uppercase">Data</TableHead>
                  <TableHead className="text-gray-700 uppercase">Status</TableHead>
                  <TableHead className="text-gray-700 uppercase">Nome</TableHead>
                  <TableHead className="text-gray-700 uppercase">Hora</TableHead>
                  {!isMobile && (<TableHead className="text-gray-700 uppercase">telefone</TableHead>)}
                  <TableHead className="text-gray-700 uppercase text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {dataPage.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="border-l border-r font-medium">
                      {format(new Date(item.appointmentDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className={clsx("border-r font-semibold uppercase line-clamp-1", `${colorStatus(item.status)}`)}>
                      {statusMap[item.status]}
                    </TableCell>
                    <TableCell className="border-r">
                      {item.name}
                    </TableCell>
                    <TableCell className="border-r">
                      {item.time}
                    </TableCell>
                    {!isMobile && (<TableCell className="border-r">{item.phone}</TableCell>)}
                    <TableCell className="text-right border-r">
                      {item.service.price.toString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-gray-200">
                  <TableCell colSpan={!isMobile ? 5 : 4}>Total</TableCell>
                  <TableCell className="text-right font-black text-green-600">
                    {formatCurrency(String(appointment.reduce((soma, item) => soma + Number(item.service.price), 0)))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            {appointment.length > itemsPerPages && (
              <div className="flex gap-3">
                <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft />
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => changePage(index + 1)}
                    className={cn("bg-transparent text-primary rounded-full border", currentPage === index + 1 && "bg-primary text-white")}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  )
}