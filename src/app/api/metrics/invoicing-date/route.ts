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

    const appointments = await getAppointments({ userId: clinicId, startDate, endDate, status: 'COMPLETED', });


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
      startDate: startDate,
      endDate: endDate,
    });

  } catch (error) {
    console.error("Erro ao buscar metricaws:", error);
    return NextResponse.json({ error: "Falha ao buscar metricas!" }, { status: 400 });
  }
});