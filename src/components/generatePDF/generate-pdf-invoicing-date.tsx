'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ForSpecificDateProps } from '../../app/(panel)/dashboard/reports/types/invoicing-date';
import { img_base64 } from './img-logo-base64';
import { Download } from 'lucide-react';
import { FormatHour } from '@/utils/formatHour';
import { formatCurrency } from '@/utils/formatCurrency';

interface GeneratePDFProps {
  data: ForSpecificDateProps | undefined;
}

export default function GeneratePDFInvoicingDate({ data }: GeneratePDFProps) {
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

        const logoSize = 30; // tamanho do logo em mm
        const xLogo = (pageWidth / 2) - (logoSize / 2); // centralizado horizontalmente
        const yLogo = 10;

        // Adiciona o banner (logo) centralizado
        doc.addImage(img_base64, 'PNG', xLogo, yLogo, logoSize, logoSize);

        // Posição do texto abaixo da imagem
        const yTitle = yLogo + logoSize + 10;

        doc.setFontSize(14);
        doc.text("Relatório de Agendamentos", pageWidth / 2, yTitle, { align: 'center' });

        // Define onde a tabela começará, logo abaixo do título
        const startYTable = yTitle + 10;

        const columns = [
          { header: 'Nome', dataKey: 'name' },
          { header: 'Serviço', dataKey: 'service' },
          { header: 'Duração', dataKey: 'duration' },
          { header: 'Preço', dataKey: 'price' },
        ];

        const rows = data.specificDate.map(item => ({
          name: item.name.toUpperCase(),
          service: item.service.name,
          duration: FormatHour(item.service.duration),
          price: formatCurrency(item.service.price),
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
        doc.text("Agendamentos Totais:", 10, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(String(data.totalAppointmentSpecificDate), 60, finalY);

        doc.setFont('helvetica', 'bold');
        doc.text("Faturamento Total:", 10, finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(`R$ ${data.totalInvoicingspecificDate.toFixed(2).replace('.', ',')}`, 60, finalY + 10);

        doc.save("relatorio-agendamentos.pdf");
      };

      setGeneratePDF(() => gerarPDF);
    };

    loadLibs();
  }, [data]);

  return (
    <Button onClick={generatePDF || undefined} disabled={!generatePDF} className="hover:bg-accent w-fit">
      Gerar PDF <Download />
    </Button>
  );
}
