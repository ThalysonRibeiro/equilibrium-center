import { getProfessionals } from "./_data-access/get-professionals";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { Pricing } from "./_components/pricing";
import { Testimonials } from "./_components/testimonials";
import { FAQ } from "./_components/FAQ";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/footer";
import { CookieConsent } from "@/components/cookieConsent";

export const revalidate = 120;

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative">
        <CookieConsent />

        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
