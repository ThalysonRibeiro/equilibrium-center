import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 text-cinza border-t border-cinza">
      <div className="flex items-center justify-center gap-6">
        <Link href={'/'} className="hover:text-corprimary">
          Sobre
        </Link>
        <Link href={'/'} className="hover:text-corprimary">
          Contato
        </Link>
        <Link href={'/'} className="hover:text-corprimary">
          Termos e serviços
        </Link>
        <Link href={'/'} className="hover:text-corprimary">
          Privacidade
        </Link>
      </div>
      <p className="text-center mt-4">
        Todos os direitos reservados &copy; {new Date().getFullYear()} - Rada.Dev
      </p>
    </footer>
  )
}