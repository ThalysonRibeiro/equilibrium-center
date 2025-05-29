import Image from "next/image";
import img_bg_hero from "@/assets/bg-3.png";
import { LoginContent } from "./_components/login-content";

export default function Login() {
  return (
    <main className="w-full h-screen flex items-center justify-center px-6 relative">
      <div className=" w-full absolute h-screen -z-1">
        <Image
          src={img_bg_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <LoginContent />
    </main>
  )
}