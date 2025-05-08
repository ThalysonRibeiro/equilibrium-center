
import { AppointmentStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { error } from "console"
import { NextRequest, NextResponse } from "next/server"

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const dateString = searchParams.get('date') as string;
  const statusQuery = searchParams.get('status'); // pode ser 'PENDING,SCHEDULED' ou undefined
  const clinicId = req.auth?.user?.id;


  if (!dateString) {
    return NextResponse.json({ error: "Data não encontrado!" }, { status: 400 });
  }
  if (!clinicId) {
    return NextResponse.json({ error: "Usuários não encontrado!" }, { status: 400 });
  }

  try {
    const [year, month, day] = dateString.split("-").map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    let statusFilter: AppointmentStatus[];

    if (statusQuery) {
      const rawStatuses = statusQuery.split(",").map(s => s.toUpperCase());
      statusFilter = rawStatuses.filter(
        (status): status is AppointmentStatus =>
          Object.values(AppointmentStatus).includes(status as AppointmentStatus)
      );
    } else {
      // Se não foi enviado nenhum status, usa todos os disponíveis
      // statusFilter = Object.values(AppointmentStatus);
      statusFilter = [AppointmentStatus.PENDING, AppointmentStatus.SCHEDULED];
    }


    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: statusFilter,
        }
      },
      include: {
        service: true
      }
    });

    return NextResponse.json(appointments)



  } catch (error) {
    return NextResponse.json({ error: "Falha oa busacar agendamento!" }, { status: 400 });
  }
})