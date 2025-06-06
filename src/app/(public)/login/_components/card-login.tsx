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


export function CardLogin() {
  async function handdleLogin(provider: LoginType) {
    await handleRegister(provider);
  }

  return (
    <Card className=" max-w-100 shadow-md w-full bg-transparent">
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
            className="bg-white hover:bg-white cursor-pointer border"
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

      </CardFooter>
    </Card>

  )
}