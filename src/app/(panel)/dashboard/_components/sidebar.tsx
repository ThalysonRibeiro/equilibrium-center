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
import {
  Banknote, CalendarCheck2, ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Folder,
  List,
  Settings,
  User,
  BarChart3,
  MessageCircleQuestion
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import img_logo from "@/assets/logo2.svg";
import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarDashboardProps {
  children: React.ReactNode;
  user: UserProps;
  permission: string;
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

export function SidebarDashboard({ children, user, permission }: SidebarDashboardProps) {
  const { update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  async function handleLogout() {
    await signOut();
    await update();
    router.replace("/")
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx("flex flex-col border-r transition-all duration-300 p-4 h-full bg-white z-10", {
          "w-20": isCollapsed,
          "w-74": !isCollapsed,
          "hidden md:flex md:fixed": true
        })}
      >
        <div className="flex items-center rounded-lg mb-2">
          <div className="w-20">
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
          {!isCollapsed && <p className="uppercase font-montserrat text-primary">Equilibrium <br /> Center</p>}
        </div>
        <Button
          className="hover:bg-accent self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className="w-12 h-12" /> : <ChevronRight className="w-12 h-12" />}
        </Button>

        {/* sidebar recolhida */}
        {isCollapsed && (
          <NavigationItemsMap isCollapsed={isCollapsed} pathname={pathname} permission={permission} />
        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <NavigationItemsMap isCollapsed={isCollapsed} pathname={pathname} permission={permission} />
          </CollapsibleContent>
        </Collapsible>

        <SheetFooter className="p-0">
          <SideBarFooter handleLogout={handleLogout} isCollapsed={isCollapsed} user={user} />
        </SheetFooter>
      </aside>

      {/* mobile */}
      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-74": !isCollapsed
      })}>

        <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-20 z-10 sticky top-0 bg-white">
          <Sheet>
            <div className="flex items-center gap-2">
              <SheetTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="md:hidden border bg-transparent"
                  onClick={() => setIsCollapsed(false)}
                >
                  <List className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <h1 className="text-primary font-montserrat">Menu - Equilibrium Center</h1>
            </div>

            <SheetContent side="right" className="sm:max-w-xs p-3 border-l pt-10 bg-white">
              <SheetTitle>
                <div className="flex items-center rounded-lg mb-2">
                  <div className="w-12">
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
                  <p className="text-primary uppercase font-montserrat">Equilibrium <br /> Center</p>
                </div>
              </SheetTitle>
              <SheetDescription>Menu administrativo</SheetDescription>
              <div className="flex flex-col justify-between h-full">

                <NavigationItemsMap isCollapsed={isCollapsed} pathname={pathname} permission={permission} />

                <SheetFooter className="p-0">
                  <SideBarFooter handleLogout={handleLogout} isCollapsed={isCollapsed} user={user} />
                </SheetFooter>

              </div>
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
      <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-white", {
        "bg-accent text-white": pathname === href,
        "text-primary": pathname !== href,
      })}>
        <span className="w-6 h-6 text-muted">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  )
}

type NavigationItemsMapProps = Partial<SidebarLinksProps> & {
  permission: string;
};

function NavigationItemsMap({ isCollapsed, pathname, permission }: NavigationItemsMapProps) {
  return (
    <nav className="grid gap-2 text-base">
      {navigationItems.map(link => (
        <div key={link.heading}>
          {!isCollapsed && (
            <span
              key={link.heading}
              className="text-sm text-gray-400 font-medium mt-1 uppercase"
            >
              {link.heading}
            </span>)}
          {link.links.map(item => (
            <div key={item.href} className="mt-0.5">
              <SidebarLinks
                href={item.href}
                label={item.label}
                pathname={pathname as string}
                isCollapsed={isCollapsed as boolean}
                icon={item.icon}
              />
              {["TRIAL", "NORMAL", "PROFESSIONAL"].includes(permission) && (
                <>
                  {item.subLinks && item.subLinks.length > 0 && (
                    <div className={`${isCollapsed ? "mt-0.5" : "ml-6 pl-1 mt-0.5 border-l"}`}>
                      {item?.subLinks?.map(item => (
                        <div className="mt-0.5" key={item.href}>
                          <SidebarLinks
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            pathname={pathname as string}
                            isCollapsed={isCollapsed as boolean}
                            icon={item.icon}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}

const navigationItems = [
  {
    heading: "Painel",
    links: [
      {
        href: "/dashboard",
        label: "Agendamentos",
        icon: <CalendarCheck2 className="w-6 h-6" />
      },
      {
        href: "/dashboard/services",
        label: "Serviços",
        icon: <Folder className="w-6 h-6" />
      },
      {
        href: "/dashboard/reports",
        label: "Relatorios",
        icon: <BarChart3 className="w-6 h-6" />,
        subLinks: [
          {
            href: "/dashboard/reports/client",
            label: "Clientes",
            icon: <User className="w-6 h-6" />
          },
          {
            href: "/dashboard/reports/invoicing",
            label: "Faturamento",
            icon: <CircleDollarSign className="w-6 h-6" />
          }
        ]
      }
    ]
  },
  {
    heading: "Minha conta",
    links: [
      {
        href: "/dashboard/profile",
        label: "Perfil",
        icon: <Settings className="w-6 h-6" />
      },
      {
        href: "/dashboard/plans",
        label: "Planos",
        icon: <Banknote className="w-6 h-6" />
      }
    ]
  },
  {
    heading: "Outros",
    links: [
      {
        href: "/dashboard/support",
        label: "Suporte",
        icon: <MessageCircleQuestion className="w-6 h-6" />
      }
    ]
  }
];

interface SideBarFooterProps {
  user: UserProps;
  isCollapsed: boolean;
  handleLogout: () => void;
}

function SideBarFooter({ user, isCollapsed, handleLogout }: SideBarFooterProps) {
  return (
    <div className={`${isCollapsed && 'flex-col gap-3'} flex items-center justify-between ${isCollapsed ? "" : 'bg-accent text-white'} p-1 rounded-lg`}>
      <div className="h-full flex items-center gap-1">
        <div className="w-12 rounded-lg overflow-hidden">
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
        {!isCollapsed && <div className="flex flex-col items-start w-full">
          <span className="text-[12px] line-clamp-1">{user.name}</span>
          <span className="text-[12px]">{user.email}</span>
        </div>}
      </div>
      <Button
        onClick={handleLogout}
        className="w-fit cursor-pointer"
      >
        Sair
      </Button>
    </div>
  )
}