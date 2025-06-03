"use client"
import { FormContact } from "@/components/form-contact";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { extractPhoneNumber } from "@/utils/fomatPhone";
import { Session } from "next-auth";
import { FaWhatsapp } from "react-icons/fa6";


export function SupportContent({ session, planId }: { session: Session | null, planId: string }) {
  function supportToWhatsapp() {
    const phone = session?.user.phone || "";

    const message = `
    Olá! Seja bem-vindo(a) ao suporte [Nexus G3 Center].

    Para agilizar o atendimento, por favor, informe:

    1 - Seu nome completo
    2 - Email
    3 - Descreva brevemente o problema ou dúvida

    Nossa equipe responderá o mais breve possível.

    Obrigado pelo contato!`;

    const url = `https://wa.me/55${extractPhoneNumber(phone)}?text=${encodeURIComponent(message)}`;
    return window.open(url, "_blank");
  }
  return (
    <section className="space-y-4">
      <h1 className="text-lg text-primary text-center font-semibold">Suporte</h1>
      {planId === "PROFESSIONAL" && (
        <>
          <Button
            onClick={supportToWhatsapp}
            className="flex items-center gap-1 text-white bg-green-500 cursor-pointer">
            <FaWhatsapp />
            <p>contato direto</p>
          </Button>
          <p className="font-semibold">Horários de atendimento</p>
          <ul>
            <li>10:00 às 20:00 - Segunda a Sexta</li>
            <li>horário de Brasília (Exceto domingo e feriados)</li>
          </ul>
          <Separator />
        </>
      )}
      <h2 className="text-center font-semibold text-primary">Contato por email</h2>
      <p className="text-center text-sm">previsao de resposta 24h</p>
      <FormContact label />
    </section>
  )
}