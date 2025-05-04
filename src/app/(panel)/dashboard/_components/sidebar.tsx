"use client"

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription, SheetFooter, SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, FileText, Folder, List, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import img_logo from "@/assets/logo.png";
import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";

interface SidebarDashboardProps {
  children: React.ReactNode
  user: UserProps
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified?: null | string | boolean;
  image?: string;
  address?: string;
  phone?: string;
  status: boolean;
  stripe_customer_id?: string | null;
  subscriptionId?: string | null;
  createdAt: string;
  updatedAt: string;
}



export function SidebarDashboard({ children, user }: SidebarDashboardProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);


  return (
    <div className="flex min-h-screen w-full">

      <aside
        className={clsx("flex flex-col border-r border-cinza transition-all duration-300 p-4 h-full", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true
        })}
      >
        <div className="mb-6 mt-6 w-12">
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
        <Button
          className="bg-corprimary hover:bg-corsecondary self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className="w-12 h-12" /> : <ChevronRight className="w-12 h-12" />}
        </Button>

        {/* sidebar recolhida */}
        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            <SidebarLinks
              href="/dashboard"
              label="Agendamentos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<CalendarCheck2 className="w-6 h-6 text-corprimary" />}
            />
            <SidebarLinks
              href="/dashboard/services"
              label="Serviços"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Folder className="w-6 h-6 text-corprimary" />}
            />
            <SidebarLinks
              href="/dashboard/reports"
              label="Relatorios"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<FileText className="w-6 h-6 text-corprimary" />}
            />
            <SidebarLinks
              href="/dashboard/profile"
              label="Perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Settings className="w-6 h-6 text-corprimary" />}
            />
            <SidebarLinks
              href="/dashboard/plans"
              label="Planos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Banknote className="w-6 h-6 text-corprimary" />}
            />
          </nav>

        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Painel
              </span>
              <SidebarLinks
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className="w-6 h-6 text-corprimary" />}
              />
              <SidebarLinks
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-6 h-6 text-corprimary" />}
              />
              <SidebarLinks
                href="/dashboard/reports"
                label="Relatorios"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<FileText className="w-6 h-6 text-corprimary" />}
              />

              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Minha conta
              </span>
              <SidebarLinks
                href="/dashboard/profile"
                label="Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-6 h-6 text-corprimary" />}
              />
              <SidebarLinks
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-6 h-6 text-corprimary" />}
              />

              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                Outros
              </span>
            </nav>

          </CollapsibleContent>
        </Collapsible>

        <SheetFooter className="p-0">
          {!isCollapsed && <p className="text-sm">{user.name}</p>}
          <div className={`${isCollapsed && 'flex-col-reverse'} flex items-center justify-between`}>
            <Button
              variant={"ghost"}
              className="border border-corprimary hover:text-white hover:bg-red-500"
            >
              Sair
            </Button>
            <div className="mb-6 mt-6 w-12 rounded-full overflow-hidden border border-corprimary">
              <Image
                src={user?.image as string}
                alt="logo"
                priority
                quality={100}
                width={48}
                height={48}
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </SheetFooter>
      </aside>


      {/* mobile */}
      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>

        <header className="md:hidden flex items-center justify-between border-b border-b-cinza px-2 md:px-6 h-14 z-10 sticky bg-white">
          <Sheet>
            <div>
              <SheetTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="md:hidden"
                  onClick={() => setIsCollapsed(false)}
                >
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <h1 className="text-black font-open_Sans">Menu - Equilibrium Center</h1>
            </div>

            <SheetContent side="right" className="sm:max-w-xs p-5">
              <SheetTitle>Equilibrium Center</SheetTitle>
              <SheetDescription>Menu administrativo</SheetDescription>
              <nav className="grid gap-2 text-base">
                <SidebarLinks
                  href="/dashboard"
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<CalendarCheck2 className="w-6 h-6 text-corprimary" />}
                />
                <SidebarLinks
                  href="/dashboard/services"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Folder className="w-6 h-6 text-corprimary" />}
                />
                <SidebarLinks
                  href="/dashboard/profile"
                  label="Perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Settings className="w-6 h-6 text-corprimary" />}
                />
                <SidebarLinks
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Banknote className="w-6 h-6 text-corprimary" />}
                />
              </nav>
            </SheetContent>

          </Sheet>


        </header>

        <main className="flex-1 py-4 px-2 md:p-6">
          {children}
        </main>

      </div>
    </div>
  )
}

interface SidebarLinksProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarLinks({ href, icon, label, isCollapsed, pathname }: SidebarLinksProps) {
  return (
    <Link
      href={href}
    >
      <div className={clsx("flex items-center gap-2  px-3 py-2 rounded-md", {
        "bg-corsecondary": pathname === href,
        "text-white hover:bg-corsecondary": pathname !== href,
      })}>
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  )
}