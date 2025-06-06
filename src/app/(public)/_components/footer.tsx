"use client"
import { scrollTosection } from "@/utils/scrollTosection";
import { Mail } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  quickLinks?: boolean;
  professionalOrClient?: DescriptionFooter;
}

type DescriptionFooter = "professional" | "client";

export function Footer({ quickLinks = true, professionalOrClient = "professional" }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-montserrat font-bold text-white mb-4">
              Equilibrium
              <span className="text-teal-400">Center</span>
            </h3>
            {professionalOrClient === "professional" ? (
              <p className="mb-4 text-gray-400 max-w-xs">
                Simplificando o gerenciamento de clínicas de massoterapia com um software elegante e fácil de usar.
              </p>
            ) : (
              <p className="mb-4 text-gray-400 max-w-xs">
                Central de clínicas e professionals de massoterapia com um software elegante e fácil de usar.
              </p>
            )}
          </div>

          {quickLinks && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Links rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollTosection("hero", "smooth")}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Inicio
                  </button >
                </li>
                <li>
                  <button
                    onClick={() => scrollTosection("features", "smooth")}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Características
                  </button >
                </li>
                <li>
                  <button
                    onClick={() => scrollTosection("pricing", "smooth")}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Preços
                  </button >
                </li>
                <li>
                  <button
                    onClick={() => scrollTosection("testimonials", "smooth")}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Testemunhos
                  </button >
                </li>
                <li>
                  <button
                    onClick={() => scrollTosection("faq", "smooth")}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Perguntas frequentes
                  </button >
                </li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Recursos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={"/help-center"}
                  target="_blank"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href={"/case-studies"}
                  target="_blank"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Estudos de caso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contate-nos
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-teal-400" />
                <Link
                  href={"mailto:rafinha.head@gmail.com"}
                  className="font-semibold ml-1 hover:text-accent underline"
                >
                  rafinha.head@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Equilibrium Center. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link
                href={"/privacy-policy"}
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
              >
                política de Privacidade
              </Link>
              <Link
                href={"/terms-of-service"}
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
              >
                Termos de Serviço
              </Link>
              <Link
                href={"/cookies-policy"}
                className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}