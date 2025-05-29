import { Mail, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-montserrat font-bold text-white mb-4">
              Equilibrium
              <span className="text-teal-400">Center</span>
            </h3>
            <p className="mb-4 text-gray-400 max-w-xs">
              Simplificando o gerenciamento de clínicas de massoterapia com um software elegante e fácil de usar.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaFacebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaTwitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaInstagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <FaYoutube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Testemunhos
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Blogue
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Estudos de caso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-teal-400" />
                <span>support@serenebook.com</span>
              </li>
              <li className="flex items-start">
                <PhoneCall size={18} className="mr-2 mt-1 text-teal-400" />
                <span>+55 (65) 98127-8291</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-teal-400" />
                <span>Rua José do Patrocínio, 4374<br />Natal-RN, CEP 59125-102</span>
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
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">
                política de Privacidade
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}