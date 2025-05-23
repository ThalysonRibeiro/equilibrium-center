"use client"
import { formatCurrency } from "@/utils/formatCurrency";
import { ForSpecificDateProps } from "../../types/invoicing-date";
import {
  CardContent, CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/app/hooks/useMobile";
import { FormatHour } from "@/utils/formatHour";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PerformanceContentProps {
  data: ForSpecificDateProps;
}

export function PerformanceContent({ data }: PerformanceContentProps) {
  if (!data) {
    return
  }

  const isMobile = useIsMobile(868);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPages: number = 20;

  const totalPages = Math.ceil(data?.specificDate.length / itemsPerPages);
  const dataPage = data?.specificDate.slice(
    (currentPage - 1) * itemsPerPages,
    currentPage * itemsPerPages
  );

  function changePage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <>
      <CardContent>
        <div>
          <Table>
            <TableHeader className="bg-cyan-600">
              <TableRow className="text-xl">
                <TableHead>Agendamentos</TableHead>
                <TableHead className="text-right">Faturamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-3xl font-bold">
                <TableCell>{data?.totalAppointmentSpecificDate}</TableCell>
                <TableCell className="text-right">{formatCurrency(String(data?.totalInvoicingspecificDate))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <hr className="my-6" />
        <div>
          <Table>
            <TableHeader className="bg-cyan-600">
              <TableRow>
                <TableHead className="w-[100px]">Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead className="text-right">Duração</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {dataPage.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-[12px] capitalize border-e">
                    {isMobile ? (
                      <>{appointment.name.split(" ")[0].toLowerCase()}</>
                    ) : (
                      <>{appointment.name.toLowerCase()}</>
                    )}
                  </TableCell>
                  <TableCell className="text-[12px] capitalize border-e truncate max-w-35">
                    {appointment.service.name.toLowerCase()}
                  </TableCell>
                  <TableCell className="text-[12px] text-right border-e">
                    {FormatHour(appointment.service.duration)}
                  </TableCell>
                  <TableCell className="text-[12px] text-right">{formatCurrency(appointment.service.price.toString())}</TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        {data?.specificDate.length > itemsPerPages && (
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
    </>
  )
}