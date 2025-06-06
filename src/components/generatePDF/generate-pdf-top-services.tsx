'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { img_base64 } from './img-logo-base64';
import { Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDuration } from '@/utils/formatHour';
import { TopServiceProps } from '@/app/(panel)/dashboard/reports/types/topServices';

interface GeneratePDFTopServicesProps {
  data: TopServiceProps[];
}

export default function GeneratePDFTopServices({ data }: GeneratePDFTopServicesProps) {
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

        // Adiciona o logo
        const logoSize = 30;
        const xLogo = (pageWidth / 2) - (logoSize / 2);
        const yLogo = 10;
        doc.addImage(img_base64, 'PNG', xLogo, yLogo, logoSize, logoSize);

        // Título
        const yTitle = yLogo + logoSize + 10;
        doc.setFontSize(14);
        doc.text("Relatório: Top Serviços", pageWidth / 2, yTitle, { align: 'center' });
        doc.setFontSize(10);
        doc.text("Dados acumulados desde o início da operação", pageWidth / 2, yTitle + 8, { align: 'center' });

        // Tabela
        const startYTable = yTitle + 20;

        autoTable(doc, {
          startY: startYTable,
          head: [['Serviço', 'Vendas', 'Receita', 'Duração']],
          body: data.map((service) => [
            service.name,
            service.count.toString(),
            formatCurrency(service.totalAmount.toString()),
            formatDuration(service.totalDuration)
          ]),
          styles: {
            fontSize: 10,
          },
          headStyles: {
            fillColor: [33, 37, 41], // dark gray header
            textColor: [255, 255, 255],
          },
        });

        doc.save("relatorio-top-servicos.pdf");
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
