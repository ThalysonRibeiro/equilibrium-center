import { canPermission } from "@/utils/permissions/canPermission";
import { getAllServices } from "../_data-access/get-all-services";
import { getAllServicesActive } from "../_data-access/get-all-services-active";
import { AllServiceList } from "./all-service-list";
import { ServicesList } from "./services-list";
import { LabelSubscription } from "@/components/ui/label-subscription";

interface ServicesContentProps {
  userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {
  const services = await getAllServicesActive({ userId });
  const allServices = await getAllServices({ userId });
  const permission = await canPermission({ type: "service" });

  return (
    <section className="space-y-4">

      {permission.planId === "TRIAL" && (
        <div>
          <h3>
            Você está no seu periodo de teste!
          </h3>
        </div>
      )}

      {!permission.hasPermission && (
        <LabelSubscription expired={permission.expired} />
      )}
      <ServicesList services={services.data || []} permission={permission} />

      {(permission.planId === "NORMAL" || permission.planId === "PROFESSIONAL") &&
        <AllServiceList services={allServices.data || []} />
      }
    </section>
  )
}