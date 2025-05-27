import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/profile";
import { AssessmentContent } from "./_components/assessment-content";


export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  const user = await getUserData({ userId: session?.user?.id });


  return (
    <main className="space-y-4">
      <ProfileContent
        user={user}
      />

      <AssessmentContent
        user={user}
      />

    </main>
  )
}