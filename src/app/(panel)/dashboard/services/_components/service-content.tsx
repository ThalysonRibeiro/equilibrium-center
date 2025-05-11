import { getAllServices } from "../_data-access/get-all-services";
import { getAllServicesActive } from "../_data-access/get-all-services-active";
import { AllServiceList } from "./all-service-list";
import { ServicesList } from "./services-list";

interface ServicesContentProps {
  userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {
  const services = await getAllServicesActive({ userId });
  const allServices = await getAllServices({ userId });

  return (
    <section className="space-y-4">
      <ServicesList services={services.data || []} />
      <AllServiceList services={allServices.data || []} />
    </section>
  )
}