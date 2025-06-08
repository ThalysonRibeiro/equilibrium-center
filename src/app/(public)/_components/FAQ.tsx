import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@/utils/constants"
import { CircleHelp, Mail } from "lucide-react"
import Link from "next/link"

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-10"
    >
      <div className="w-full max-w-4xl mx-auto text-center">
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Perguntas frequentes
        </h2>
        <p className="text-gray-700 mb-6">
          Encontre respostas para perguntas comuns sobre nosso software de gerenciamento de clínicas de massoterapia.
        </p>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          aria-label="Seção de perguntas frequentes"
        >
          {FAQ_ITEMS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-lg border border-gray-200 py-2 px-4 mt-4 shadow-sm"
            >
              <AccordionTrigger
                className="text-left font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
                aria-expanded="false"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center mt-12 max-w-2xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Ainda tem dúvidas?
        </h3>
        <p className="text-gray-700 mb-6">
          Nossa equipe de suporte está aqui para ajudar com qualquer dúvida sobre nossa plataforma.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ring text-ring hover:bg-ring hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
            aria-label="Entre em contato por e-mail"
          >
            <Mail size={20} aria-hidden="true" />
            <span>Entre em contato</span>
          </Link>
          <Link
            href="/help-center"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ring text-white hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
            aria-label="Ver central de ajuda"
          >
            <CircleHelp size={20} aria-hidden="true" />
            <span>Ver Central de Ajuda</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
