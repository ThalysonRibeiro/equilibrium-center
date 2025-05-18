import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeneratePDFTotalInvoicing from "../../_components/generatePDF/generate-pdf-total-invoicing";
import { InvoiceProps, MetricsTotalInvoicingProps } from "../../types/invoicing";
import { formatCurrency } from "@/utils/formatCurrency";

export function CardTotalINvoicing({ data }: { data: InvoiceProps }) {
  return (
    <Card className="bg-emerald-100 border-emerald-300">
      <CardHeader>
        <CardTitle className="font-montserrat text-2xl lg:text-3xl inline-flex justify-between">
          Receita Total
          <GeneratePDFTotalInvoicing data={data.metricsTotalInvoicing} />
        </CardTitle>
        <CardDescription className="text-lg text-emerald-600">
          Desde o início da operação
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-2xl lg:text-3xl font-black">
            {formatCurrency(data?.metricsTotalInvoicing.totalInvoicing.toString())}
          </p>
        </div>
        <div>
          <p className="font-montserrat lg:text-xl">
            Total de agendamentos:{' '}
            <span className="text-2xl font-black">
              {data.metricsTotalInvoicing.totalAppointments}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}