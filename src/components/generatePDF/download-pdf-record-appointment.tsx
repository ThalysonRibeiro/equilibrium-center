'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatCurrency';
import { AppointmentWithService } from '../../app/(panel)/dashboard/reports/types/allApponitments';
import { img_base64 } from './img-logo-base64';

interface GeneratePDFProps {
  data: AppointmentWithService | null;
}

export default function DownloadPDFRecordAppointment({ data }: GeneratePDFProps) {
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

        // Logo e título
        const logoSize = 30;
        const xLogo = (pageWidth / 2) - (logoSize / 2);
        const yLogo = 10;
        doc.addImage(img_base64, 'PNG', xLogo, yLogo, logoSize, logoSize);

        const yTitle = yLogo + logoSize + 10;
        doc.setFontSize(14);
        doc.text("Relatório de Agendamento", pageWidth / 2, yTitle, { align: 'center' });

        let yStart = yTitle + 10;

        // Tabela com dados
        autoTable(doc, {
          startY: yStart,
          head: [['Campo', 'Valor']],
          body: [
            ['Horário agendado', data.time],
            ['Data do agendamento', new Intl.DateTimeFormat('pt-BR', {
              timeZone: "UTC",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(data.appointmentDate))],
            ['Nome', data.name],
            ['Telefone', data.phone],
            ['Email', data.email],
            ['Idade', data.age ?? 'Não informado'],
            ['Data de nascimento', format(new Date(data.dateOfBirth || '1900-01-01'), 'dd/MM/yyyy')],
            ['Sintomas', data.symptoms || 'Não informado'],
            ['Sintomas secundários', data.secondary || 'Não informado'],
            ['Histórico dessas queixas', data.complaints || 'Não informado'],
            ['Uso de medicação', data.useOfAnyMedication || 'Não'],
            ['Gravidez', data.bePregnant || 'Não'],
            ['Atividades físicas', data.eatingRoutine || 'Não'],
            ['Rotina alimentar', data.physicalActivities || 'Não informado'],
            ['Serviço', data.service.name],
            ['Valor', formatCurrency(data.service.price.toString())],
          ],
          styles: { fontSize: 10 },
          headStyles: {
            fillColor: [33, 37, 41], // dark gray header
            textColor: [255, 255, 255],
          },
        });

        doc.save(`agendamento-${data.name}.pdf`);
      };

      setGeneratePDF(() => gerarPDF);
    };

    loadLibs();
  }, [data]);

  return (
    <Button onClick={generatePDF || undefined} disabled={!generatePDF} variant={'ghost'} className="border w-fit hover:bg-accent cursor-pointer">
      Download PDF <Download className="ml-2 w-4 h-4" />
    </Button>
  );
}
