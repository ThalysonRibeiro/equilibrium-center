import { redirect } from "next/navigation";
import { SidebarDashboard } from "./_components/sidebar";
import getSession from "@/lib/getSession";
import { Toaster } from "sonner";
import { checkSubscription } from "@/utils/permissions/checkSubscription";
import { LabelSubscription } from "@/components/ui/label-subscription";

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
        {permission?.subscriptionStatus === "EXPIRED" && (
          <LabelSubscription expired={true} />
        )}
        {permission?.subscriptionStatus === "TRIAL" && (
          <div className="bg-green-500 text-white text-sm md:text-base px-3 py-4 rounded-md my-4">
            <p className="font-semibold">
              {permission.message}
            </p>
          </div>
        )}
        {children}
      </SidebarDashboard>
    </>
  )
}