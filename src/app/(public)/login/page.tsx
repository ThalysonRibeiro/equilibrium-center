import Image from "next/image";
import { LoginContent } from "./_components/login-content";
import { BackgroundIMG } from "@/components/background-img";

export default function Login() {
  return (
    <main className="w-full h-screen flex items-center justify-center px-6 relative">
      <BackgroundIMG />
      <LoginContent />
    </main>
  )
}