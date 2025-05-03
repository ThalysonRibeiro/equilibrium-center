import { Button } from "@/components/ui/button";
import Image from "next/image";
import img_bg_hero from "@/assets/bg-3.png";
import img_hero from "@/assets/img-hero.jpg";

export function Hero() {
  return (
    <section className="relative w-full h-175">
      <div className=" w-full absolute h-175 -z-10">
        <Image
          src={img_bg_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div
        className="container mx-auto sm:px-1 min-h-150 px-6"
      >

        <main className="flex flex-col lg:flex-row items-center justify-center w-full h-full gap-6 sm:pt-40 pt-20">

          <article className="z-10 pt-5 space-y-5 max-w-3xl w-full flex flex-col justify-center">
            <h1 className="text-corprimary text-7xl font-bold font-mansalva">
              Equilibrium Center
            </h1>
            <p className="text-corsecondary font-medium text-3xl">
              Bem-estar
            </p>
            <p className="text-corsecondary font-medium text-2xl">
              Saudável com perfeição
            </p>
            <p className="text-corsecondary max-w-140 text-sm">
              Mente e bem-estar. Mais do que um hub de clínicas, somos um centro integrativo que reúne profissionais qualificados em massoterapia, terapias complementares e cuidados corporais.
              Com ambientes acolhedores, atendimento humanizado e foco na saúde integral, oferecemos um ecossistema de cuidados personalizados para quem busca qualidade de vida, relaxamento e reabilitação.
            </p>
            <Button
              className="bg-corsecondary hover:bg-corprimary w-fit"
            >
              Comece gratis
            </Button>
          </article>

          <article className="hidden lg:block relative">

            <div className="absolute right-105 bottom-50 z-10 w-50 h-50 bg-white text-corsecondary font-bold border-15 border-corprimary rounded-full flex items-center justify-center text-center text-2xl p-4 capitalize">
              up to 50% off all package
            </div>

            <div className="relative w-131 h-90 border-15 border-corprimary">
              <Image
                src={img_hero}
                alt="imagem do hero inlustratica"
                fill
                priority
                quality={100}
                className="object-contain"
              />
            </div>
          </article>

        </main>

      </div>
    </section>
  )
}