import { getTimesClinic } from "../../_data-access/get-times-clinic"
import { AppointmentList } from "./appointment-list";

export async function Appointments({ userId }: { userId: string }) {
  const { times, userId: id } = await getTimesClinic({ userId });

  return (
    <AppointmentList times={times} />
  )
}