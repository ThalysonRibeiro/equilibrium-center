import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@/utils/constants"
import { CircleHelp, Phone } from "lucide-react"
import Link from "next/link"

export function FAQ() {
  return (
    <section className="bg-gray-50 py-6 sm:px-1 flex flex-col items-center justify-center gap-6">
      <div className="container mx-auto px-6">
        <h2 className="text-primary text-3xl text-center font-bold">
          Perguntas frequentes
        </h2>
        <p className="text-center">
          Encontre respostas para perguntas comuns sobre nosso software de gerenciamento de clínicas de massoterapia.
        </p>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">

          {FAQ_ITEMS.map(faq => (
            <AccordionItem key={faq.id} value={faq.id} className="bg-white rounded-lg py-1 px-3 mt-4">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-xl text-primary font-semibold mb-4">
            Ainda tem dúvidas?
          </h3>
          <p className="mb-6">
            Nossa equipe de suporte está aqui para ajudar você com qualquer dúvida que você tenha sobre nossa plataforma.
          </p>
          <div className="inline-flex items-center justify-center space-x-4">
            <Link href="#" className="text-ring hover:text-accent font-medium flex items-center">
              <Phone className="text-ring" />
              Agende uma ligação
            </Link>
            <Link href="#" className="text-ring hover:text-accent font-medium flex items-center">
              <CircleHelp className="text-white fill-ring" />
              Ver Central de Ajuda
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}