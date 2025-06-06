import getSession from "@/lib/getSession";
import { LoginContent } from "./_components/login-content";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }
  return (
    <main className="container mx-auto h-screen flex flex-col items-center justify-center">
      <LoginContent />


      <div className="flex space-x-2 mt-6">
        <Link
          target="_blank"
          href={"/privacy-policy"}
          className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
        >
          política de Privacidade
        </Link>
        <Link
          target="_blank"
          href={"/terms-of-service"}
          className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
        >
          Termos de Serviço
        </Link>
        <Link
          target="_blank"
          href={"/cookies-policy"}
          className="text-sm text-gray-500 hover:text-teal-400 transition-colors"
        >
          Política de Cookies
        </Link>
      </div>
    </main>
  )
}