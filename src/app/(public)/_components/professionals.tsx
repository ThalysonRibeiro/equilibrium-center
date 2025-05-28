import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import Image from "next/image";
import img_test from "@/assets/img-hero.jpg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import img_form_1 from "@/assets/form-1.png";
import img_form_2 from "@/assets/form-2.png";
import { User } from "@/generated/prisma";

interface ProfessionalsProps {
  professionals: User[];
}


export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="py-6 relative bg-white">
      <div className=" w-80 h-70 absolute top-0 left-0">
        <Image
          src={img_form_1}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className=" w-80 h-70 absolute bottom-0 right-0">
        <Image
          src={img_form_2}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className="container mx-auto px-6 sm:px-1">
        <h2 className="text-primary text-3xl text-center mb-12 font-bold">
          Profissionais disponivel
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-6">
          {professionals.map(professional => (
            <Card key={professional.id} className="overflow-hidden pt-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <div>
                  <div className="relative h-50">
                    <Image
                      src={professional.image ?? img_test}
                      alt="imagem do profissional"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold capitalize">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-cinza">
                        {professional.address ? professional.address : "Endereço não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/clinica/${professional.id}`}
                  target="_blank"
                  className="bg-ring hover:bg-accent text-white w-full flex items-center justify-center py-2 px-1 rounded-md text-sm font-medium">
                  Agendar horário
                  <ArrowRight className="ml-2" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>


    </section>
  )
}