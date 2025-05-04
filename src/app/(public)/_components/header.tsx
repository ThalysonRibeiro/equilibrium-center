"use client"
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
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
import { handleRegister } from "../_actions/login";
import { FaGithub, FaDiscord, FaYinYang } from "react-icons/fa6";
import img_bg_modal from "@/assets/1.png";


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
    { href: "/contatos", label: "Contatos" },
  ];

  async function handdleLogin(provider: string) {
    await handleRegister(provider);
    setDialogIsOpen(false)
  }

  const NavLinks = () => (
    <>
      {navItems.map(link => (
        <Button
          key={link.href}
          onClick={() => setIsOpen(false)}
          asChild
          className="bg-transparent hover:bg-transparent text-corprimary hover:text-corsecondary shadow-none"
        >
          <Link href={link.href}>
            {link.label}
          </Link>
        </Button>
      ))}

      {status === 'loading' ? (
        <><p className="text-black font-semibold inline-flex gap-2"><FaYinYang size={22} className="animate-spin" /> loading...</p></>
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
              className="border border-corprimary bg-white w-50 text-indigo-500 hover:bg-corprimary"
            >
              Discord
              <FaDiscord />
            </Button>

            <Button
              onClick={() => handdleLogin("github")}
              className="border border-corprimary hover:bg-corprimary w-50"
            >
              GitHub
              <FaGithub />
            </Button>
          </section>


          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild className="hidden md:block">
              <Button className="bg-corsecondary hover:bg-corprimary">
                Entrar ou Registrar
              </Button>
            </DialogTrigger>

            <DialogContent className="border-corprimary h-70 overflow-hidden bg-background/70  backdrop-blur-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-corprimary text-3xl font-mansalva text-shadow-md">Entrar ou registrar</DialogTitle>
                <DialogDescription className="text-center text-corprimary">
                  Selecione abaixo o metodo para entrar ou se registrar
                </DialogDescription>
              </DialogHeader>

              <div className="absolute w-135 h-100 -z-10 ">
                <Image
                  src={img_bg_modal}
                  alt="image modal login or register"
                  fill
                  className="objecti-cover"
                />
              </div>
              <section className="relative py-4 flex gap-4 w-full items-center justify-between">

                <Button
                  onClick={() => handdleLogin("discord")}
                  className="border border-corprimary bg-white w-50 text-indigo-500 hover:bg-corprimary"
                >
                  Discord
                  <FaDiscord />
                </Button>

                <Button
                  onClick={() => handdleLogin("github")}
                  className="border border-corprimary hover:bg-corprimary w-50"
                >
                  GitHub
                  <FaGithub />
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
      className={`fixed top-0 right-0 left-0 z-[999] py-4 px-6 ${bgVisible && 'bg-white/90'}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2"
        >
          <Image
            src={logo}
            alt="logo"
            width={60}
            height={60}
          />
          <p className="text-corsecondary uppercase">Equilibrium <br /> Center</p>
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
            <SheetTitle>Menu</SheetTitle>
            <SheetHeader>
              <Image
                src={logo}
                alt="logo"
                width={60}
                height={60}
              />
            </SheetHeader>
            <SheetDescription>Veja nossos links</SheetDescription>
            <nav className="flex flex-col md:flex-row items-start">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}


