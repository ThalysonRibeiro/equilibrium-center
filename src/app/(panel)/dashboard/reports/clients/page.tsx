import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { LoadingUI } from "@/components/ui/loading-ui";
import { AllAppointmentClient } from "./_components/all-appointments-client";
import { Suspense } from "react";
import { canPermission } from "@/utils/permissions/canPermission";
import { checkSubscription } from "@/utils/permissions/checkSubscription";

export default async function Clients() {
  const session = await getSession();
  if (!session) {
    redirect('/')
  }
  const subscription = await checkSubscription(session.user.id!);

  const permissionReports = await canPermission({ type: "report" });
  const permissionDownload_pdf = await canPermission({ type: "download_pdf" });
  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <AllAppointmentClient
        limitReport={permissionReports?.limitReport || []}
        download_pdf={permissionDownload_pdf.hasPermission}
        planId={subscription.planId}
      />
    </Suspense>
  )
}