import { auth } from "@/lib/auth";
import { NextResponse } from 'next/server';
import { getCompletedAppointmentsByDateRange } from '@/app/(panel)/dashboard/reports/_data-access/get-invoicing-date';
import { getAllAppointments } from "@/app/(panel)/dashboard/reports/_data-access/get-all-appointments";

export const GET = auth(async function GET(req) {
  if (!req.auth) return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const startDateString = searchParams.get('start-date');
  const endDateString = searchParams.get('end-date');
  const clinicId = req.auth?.user?.id;

  if (!startDateString || !endDateString || !clinicId) {
    return NextResponse.json({ error: "Dados inválidos!" }, { status: 400 });
  }

  const [start, end] = [
    new Date(startDateString + "T00:00:00.000Z"),
    new Date(endDateString + "T23:59:59.999Z"),
  ];

  try {

    const appointments = await getAllAppointments(clinicId, start, end);

    // Métricas para todos os agendamentos
    const totalAppointments = appointments.length;
    const totalInvoicing = appointments.reduce(
      (acc, item) => acc + item.service.price.toNumber(),
      0
    );

    return NextResponse.json({
      appointments,
      totalAppointments,
      totalInvoicing,
      startDate: start,
      endDate: end,
    });

  } catch (error) {
    console.error("Erro ao buscar metricaws:", error);
    return NextResponse.json({ error: "Falha ao buscar metricas!" }, { status: 400 });
  }
});