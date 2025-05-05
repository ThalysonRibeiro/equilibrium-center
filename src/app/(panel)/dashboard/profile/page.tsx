import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/profile";
import { getListHoursData } from "./_data-access/get-list-hours";
// import { setupInitialSchedule } from "./_actions/create-list-hours";

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  const user = await getUserData({ userId: session?.user?.id });
  // const hours = await setupInitialSchedule(6)
  const listSchedules = await getListHoursData();

  // console.log(listSchedules);




  return (
    <section>
      <ProfileContent
        listHours={listSchedules?.Hours || []}
        user={user}
      />
    </section>
  )
}