import {
  Card,
  CardContent
} from "@/components/ui/card";
import Image from "next/image";
import img_test from "@/assets/img-hero.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import img_formas from "@/assets/formas.png";
import { User } from "@/generated/prisma";

interface ProfessionalsProps {
  professionals: User[];
}


export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="py-16 relative">
      <div className=" w-full absolute h-135 -z-10 top-0">
        <Image
          src={img_formas}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-6 sm:px-1">
        <h2 className="text-3xl text-center mb-12 text-corprimary font-bold font-mansalva">
          Clinicas disponivel
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-6">
          {professionals.map(professional => (
            <Card key={professional.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div>
                  <div className="relative h-48">
                    <Image
                      src={professional.image ?? img_test}
                      alt="imagem do profissional"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 space-y-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-cinza">
                        {professional.address ?? "Endereço não informado"}
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-corprimary" />
                  </div>
                  <Link
                    href={`/clinica/${professional.id}`}
                    target="_blank"
                    className="bg-corsecondary hover:bg-corprimary w-full text-texto flex items-center justify-center py-2 px-1 rounded-md text-sm font-medium">
                    Agendar horário
                    <ArrowRight className="ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>


    </section>
  )
}