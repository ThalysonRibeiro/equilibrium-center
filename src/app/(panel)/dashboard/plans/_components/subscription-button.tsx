"use client"
import { Button } from "@/components/ui/button";
import { createSubscription } from "../_actions/create-subscriptions";
import { toast } from "sonner";
import { getStripeJs } from "@/utils/stripe-js";
import { StripePlan } from "@/utils/plans/plans";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SubscriptionButtonProps {
  type: StripePlan;
  "aria-label"?: string;
  planName?: string;
  planPrice?: string;
  disabled?: boolean;
}

export function SubscriptionButton({
  type,
  "aria-label": ariaLabel,
  planName,
  planPrice,
  disabled = false
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Determinar o estilo do botão baseado no tipo do plano
  const isNormalPlan = type === "NORMAL" || type === "NORMAL6" || type === "NORMAL12";

  // Gerar descrição acessível do plano
  const getPlanDescription = () => {
    if (planName && planPrice) {
      return `Assinar plano ${planName} por ${planPrice}`;
    }
    return "Assinar plano";
  };

  // Gerar texto de status do botão
  const getButtonText = () => {
    if (isLoading) return "Processando...";
    return "Assinar";
  };

  // Gerar aria-label completo
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    return getPlanDescription();
  };

  async function handleCreateBilling() {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      // Anunciar início do processo para leitores de tela
      toast.info("Redirecionando para pagamento...", {
        description: "Aguarde enquanto preparamos seu checkout."
      });

      const { sessionId, error } = await createSubscription({ type: type });

      if (error) {
        toast.error("Erro ao processar assinatura", {
          description: error
        });
        return;
      }

      const stripe = await getStripeJs();
      if (stripe && sessionId) {
        // Anunciar redirecionamento
        toast.success("Redirecionando para checkout...", {
          description: "Você será redirecionado para finalizar o pagamento."
        });

        await stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error("Erro ao carregar sistema de pagamento");
      }
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente em alguns instantes."
      });
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Lidar com navegação por teclado
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCreateBilling();
    }
  };

  return (
    <Button
      variant="ghost"
      className={`
        ${isNormalPlan
          ? "bg-accent text-white hover:bg-accent/90 focus:bg-accent/90"
          : "text-accent border border-accent hover:bg-accent/10 focus:bg-accent/10"
        }
        cursor-pointer w-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isLoading ? 'relative' : ''}
      `}
      onClick={handleCreateBilling}
      onKeyDown={handleKeyDown}
      disabled={disabled || isLoading}
      aria-label={getAriaLabel()}
      aria-describedby={planName ? `plan-${type}-description` : undefined}
      role="button"
      tabIndex={0}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <Loader2
            className="w-4 h-4 animate-spin"
            aria-hidden="true"
          />
        )}
        <span aria-live="polite">
          {getButtonText()}
        </span>
      </span>

      {/* Texto oculto para leitores de tela */}
      {planName && (
        <span
          id={`plan-${type}-description`}
          className="sr-only"
        >
          {getPlanDescription()}. Clique para ser redirecionado ao checkout do Stripe.
        </span>
      )}
    </Button>
  )
}