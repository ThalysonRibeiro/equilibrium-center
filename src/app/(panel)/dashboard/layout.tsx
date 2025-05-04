import { redirect } from "next/navigation";
import { SidebarDashboard } from "./_components/sidebar";
import getSession from "@/lib/getSession";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/')
  }
  return (
    <>
      <SidebarDashboard user={session?.user}>
        {children}
      </SidebarDashboard>
    </>
  )
}