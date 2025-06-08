"use client"

import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"
import { toast } from "sonner";
import { useState } from "react";

export function ButtonCopyLink({ userId }: { userId: string }) {
  const [isCopying, setIsCopying] = useState(false);
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopyLink() {
    if (isCopying) return;

    setIsCopying(true);

    try {
      const link = `${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`;

      // Fallback para navegadores que não suportam clipboard API
      if (!navigator.clipboard) {
        // Método alternativo usando textarea temporário
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          toast.success("Link de agendamento copiado com sucesso!");
        } catch (err) {
          toast.error("Erro ao copiar link. Tente novamente.");
        } finally {
          document.body.removeChild(textArea);
        }
        return;
      }

      await navigator.clipboard.writeText(link);
      toast.success("Link de agendamento copiado com sucesso!");

      // Feedback visual temporário
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);

    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast.error("Erro ao copiar link. Verifique as permissões do navegador.");
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <Button
      onClick={handleCopyLink}
      className="hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      disabled={isCopying}
      aria-label={
        isCopying
          ? "Copiando link de agendamento..."
          : justCopied
            ? "Link copiado com sucesso"
            : "Copiar link de agendamento"
      }
      title={
        isCopying
          ? "Copiando..."
          : justCopied
            ? "Link copiado!"
            : "Copiar link de agendamento para a área de transferência"
      }
      type="button"
    >
      {isCopying ? (
        <>
          <span className="sr-only">Copiando link...</span>
          <div
            className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <LinkIcon
            className="w-5 h-5"
            aria-hidden="true"
          />
          {justCopied && (
            <span className="sr-only">Link copiado com sucesso</span>
          )}
        </>
      )}
    </Button>
  )
}