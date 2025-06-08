import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Toaster } from "sonner";
import { QueryClientContext } from "@/providers/queryclient";
import { CookieConsent } from "@/components/cookieConsent";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400",]
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Equilibrium Center",
  description: "Sistema de gestão completo para massoterapeutas. Agende sessões, organize clientes, controle sua agenda e aumente seus lucros com praticidade e eficiência.",
  keywords: [
    "massoterapia",
    "massoterapeuta",
    "agenda para massoterapia",
    "software para massoterapeuta",
    "sistema para massoterapia",
    "gestão de clientes massoterapia",
    "agendamento online massoterapia",
    "SaaS massoterapia",
    "plataforma para massoterapeutas",
    "controle de atendimentos massoterapia",
    "sistema de agendamento para massoterapia",
    "app para massoterapeutas",
    "organização de agenda massoterapeuta",
    "fidelização de clientes massoterapia",
    "gestão de horários massoterapia",
    "automação para clínicas de massoterapia",
    "sistema online para massoterapia",
    "agenda digital massoterapeuta",
    "software de gestão para massoterapia",
    "atendimento online massoterapia",
    "agenda de sessões de massagem",
    "software para clínicas de massoterapia",
    "massoterapia profissional",
    "gestão de agenda para massoterapeuta",
    "sistema de atendimento para massoterapia",
    "plataforma para terapeuta corporal",
    "automação para profissionais de bem-estar"
  ],
  openGraph: {
    title: "Equilibrium Center",
    images: [`${process.env.NEXT_PUBLIC_URL}/img-open.png`],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Equilibrium Center",
    description: "Sistema de gestão para massoterapeutas — organize sua agenda, clientes e atendimentos.",
    images: [`${process.env.NEXT_PUBLIC_URL}/img-open.png`],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${lato.variable} ${montserrat.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster
              position="top-right"
              richColors
            />
            <CookieConsent />
            {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
