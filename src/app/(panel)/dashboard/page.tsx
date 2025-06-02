import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonCopyLink } from "./_components/button-copy-link";
import { Reminders } from "./_components/reminder/reminders";
import { Appointments } from "./_components/appointments/appointments";
import { checkSubscription } from "@/utils/permissions/checkSubscription";
import { canPermission } from "@/utils/permissions/canPermission";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  const subscription = await checkSubscription(session.user.id!);
  const permission = await canPermission({ type: "whatsapp" });

  return (
    <main>
      {subscription.subscriptionStatus === "active" && (
        <div className="space-x-2 flex items-center justify-end">
          <Link href={`/clinica/${session.user.id}`} target="_blank">
            <Button
              className="hover:bg-accent flex-1 md:flex-[0]"
            >
              <Calendar />
              <span>Novo agendamento</span>
            </Button>
          </Link>
          <ButtonCopyLink userId={session.user.id!} />
        </div>
      )}

      {subscription?.subscriptionStatus !== "EXPIRED" && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <Appointments
            userId={session.user.id!}
            permission={permission.hasPermission}
            planId={subscription?.subscriptionStatus}
          />
          <Reminders userId={session.user.id!} />
        </section>
      )}
    </main>
  );
}
