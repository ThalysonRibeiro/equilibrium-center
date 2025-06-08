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
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useIsMobile } from "@/app/hooks/useMobile";
import { scrollTosection } from "@/utils/scrollTosection";
import { Session } from "next-auth";
import { redirect, usePathname } from "next/navigation";

interface NavItemsProps {
  href: string;
  label: string;
}

export function Header() {
  const pathname = usePathname();
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

  function scrollSection(link: string) {
    scrollTosection(link, "smooth");
    setIsOpen(false);
  }

  const navItems: NavItemsProps[] = [
    { href: "#hero", label: "Início" },
    { href: "#features", label: "Características" },
    { href: "#price", label: "Preços" },
    { href: "#testimonial", label: "Testemunhos" },
    { href: "#faq", label: "FAQ" },
    { href: "/professionals", label: "Profissionais" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((link) => {
        const isAnchor = link.href.startsWith("#");

        return isAnchor ? (
          <Button
            key={link.label}
            variant="link"
            className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => {
              if (pathname === "/privacy-policy" || pathname === "/cookies-policy" || pathname === "/terms-of-service") {
                redirect("/")
              }
              scrollSection(link.href.replace("#", ""))
            }}
          >
            {link.label}
          </Button>
        ) : (
          <Button
            key={link.label}
            asChild
            variant="link"
            className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}

      {status === 'loading' ? (
        <div
          className="w-6 h-6 border-2 border-t-2 border-gray-300 border-t-primary rounded-full animate-spin"
          role="status"
          aria-label="Carregando"
        >
          <span className="sr-only">Carregando...</span>
        </div>
      ) : session ? (
        <Button
          asChild
          variant="link"
          className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Link href="/dashboard">Acessar Clínica</Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="link"
          className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="fixed z-999 top-3 left-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            aria-controls="menu-lateral"
            className="hover:text-accent backdrop-blur-md hover:bg-transparent border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Menu className="w-10 h-10" />
          </Button>
        </SheetTrigger>
        <SheetContent
          id="menu-lateral"
          side="right"
          className="p-4 w-[240px] sm:w-300px] z-[9999]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <SheetTitle>Menu</SheetTitle>
          <nav
            className="flex flex-col md:flex-row items-start"
            role="navigation"
            aria-label="Menu lateral de navegação"
          >
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  if (headerVisible) {
    return <FloatingMenu navItems={navItems} session={session} status={status} />
  }

  return (
    <header className={`fixed top-0 right-0 left-0 z-[999] py-4 px-6 ${headerVisible && "hidden"}`}>
      <div className="relative container mx-auto flex lg:justify-between justify-between md:justify-center items-center">
        <Link
          href="/"
          className="hidden lg:inline-flex items-center justify-center gap-2"
        >
          <div className="relative w-15 h-13">
            <Image
              src={logo}
              alt="Logotipo da clínica Equilibrium Center"
              quality={100}
              priority
              fill
              className="bg-contain"
            />
          </div>
          <p className="uppercase text-primary">Equilibrium <br /> Center</p>
        </Link>

        <nav
          className="hidden md:flex items-center"
          role="navigation"
          aria-label="Navegação principal"
        >
          <NavLinks />
        </nav>
      </div>
    </header>
  )
}

interface FloatingMenuProps {
  navItems: NavItemsProps[];
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export function FloatingMenu({ navItems, session, status }: FloatingMenuProps) {
  return (
    <div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-999 bg-white rounded-2xl py-1 px-2 border shadow hidden md:block w-fit floatingMenu hover:border-accent"
      role="navigation"
      aria-label="Menu flutuante de navegação"
    >
      <div className="flex gap-2">
        {navItems.map((link) => {
          const isAnchor = link.href.startsWith("#");

          return isAnchor ? (
            <Button
              key={link.label}
              variant="link"
              className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => scrollTosection(link.href.replace("#", ""), "smooth")}
            >
              {link.label}
            </Button>
          ) : (
            <Button
              key={link.label}
              asChild
              variant="link"
              className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          );
        })}
        {status === 'loading' ? (
          <div
            className="w-6 h-6 border-2 border-t-2 border-gray-300 border-t-primary rounded-full animate-spin"
            role="status"
            aria-label="Carregando"
          >
            <span className="sr-only">Carregando...</span>
          </div>
        ) : session ? (
          <Button
            asChild
            variant="link"
            className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Link href="/dashboard">Acessar Clínica</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="link"
            className="hover:bg-transparent font-montserrat hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
