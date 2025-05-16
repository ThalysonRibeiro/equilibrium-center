'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ForSpecificDateProps, MonthlyDataProps } from '../../types/invoicing-date';
import { img_base64 } from './img-logo-base64';
import { Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

interface GeneratePDFProps {
  chartData: MonthlyDataProps[];
  totalSixMonth: number;
}

export default function GeneratePDFForSixMonth({ chartData, totalSixMonth }: GeneratePDFProps) {
  const [generatePDF, setGeneratePDF] = useState<(() => void) | null>(null);

  useEffect(() => {
    const loadLibs = async () => {
      const jsPDFModule = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const jsPDF = jsPDFModule.jsPDF;

      const gerarPDF = () => {
        if (!chartData && totalSixMonth) return;

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
        doc.text("Relatório de Agendamentos dos últimos 6 meses", pageWidth / 2, yTitle, { align: 'center' });

        // Define onde a tabela começará, logo abaixo do título
        const startYTable = yTitle + 10;

        const columns = [
          { header: 'Meses', dataKey: 'Meses' },
          { header: 'Receita', dataKey: 'Receta' },
        ];

        const rows = chartData.map(item => ({
          Meses: item.month,
          Receta: formatCurrency(item.total.toString()),
        }));

        autoTable(doc, {
          startY: startYTable,
          columns,
          body: rows,
          styles: { fontSize: 12 },
          headStyles: { fillColor: [200, 200, 200] },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;



        doc.setFont('helvetica', 'bold');
        doc.text("Faturamento Total:", 10, finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(formatCurrency(totalSixMonth.toString()), 60, finalY + 10);

        doc.save("relatorio-agendamentos.pdf");
      };

      setGeneratePDF(() => gerarPDF);
    };

    loadLibs();
  }, [chartData, totalSixMonth]);

  return (
    <Button onClick={generatePDF || undefined} disabled={!generatePDF} className="hover:bg-accent">
      Gerar PDF <Download />
    </Button>
  );
}
