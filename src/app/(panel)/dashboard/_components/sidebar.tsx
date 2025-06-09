"use client"
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  MessageCircleQuestion,
  Users,
  UserPen,
  UserCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import img_logo from "@/assets/logo-3.png";
import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/app/hooks/useMobile";

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
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut();
      await update();
      router.replace("/");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx("flex flex-col border-r transition-all duration-300 p-4 h-full z-10", {
          "w-20": isCollapsed,
          "w-74": !isCollapsed,
          "hidden md:flex md:fixed": true
        })}
        role="navigation"
        aria-label="Menu principal"
      >
        <div
          className="flex items-center rounded-lg mb-2"
          role="banner"
        >
          <div className="w-13">
            <Image
              src={img_logo}
              alt="Logo Equilibrium Center"
              priority
              quality={100}
              style={{
                width: 'auto',
                height: 'auto',
              }}
              sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
            />
          </div>
          {!isCollapsed && (
            <p className="uppercase font-montserrat font-semibold">
              Equilibrium <br />
              <span className="text-accent">
                Center
              </span>
            </p>
          )}
        </div>

        <Button
          className="hover:bg-accent self-end mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {!isCollapsed ? (
            <ChevronLeft className="w-12 h-12" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-12 h-12" aria-hidden="true" />
          )}
        </Button>

        {/* sidebar recolhida */}
        {isCollapsed && (
          <NavigationItemsMap
            isCollapsed={isCollapsed}
            pathname={pathname}
            permission={permission}
          />
        )}

        <Collapsible
          open={!isCollapsed}
          aria-label="Menu expandido"
        >
          <CollapsibleContent>
            <NavigationItemsMap
              isCollapsed={isCollapsed}
              pathname={pathname}
              permission={permission}
            />
          </CollapsibleContent>
        </Collapsible>

        <SheetFooter className="p-0 mt-auto">
          <SideBarFooter
            handleLogout={handleLogout}
            isCollapsed={isCollapsed}
            user={user}
            isLoggingOut={isLoggingOut}
          />
        </SheetFooter>
      </aside>

      {/* mobile */}
      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-74": !isCollapsed
      })}>

        <header
          className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-20 z-10 sticky top-0 bg-white shadow"
          role="banner"
        >
          <Sheet>
            <div className="flex items-center gap-2">
              <SheetTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="md:hidden border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsCollapsed(false)}
                  aria-label="Abrir menu de navegação"
                >
                  <List className="w-6 h-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <h1 className="font-montserrat">
                Menu - <span className="sr-only">Usuário:</span>{user.name}
              </h1>
            </div>

            <SheetContent
              side="right"
              className="sm:max-w-xs p-3 border-l pt-10 bg-white"
              aria-describedby="mobile-menu-description"
            >
              <SheetTitle>
                <div className="flex items-center rounded-lg mb-2">
                  <p className="uppercase font-montserrat">
                    Menu de Navegação
                  </p>
                </div>
              </SheetTitle>

              <SheetDescription id="mobile-menu-description" className="sr-only">
                Menu principal com links para agendamentos, serviços, clientes e configurações
              </SheetDescription>

              <div
                className="flex flex-col justify-between h-full"
                role="navigation"
                aria-label="Menu de navegação mobile"
              >
                <NavigationItemsMap
                  isCollapsed={false}
                  pathname={pathname}
                  permission={permission}
                />

                <SheetFooter className="p-0">
                  <SideBarFooter
                    handleLogout={handleLogout}
                    isCollapsed={false}
                    user={user}
                    isLoggingOut={isLoggingOut}
                  />
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main
          className="flex-1 py-4 px-2 md:p-6"
          role="main"
          aria-label="Conteúdo principal"
        >
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
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200",
        {
          "bg-accent text-white": isActive,
          "hover:bg-accent hover:text-white": !isActive,
        }
      )}
      title={isCollapsed ? label : undefined}
    >
      <span className="w-6 h-6 flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
      {isCollapsed && (
        <span className="sr-only">{label}</span>
      )}
    </Link>
  )
}

type NavigationItemsMapProps = Partial<SidebarLinksProps> & {
  permission: string;
};

