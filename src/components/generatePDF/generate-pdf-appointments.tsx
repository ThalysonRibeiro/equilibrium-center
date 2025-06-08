'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { img_base64 } from './img-logo-base64';
import { Download } from 'lucide-react';
import { FormatHour } from '@/utils/formatHour';
import { formatCurrency } from '@/utils/formatCurrency';
import { AllAppointmentProps } from '../../app/(panel)/dashboard/reports/types/allApponitments';
import { format } from "date-fns";

interface GeneratePDFProps {
  data: AllAppointmentProps | undefined;
}

export default function GeneratePDFAppointments({ data }: GeneratePDFProps) {
  const [generatePDF, setGeneratePDF] = useState<(() => void) | null>(null);

  useEffect(() => {
    const loadLibs = async () => {
      const jsPDFModule = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const jsPDF = jsPDFModule.jsPDF;

      const gerarPDF = () => {
        if (!data) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const logoSize = 30;
        const xLogo = (pageWidth / 2) - (logoSize / 2);
        const yLogo = 10;

        doc.addImage(img_base64, 'PNG', xLogo, yLogo, logoSize, logoSize);

        const yTitle = yLogo + logoSize + 10;
        doc.setFontSize(14);
        doc.text("Relatório de Agendamentos", pageWidth / 2, yTitle, { align: 'center' });

        const currentY = yTitle + 10;

        // ⬇️ Tabela de status com cores e alinhamento padronizado
        autoTable(doc, {
          startY: currentY,
          head: [['STATUS', 'PERCENTUAL']],
          body: [
            [
              { content: 'Pendentes', styles: { textColor: [255, 165, 0], fontStyle: 'bold' } },
              `${data.metricStatus.percentageByStatus.countPending}`
            ],
            [
              { content: 'Confirmado', styles: { textColor: [0, 102, 204], fontStyle: 'bold' } },
              `${data.metricStatus.percentageByStatus.countScheduled}`
            ],
            [
              { content: 'Completo', styles: { textColor: [0, 153, 0], fontStyle: 'bold' } },
              `${data.metricStatus.percentageByStatus.countCompleted}`
            ],
            [
              { content: 'Não comparecido', styles: { textColor: [153, 0, 0], fontStyle: 'bold' } },
              `${data.metricStatus.percentageByStatus.countNo_show}`
            ],
            [
              { content: 'Cancelado', styles: { textColor: [96, 96, 96], fontStyle: 'bold' } },
              `${data.metricStatus.percentageByStatus.countCancelled}`
            ]
          ],
          styles: {
            fontSize: 10,
          },
          headStyles: {
            fillColor: [33, 37, 41], // dark gray header
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          theme: 'grid',
          // margin: { left: 10, right: 10 },
          // tableLineColor: [230, 230, 230],
          // tableLineWidth: 0.2,
        });


        // Tabela principal de agendamentos
        const startYTable = (doc as any).lastAutoTable.finalY + 10;

        const columns = [
          { header: 'DATA', dataKey: 'data' },
          { header: 'STATUS', dataKey: 'status' },
          { header: 'NOME', dataKey: 'name' },
          { header: 'DURAÇÃO', dataKey: 'duration' },
          { header: 'TELEFONE', dataKey: 'phone' },
          { header: 'PREÇO', dataKey: 'price' },
        ];

        const rows = data.allAppointments.map(item => ({
          data: format(item.appointmentDate, "dd/MM/yyyy"),
          status: item.status,
          name: item.name.toUpperCase(),
          duration: FormatHour(item.service.duration),
          phone: item.phone,
          price: formatCurrency(item.service.price.toString()),
        }));

        autoTable(doc, {
          startY: startYTable,
          columns,
          body: rows,
          styles: { fontSize: 8 },
          headStyles: {
            fillColor: [33, 37, 41], // dark gray header
            textColor: [255, 255, 255],
          },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Agendamentos:", 10, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(String(data.countAllAppointments), 60, finalY);

        doc.setFont('helvetica', 'bold');
        doc.text("Faturamento:", 10, finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${formatCurrency(data.allAppointments.reduce((soma, item) => soma + Number(item.service.price), 0).toString())}`, 60, finalY + 10);

        doc.save("relatorio-agendamentos.pdf");
      };

      setGeneratePDF(() => gerarPDF);
    };

    loadLibs();
  }, [data]);

  return (
    <Button onClick={generatePDF || undefined} disabled={!generatePDF} className="hover:bg-accent">
      Gerar PDF <Download />
    </Button>
  );
}
