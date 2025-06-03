"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import Link from "next/link";

export function CookieConsent() {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  useEffect(() => {
    const acceptedCookies = localStorage.getItem("acceptedCookies");
    if (!acceptedCookies) {
      setShowWarning(true);
    }
  }, []);

  function handleacceptedCookies() {
    localStorage.setItem("acceptedCookies", "yes");
    setShowWarning(false);
  }

  if (!showWarning) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 floatingCookies max-w-7xl mx-auto bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-[9999]"
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <div className="bg-white flex flex-col md:flex-row items-end">
        <div className="p-4">
          <h3 className="font-semibold">
            Preferências de cookies
          </h3>

          <p>
            Utilizamos cookies para oferecer a melhor experiência em nosso site, personalizar conteúdo e analisar o tráfego. Ao continuar, você concorda com o uso conforme nossa
            <Link
              href={"/cookies-policy"}
              className="font-semibold ml-1 hover:text-accent underline"
            >
              Política de Cookies
            </Link>
            {" e"}
            <Link
              href={"/privacy-policy"}
              className="font-semibold ml-1 hover:text-accent underline"
            >
              Política de Privacidade
            </Link>.
          </p>

        </div>
        <div className="space-y-4">
          <Button className="w-full hover:bg-accent" onClick={handleacceptedCookies}>
            Aceitar todos os cookies
          </Button>
        </div>
      </div>
    </div>
  )
}