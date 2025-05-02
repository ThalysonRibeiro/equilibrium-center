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
import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItemsProps {
  href: string;
  label: string;
}

export function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bgVisible, setBgVisible] = useState<boolean>(false);

  const session = false;

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

      {session ? (
        <>
          <Link href="/" className="text-corprimary hover:text-corsecondary">
            Acessar Clinica
          </Link>
        </>
      ) : (
        <>
          <Button
            className="bg-corsecondary hover:bg-corprimary"
          >
            Portal da Clinica
            <LogIn />
          </Button>
        </>
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


