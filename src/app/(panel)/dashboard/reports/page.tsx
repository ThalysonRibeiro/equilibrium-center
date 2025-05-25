import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { BarChartMultiple } from "./_components/bar-chart-multiple";
import { PerformanceCards } from "./_components/performance-cards";
import { ContentOfTheWeekAndRank } from "./_components/Content-ofTheWeek-and-rank";
import { Suspense } from "react";
import { LoadingUI } from "@/components/ui/loading-ui";
import { getPermissionReports } from "./_data-access/get-premission-reports";
import { canPermission } from "@/utils/permissions/canPermission";
import Link from "next/link";
import { checkSubscription } from "@/utils/permissions/checkSubscription";


export default async function Reports() {

  const session = await getSession();
  if (!session) {
    redirect('/')
  }

  const subscription = await checkSubscription(session.user.id!);

  const permission = await canPermission({ type: "service" });
  const permissionReports = await canPermission({ type: "report" });


  const user = await getPermissionReports({ userId: session.user.id });
  if (!user && permission.planId === "EXPIRED") {
    return (
      <main className="flex justify-between items-center bg-red-400 text-white text-center rounded-lg p-4 shadow-md">
        <div>
          <h1>Vicê não tem permissão para acessar ess página</h1>
          <p>Assina um plano para ter acesso completo</p>
        </div>
        <Link
          href="/dashboard/plans"
          className="text-white bg-zinc-900 py-1 px-3 rounded-md w-fit h-fit"
        >
          Acessar planos
        </Link>
      </main>
    )
  }
  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold text-primary text-center">
          Dashboard - Visão geral últimos 30 dias
        </h1>

        {((permissionReports?.limitReport || []).includes("performanceCards") || subscription.planId === "TRIAL") && (
          <PerformanceCards />
        )}
        {((permissionReports?.limitReport || []).includes("barChartMultiple") || subscription.planId === "TRIAL") && (
          <BarChartMultiple />
        )}

        <ContentOfTheWeekAndRank
          limitReport={permissionReports?.limitReport || []}
          planId={subscription.planId}
        />
      </main>
    </Suspense>
  )
}