import { ProfessionalsContent } from "./_components/professionals-content";
import { Hero } from "./_components/hero";
import { Footer } from "../_components/footer";
import { getProfessionals } from "../_data-access/get-professionals";

export default async function Professionals() {
  const professionals = await getProfessionals();

  return (
    <main className="">
      <Hero />
      <ProfessionalsContent professionals={professionals || []} />
      <Footer />
    </main>
  )
}