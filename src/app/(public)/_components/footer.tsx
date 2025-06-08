"use client"
import { scrollTosection } from "@/utils/scrollTosection"
import { Mail } from "lucide-react"
import Link from "next/link"

interface FooterProps {
  quickLinks?: boolean
  professionalOrClient?: DescriptionFooter
}

type DescriptionFooter = "professional" | "client"

export function Footer({ quickLinks = true, professionalOrClient = "professional" }: FooterProps) {
  return (
    <footer role="contentinfo" className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Marca e descrição */}
          <div>
            <h3 className="text-xl font-montserrat font-bold text-white mb-4">
              Equilibrium <span className="text-teal-400">Center</span>
            </h3>
            <p className="mb-4 text-gray-400 max-w-xs">
              {professionalOrClient === "professional"
                ? "Simplificando o gerenciamento de clínicas de massoterapia com um software elegante e fácil de usar."
                : "Central de clínicas e profissionais de massoterapia com um software elegante e fácil de usar."}
            </p>
          </div>

          {/* Links rápidos */}
          {quickLinks && (
            <nav aria-label="Links rápidos">
              <h4 className="text-lg font-semibold text-white mb-4">Links rápidos</h4>
              <ul className="space-y-2">
                {[
                  { id: "hero", label: "Início" },
                  { id: "features", label: "Características" },
                  { id: "pricing", label: "Preços" },
                  { id: "testimonials", label: "Depoimentos" },
                  { id: "faq", label: "Perguntas frequentes" },
                ].map(({ id, label }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTosection(id, "smooth")}
                      className="cursor-pointer text-gray-400 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                      aria-label={`Ir para a seção ${label}`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Recursos */}
          <nav aria-label="Recursos">
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help-center"
                  target="_blank"
                  className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                  aria-label="Ir para a Central de Ajuda (abre em nova aba)"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  target="_blank"
                  className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                  aria-label="Ver estudos de caso (abre em nova aba)"
                >
                  Estudos de caso
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contato */}
          <section aria-label="Contato">
            <h4 className="text-lg font-semibold text-white mb-4">Contate-nos</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail
                  size={18}
                  className="mr-2 mt-1 text-teal-400"
                  aria-hidden="true"
                />
                <Link
                  href="mailto:rafinha.head@gmail.com"
                  className="font-semibold ml-1 hover:text-accent underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                  aria-label="Enviar e-mail para rafinha.head@gmail.com"
                >
                  rafinha.head@gmail.com
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Equilibrium Center. Todos os direitos reservados.
            </p>
            <nav
              aria-label="Políticas do site"
              className="flex space-x-6 text-sm"
            >
              <Link
                href="/privacy-policy"
                className="text-gray-500 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                aria-label="Política de Privacidade"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-500 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                aria-label="Termos de Serviço"
              >
                Termos de Serviço
              </Link>
              <Link
                href="/cookies-policy"
                className="text-gray-500 hover:text-teal-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                aria-label="Política de Cookies"
              >
                Política de Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
