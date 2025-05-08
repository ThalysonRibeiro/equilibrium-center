import Image from "next/image";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/professionals";
import img_1 from "@/assets/1.png";
import { getProfessionals } from "./_data-access/get-professionals";

export const revalidate = 120;

export default async function Home() {
  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <Hero />
        <Professionals professionals={professionals || []} />
        <section className="container mx-auto px-6 sm:px-1 flex items-center justify-between gap-6 w-full">
          <div className="w-125 space-y-4 flex-1 p-6">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus repellendus omnis in eaque consequatur nulla, aspernatur sequi ipsa aut quasi voluptatum placeat quia blanditiis fugit, officiis dicta quibusdam, a rem!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus repellendus omnis in eaque consequatur nulla, aspernatur sequi ipsa aut quasi voluptatum placeat quia blanditiis fugit, officiis dicta quibusdam, a rem!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus repellendus omnis in eaque consequatur nulla, aspernatur sequi ipsa aut quasi voluptatum placeat quia blanditiis fugit, officiis dicta quibusdam, a rem!
            </p>
          </div>
          <div className="flex-1 flex items-center justify-end p-6">
            <div className="relative w-125 h-85 border-10 rounded-xl overflow-hidden">
              <Image
                src={img_1}
                alt="imagem do hero inlustratica"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
