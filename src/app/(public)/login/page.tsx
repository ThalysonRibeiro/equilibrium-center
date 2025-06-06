import getSession from "@/lib/getSession";

import { LoginContent } from "./_components/login-content";
import { BackgroundIMG } from "@/components/background-img";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }
  return (
    <main className="w-full h-screen flex items-center justify-center px-6 relative">
      <BackgroundIMG />
      <LoginContent />
    </main>
  )
}