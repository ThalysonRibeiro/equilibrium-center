"use client"
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo-3.png";
import {
  Sheet,
  SheetContent, SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useIsMobile } from "@/app/hooks/useMobile";


interface NavItemsProps {
  href: string;
  label: string;
}

export function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
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
    { href: "/login", label: "Login" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map(link => (
        <Button
          key={link.label}
          onClick={() => setIsOpen(false)}
          asChild
          variant={"link"}
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
      ) : session && (
        <>
          <Link href="/dashboard" className="w-full text-center font-semibold rounded-md bg-corprimary hover:bg-corsecondary py-1 px-2">
            Acessar Clinica
          </Link>
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="fixed z-999 top-3 left-3">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="text-corprimary hover:text-corsecondary backdrop-blur-md hover:bg-transparent border"
          >
            <Menu className="w-10 h-10" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-4 w-[240px] sm:w-300px] z-[9999]">
          <SheetTitle className="text-primary">Menu</SheetTitle>
          <nav className="flex flex-col md:flex-row items-start">
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  if (headerVisible) {
    return <FloatingMenu navItems={navItems} isOpen={setIsOpen} />
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-[999] py-4 px-6 ${headerVisible && "hidden"}`}
    >
      <div className="relative container mx-auto flex  lg:justify-between justify-between  md:justify-center items-center">
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
      </div>
    </header>
  )
}

interface FloatingMenuProps {
  navItems: NavItemsProps[];
  isOpen: Dispatch<SetStateAction<boolean>>;
}

export function FloatingMenu({ navItems, isOpen }: FloatingMenuProps) {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-999 bg-white rounded-2xl py-1 px-2 border shadow hidden md:block w-fit floatingMenu hover:border-accent">
      <div className="flex gap-2">
        {navItems.map(link => (
          <Button
            key={link.label}
            onClick={() => isOpen(false)}
            asChild
            variant={"link"}
            className=" hover:bg-transparent text-primary font-montserrat hover:text-accent"
          >
            <Link href={link.href}>
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
