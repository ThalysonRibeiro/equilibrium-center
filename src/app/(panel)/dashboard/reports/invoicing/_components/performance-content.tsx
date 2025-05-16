
import { formatCurrency } from "@/utils/formatCurrency";
import { ForSpecificDateProps } from "../../types/invoicing-date";
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DateRangePicker } from "@/components/date-range-picker";
import GeneratePDFInvoicingDate from "../../_components/generatePDF/generate-pdf-invoicing-date";

interface PerformanceContentProps {
  data: ForSpecificDateProps | undefined;
}

export function PerformanceContent({ data }: PerformanceContentProps) {
  function calculateDays() {
    const startDate = new Date(data?.startDateConsultation || "");
    const endDate = new Date(data?.endDateConsultation || "");
    // Diferença em milissegundos
    const diffTime = endDate.getTime() - startDate.getTime();

    // Converter de milissegundos para dias
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const dates = calculateDays();

  return (
    <section className="">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <DateRangePicker value={30} />
              <GeneratePDFInvoicingDate data={data} />
            </CardTitle>
            <CardDescription>
              Metricas de faturamendo por data especifica, Consulta equivalente a <span>{dates.toString()}</span> Dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Table>
                <TableHeader className="bg-green-400">
                  <TableRow className="text-xl">
                    <TableHead>Agendamentos</TableHead>
                    <TableHead className="text-right">Faturamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="text-3xl font-extrabold">
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
                  {data?.specificDate.map(appointment => (
                    <TableRow key={appointment.id}>
                      <TableCell className="capitalize border-e">{appointment.name}</TableCell>
                      <TableCell className="capitalize border-e truncate max-w-35">{appointment.service.name}</TableCell>
                      <TableCell className="text-right border-e">{appointment.service.duration} Min</TableCell>
                      <TableCell className="text-right">{formatCurrency(appointment.service.price.toString())}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <p>1 2 3 4</p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}