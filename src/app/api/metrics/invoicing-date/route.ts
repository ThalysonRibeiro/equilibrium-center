import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getAppointments } from "@/lib/prisma/get-appointments";

export const GET = auth(async function GET(req) {
  if (!req.auth) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const startDateString = searchParams.get('start-date');
  const endDateString = searchParams.get('end-date');
  const clinicId = req.auth?.user?.id;

  if (!startDateString || !endDateString || !clinicId) {
    return NextResponse.json({ error: "Dados inválidos!" }, { status: 400 });
  }

  const [startDate, endDate] = [
    new Date(startDateString + "T00:00:00.000Z"),
    new Date(endDateString + "T23:59:59.999Z"),
  ];

  try {

    const appointments = await getAppointments({ userId: clinicId, startDate, endDate, status: 'COMPLETED' });
    const appointmentsForSixMonth = await getAppointments({ userId: clinicId, status: 'COMPLETED' });


    // Filtrar para os períodos específicos
    const specificDate = appointments.filter(appt => {
      const appointmentDate = new Date(appt.appointmentDate);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });

    const totalAppointmentSpecificDate = specificDate.length;
    const totalInvoicingspecificDate = specificDate.reduce((acc, item) => acc + item.service.price.toNumber(), 0)



    // Objeto para armazenar os totais por mês
    const sumByMonth: Record<string, number> = {};
    appointmentsForSixMonth.forEach(appt => {
      const date = new Date(appt.appointmentDate);
      // Formato YYYY-MM para agrupar por mês
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const price = appt.service.price.toNumber();

      // Acumular os valores por mês
      sumByMonth[monthKey] = (sumByMonth[monthKey] || 0) + price;
    });

    // Criar array para os últimos 12 meses
    const monthlyData = [];
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Abordagem mais segura usando o primeiro dia do mês
    for (let i = 0; i < 6; i++) {
      const targetDate = new Date();
      targetDate.setDate(1); // Define para o primeiro dia do mês
      targetDate.setMonth(targetDate.getMonth() - i);

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

      monthlyData.push({
        month: monthNames[month],
        year: year,
        total: sumByMonth[monthKey] || 0
      });
    }

    const totalSixMonth = monthlyData.reduce((acc, item) => acc + item.total, 0);

    // monthlyData.reverse();

    // Métricas para todos os agendamentos
    const totalAppointments = appointments.length;
    const totalInvoicing = appointments.reduce(
      (acc, item) => acc + item.service.price.toNumber(),
      0
    );

    return NextResponse.json({
      forSpecificDate: {
        specificDate,
        totalAppointmentSpecificDate,
        totalInvoicingspecificDate,
        startDateConsultation: startDate,
        endDateConsultation: endDate,
      },
      sixMonth: {
        monthlyData,
        totalSixMonth,
      },
      totalRevenue: {
        totalAppointments,
        totalInvoicing,
        appointments,
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar metricas!" }, { status: 400 });
  }
});