import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-ingo-schedule"
import { ScheduleContent } from "./_components/schedule-content";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const userId = (await params).id
  const user = await getInfoSchedule({ userId: userId });


  if (!user) {
    redirect("/");
  }
  return (
    <ScheduleContent clinic={user} />
  )
}