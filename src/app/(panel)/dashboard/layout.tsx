import { redirect } from "next/navigation";
import { SidebarDashboard } from "./_components/sidebar";
import getSession from "@/lib/getSession";
import { Toaster } from "sonner";
import { checkSubscription } from "@/utils/permissions/checkSubscription";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/')
  }
  const permission = await checkSubscription(session.user.id)

  return (
    <>
      <SidebarDashboard user={session?.user} permission={permission.planId}>
        <Toaster
          position="top-right"
          richColors
        />
        {children}
      </SidebarDashboard>
    </>
  )
}