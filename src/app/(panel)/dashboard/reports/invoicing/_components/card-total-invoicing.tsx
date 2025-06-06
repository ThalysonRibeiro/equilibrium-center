import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeneratePDFTotalInvoicing from "../../../../../../components/generatePDF/generate-pdf-total-invoicing";
import { InvoiceProps } from "../../types/invoicing";
import { formatCurrency } from "@/utils/formatCurrency";


export function CardTotalINvoicing({ data, download_pdf }: { data: InvoiceProps, download_pdf: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat text-2xl lg:text-3xl inline-flex justify-between">
          Receita Total
          {download_pdf && (
            <GeneratePDFTotalInvoicing data={data.metricsTotalInvoicing} />
          )}
        </CardTitle>
        <CardDescription>
          Desde o início da operação
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-2xl lg:text-3xl font-bold">
            {formatCurrency(data?.metricsTotalInvoicing.totalInvoicing.toString())}
          </p>
        </div>
        <div>
          <p className="font-montserrat lg:text-xl">
            Total de agendamentos:{' '}
            <span className="text-2xl font-bold">
              {data.metricsTotalInvoicing.totalAppointments}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}