import getSession from "@/lib/getSession";
import { checkSubscription } from "@/utils/permissions/checkSubscription";
import { redirect } from "next/navigation";
import { SupportContent } from "./_components/support-content";

export default async function Support() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const permission = await checkSubscription(session.user.id);


  return (
    <main className="px-4 space-y-4">
      <SupportContent session={session} planId={permission.planId} />
    </main>
  )
}