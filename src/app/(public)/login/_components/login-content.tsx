"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { handleRegister, LoginType } from "../../_actions/login";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { TRIAL_DAYS } from "@/utils/permissions/trial-limits";
import Link from "next/link";
import { ExternalLink } from "lucide-react";


export function LoginContent() {

  async function handdleLogin(provider: LoginType) {
    await handleRegister(provider);
  }

  return (
    <Card className=" max-w-125 w-full bg-transparent">
      <CardHeader className="text-center text-accent">
        <CardTitle className="text-3xl font-semibold font-montserrat">
          Bem vindo
        </CardTitle>
        <CardDescription className="text-md">
          Entre na sua conta ou Cadatre-se <br />
          E inicie seu teste gratuito de {TRIAL_DAYS} dias
        </CardDescription>
      </CardHeader>
      <CardContent>


        <div className="grid grid-cols-1 gap-6 px-6">
          <Button
            onClick={() => handdleLogin("discord")}
            className="bg-white text-indigo-500 hover:bg-white cursor-pointer border"
          >
            Discord
            <FaDiscord />
          </Button>

          <Button
            onClick={() => handdleLogin("google")}
            className="bg-white text-primary hover:bg-white cursor-pointer border"
          >
            Google
            <FcGoogle />
          </Button>

          <Button
            onClick={() => handdleLogin("github")}
            className="bg-black hover:bg-black cursor-pointer border"
          >
            GitHub
            <FaGithub />
          </Button>
        </div>


      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={"/privacy-policy"} target="_blank" className="hover:text-accent capitalize flex items-center gap-1">
          <ExternalLink className="w-4 h-4" />  política de Privacidade
        </Link>
        <Link href={"/terms-of-service"} target="_blank" className="hover:text-accent capitalize flex items-center gap-1">
          <ExternalLink className="w-4 h-4" /> Termos de Serviço
        </Link>
      </CardFooter>
    </Card>

  )
}