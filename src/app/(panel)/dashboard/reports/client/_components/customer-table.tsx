import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Appointment } from "@/generated/prisma"
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";
import clsx from "clsx";
import { useIsMobile } from "@/app/hooks/useMobile";
import { LoadingUI } from "@/components/ui/loading-ui";
import { AppointmentWithService } from "../../types/allApponitments";


interface CustomerTableProps {
  appointment: AppointmentWithService[];
  loading: boolean;
}

export function CustomerTable({ appointment, loading }: CustomerTableProps) {
  const isMobile = useIsMobile(1024);
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
        <Table className="h-full rounded-lg bg-white text-gray-700 text-[10px] md:text-[12px] xl:text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-700 uppercase">Data</TableHead>
              <TableHead className="text-gray-700 uppercase">Status</TableHead>
              <TableHead className="text-gray-700 uppercase">Nome</TableHead>
              <TableHead className="text-gray-700 uppercase">Hora</TableHead>
              {!isMobile && (<TableHead className="text-gray-700 uppercase">telefone</TableHead>)}
              <TableHead className="text-gray-700 uppercase text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {appointment.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium border">{format(new Date(item.appointmentDate), "dd/MM/yyyy")}</TableCell>
                <TableCell className={clsx("font-semibold uppercase line-clamp-1", `${colorStatus(item.status)}`)}>{statusMap[item.status]}</TableCell>
                <TableCell className="border">{item.name}</TableCell>
                <TableCell>{item.time}</TableCell>
                {!isMobile && (<TableCell className="border">{item.phone}</TableCell>)}
                <TableCell className="text-right">{item.service.price.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={!isMobile ? 5 : 4}>Total</TableCell>
              <TableCell className="text-right text-green-600">
                {formatCurrency(String(appointment.reduce((soma, item) => soma + Number(item.service.price), 0)))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </>
  )
}