import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ClientsContent } from "./_components/cliets-content";
import { checkSubscription } from "@/utils/permissions/checkSubscription";
import { canPermission } from "@/utils/permissions/canPermission";
export default async function Clients() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const subscription = await checkSubscription(session.user.id!);
  const permissionReports = await canPermission({ type: "report" });
  const permissionDownload_pdf = await canPermission({ type: "download_pdf" });

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold text-center">
        Detalhes dos Clients
      </h1>
      <ClientsContent
        planId={subscription.planId}
        download_pdf={permissionDownload_pdf.hasPermission}
        limitReport={permissionReports?.limitReport || []}
      />
    </main>
  )
} 