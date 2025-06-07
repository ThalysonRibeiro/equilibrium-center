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
import Image from "next/image";
import img_logo from "@/assets/logo-3.png";



export function LoginContent() {
  async function handdleLogin(provider: LoginType) {
    await handleRegister(provider);
  }
  return (
    <Card className="max-w-100 shadow-md w-full bg-transparent">
      <CardHeader>
        <div className="flex w-full justify-center gap-2">
          <div className="w-14">
            <Image
              src={img_logo}
              alt="logo"
              priority
              quality={100}
              style={{
                width: 'auto',
                height: 'auto',
              }}
            />
          </div>
          <div>
            <span className="font-semibold capitalize text-xl">
              Equilibrium Center
            </span>
            <p className="text-sm">
              Sistema de Gestão para Clínicas
            </p>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold text-center">
          Bem vindo
        </CardTitle>
        <CardDescription className="text-md text-center">
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
            className="bg-white text-black hover:bg-white cursor-pointer border"
          >
            Google
            <FcGoogle />
          </Button>

          {/* <Button
            onClick={() => handdleLogin("github")}
            className="bg-black hover:bg-black cursor-pointer border"
          >
            GitHub
            <FaGithub />
          </Button> */}
        </div>


      </CardContent>
      <CardFooter className="flex justify-between">

      </CardFooter>
    </Card>

  )
}