function NavigationItemsMap({ isCollapsed, pathname, permission }: NavigationItemsMapProps) {
  const [openMenus, setOpenMenus] = useState<boolean[]>([]);

  function handleToggleMenu(index: number) {
    setOpenMenus(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  }

  useEffect(() => {
    setOpenMenus(new Array(navigationItems.length).fill(false));
  }, []);

  return (
    <nav
      className="grid gap-2 text-base"
      role="navigation"
      aria-label="Menu de navegação principal"
    >
      {navigationItems.map((link, index) => (
        <div key={link.heading}>
          {!isCollapsed && (
            <button
              id={`menu-button-${index}`}
              aria-expanded={!openMenus[index]}
              aria-controls={`menu-panel-${index}`}
              onClick={() => handleToggleMenu(index)}
              className="text-sm text-gray-400 font-medium mt-1 uppercase flex justify-between w-full items-center hover:text-gray-600 rounded px-1 py-1"
              type="button"
            >
              <span>{link.heading}</span>
              <ChevronUp
                className={clsx(
                  "text-accent transition-transform duration-200 w-4 h-4",
                  { "rotate-180": openMenus[index] }
                )}
                aria-hidden="true"
              />
            </button>
          )}

          <Collapsible
            id={`menu-panel-${index}`}
            open={!openMenus[index]}
          >
            <CollapsibleContent
              role="group"
              aria-labelledby={`menu-button-${index}`}
            >
              {link.links.map((item) => (
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
                        <div
                          className={clsx("mt-0.5", {
                            "ml-6 pl-1 border-l": !isCollapsed
                          })}
                          role="group"
                          aria-label={`Submenu de ${item.label}`}
                        >
                          {item?.subLinks?.map(subItem => (
                            <div className="mt-0.5" key={subItem.href}>
                              <SidebarLinks
                                key={subItem.href}
                                href={subItem.href}
                                label={subItem.label}
                                pathname={pathname as string}
                                isCollapsed={isCollapsed as boolean}
                                icon={subItem.icon}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
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
        href: "/dashboard/clients",
        label: "Clientes",
        icon: <UserCheck className="w-6 h-6" />
      },
      {
        href: "/dashboard/reports",
        label: "Relatórios",
        icon: <BarChart3 className="w-6 h-6" />,
        subLinks: [
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
  isLoggingOut: boolean;
}

function SideBarFooter({ user, isCollapsed, handleLogout, isLoggingOut }: SideBarFooterProps) {
  const isMobile = useIsMobile(380)

  return (
    <div
      className={clsx(
        "flex items-center justify-between p-1 rounded-lg",
        {
          "flex-col gap-3": isCollapsed,
          "bg-gray-200": !isCollapsed
        }
      )}
      role="contentinfo"
      aria-label="Informações do usuário e logout"
    >
      <div className="h-full flex items-center gap-1">
        <div className="w-12 h-10 rounded-lg overflow-hidden relative">
          <Image
            src={user?.image as string}
            alt={`Foto de perfil de ${user.name}`}
            priority
            quality={100}
            fill
            className="object-cover"
            sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col items-start w-full">
            <span
              className="text-[12px] line-clamp-1 font-medium"
              title={user.name}
            >
              {user.name}
            </span>
            {!isMobile && (
              <span
                className="text-[12px] text-gray-600"
                title={user.email}
              >
                {user.email}
              </span>
            )}
          </div>
        )}
        {isCollapsed && (
          <div className="sr-only">
            Usuário: {user.name}, Email: {user.email}
          </div>
        )}
      </div>

      <Button
        onClick={handleLogout}
        variant={"destructive"}
        className="w-fit cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        disabled={isLoggingOut}
        aria-label={isLoggingOut ? "Fazendo logout..." : "Fazer logout da conta"}
        title={isLoggingOut ? "Saindo..." : "Sair da conta"}
      >
        {isLoggingOut ? (
          <>
            <span className="sr-only">Fazendo logout...</span>
            <div
              className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
              aria-hidden="true"
            />
            Saindo...
          </>
        ) : (
          "Sair"
        )}
      </Button>
    </div>
  )
}