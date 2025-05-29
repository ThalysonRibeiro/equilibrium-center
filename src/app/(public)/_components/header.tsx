"use client"
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo-3.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react'
import { handleRegister, LoginType } from "../_actions/login";
import { FaGithub, FaDiscord, FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import img_bg_modal from "@/assets/formas.png";


interface NavItemsProps {
  href: string;
  label: string;
}

export function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bgVisible, setBgVisible] = useState<boolean>(false);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgVisible(true);
      } else {
        setBgVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navItems: NavItemsProps[] = [
    { href: "/", label: "Profissionais" },
    { href: "/", label: "Características" },
    { href: "/", label: "Preços" },
    { href: "/", label: "Testemunhos" },
    { href: "/", label: "Perguntas frequentes" },
  ];

  async function handdleLogin(provider: LoginType) {
    await handleRegister(provider);
    setDialogIsOpen(false)
  }

  const NavLinks = () => (
    <>
      {navItems.map(link => (
        <Button
          key={link.label}
          onClick={() => setIsOpen(false)}
          asChild
          variant={"ghost"}
          className=" hover:bg-transparent text-primary font-montserrat hover:text-accent"
        >
          <Link href={link.href}>
            {link.label}
          </Link>
        </Button>
      ))}

      {status === 'loading' ? (
        <>
          <div className="w-6 h-6 border-2 border-t-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </>
      ) : session ? (
        <>
          <Link href="/dashboard" className="w-full text-center font-semibold rounded-md bg-corprimary hover:bg-corsecondary py-1 px-2">
            Acessar Clinica
          </Link>
        </>
      ) : (
        <div className="space-y-2">

          <section className="w-full md:hidden space-y-4">
            <Button
              onClick={() => handdleLogin("discord")}
              className="bg-white w-50 text-indigo-500 hover:bg-white cursor-pointer"
            >
              Discord
              <FaDiscord />
            </Button>

            <Button
              onClick={() => handdleLogin("github")}
              className="bg-black w-50 hover:bg-black cursor-pointer"
            >
              GitHub
              <FaGithub />
            </Button>

            <Button
              onClick={() => handdleLogin("google")}
              className="bg-white text-primary hover:bg-white w-50 cursor-pointer"
            >
              Google
              <FcGoogle />
            </Button>
          </section>


          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild className="hidden md:block">
              <Button className="hover:bg-accent">
                Entrar ou Registrar
              </Button>
            </DialogTrigger>

            <DialogContent className="overflow-hidden bg-white/80 backdrop-blur-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-primary text-3xl text-shadow-md">Entrar ou registrar</DialogTitle>
                <DialogDescription className="text-center">
                  Selecione abaixo o metodo para entrar ou se registrar
                </DialogDescription>
              </DialogHeader>

              <div className="absolute w-135 h-90 -z-10 ">
                <Image
                  src={img_bg_modal}
                  alt="image modal login or register"
                  fill
                  className="object-contain"
                />
              </div>
              <section className="relative py-4 flex flex-col gap-4 w-full items-center justify-between">
                <Button
                  onClick={() => handdleLogin("discord")}
                  className="bg-white w-1/2 text-indigo-500 hover:bg-white cursor-pointer border"
                >
                  Discord
                  <FaDiscord />
                </Button>

                <Button
                  onClick={() => handdleLogin("github")}
                  className="bg-black w-1/2 hover:bg-black cursor-pointer border"
                >
                  GitHub
                  <FaGithub />
                </Button>

                <Button
                  onClick={() => handdleLogin("google")}
                  className="bg-white text-primary hover:bg-white w-1/2 cursor-pointer border"
                >
                  Google
                  <FcGoogle />
                </Button>
              </section>
            </DialogContent>
          </Dialog>

        </div>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-[999] py-4 px-6 ${bgVisible && 'bg-white shadow'}`}
    >
      <div className="container mx-auto flex  lg:justify-between justify-between  md:justify-center items-center">
        <Link
          href="/"
          className="hidden lg:inline-flex items-center justify-center gap-2"
        >
          <div className="relative w-15 h-13">
            <Image
              src={logo}
              alt="logo"
              quality={100}
              priority
              fill
              className="bg-contain"
            />
          </div>
          <p className="text-primary uppercase">Equilibrium <br /> Center</p>
        </Link>

        <nav className="hidden md:flex items-center">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className=" md:hidden">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="text-corprimary hover:text-corsecondary hover:bg-transparent"
            >
              <Menu className="w- h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-4 w-[240px] sm:w-300px] z-[9999]">
            <SheetTitle className="text-primary">Menu</SheetTitle>
            <nav className="flex flex-col md:flex-row items-start">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}


