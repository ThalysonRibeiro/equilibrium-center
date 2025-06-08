"use client"
import { Subscription } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPortalCustomer } from "../_actions/create-portal-customer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SubscriptionDetailProps {
  subscription: Subscription;
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan);

  // Mapear nomes dos planos para exibição
  const getPlanDisplayName = () => {
    switch (subscription.plan) {
      case "BASIC": return "Básico";
      case "NORMAL": return "Normal";
      default: return "Profissional";
    }
  };

  // Determinar informações do status
  const getStatusInfo = () => {
    const isActive = subscription.status === "active";
    return {
      text: isActive ? "ATIVO" : "INATIVO",
      color: isActive ? "bg-green-500" : "bg-red-500",
      icon: isActive ? CheckCircle : XCircle,
      ariaLabel: isActive ? "Assinatura ativa" : "Assinatura inativa"
    };
  };

  // Verificar se a assinatura está próxima do vencimento (7 dias)
  const isNearExpiration = () => {
    if (!subscription.expiresAt) return false;
    const expiresAt = new Date(subscription.expiresAt);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  };

  // Verificar se a assinatura expirou
  const isExpired = () => {
    if (!subscription.expiresAt) return false;
    const expiresAt = new Date(subscription.expiresAt);
    const now = new Date();
    return expiresAt < now;
  };

  async function handleManageSubscription() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Feedback inicial
      toast.info("Carregando portal de gerenciamento...", {
        description: "Aguarde enquanto preparamos o acesso."
      });

      const portal = await createPortalCustomer();

      if (portal.error) {
        toast.error("Erro ao acessar portal", {
          description: "Não foi possível criar o portal de assinatura. Tente novamente."
        });
        return;
      }

      if (portal.sessionId) {
        toast.success("Redirecionando...", {
          description: "Você será redirecionado para o portal de gerenciamento."
        });
        window.location.href = portal.sessionId;
      }
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente em alguns instantes."
      });
      console.error("Portal error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Lidar com navegação por teclado
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleManageSubscription();
    }
  };

  // Verificar se a data de expiração existe
  const expiresAtRaw: Date | null = subscription.expiresAt;
  if (!expiresAtRaw) {
    return (
      <Card className="w-full mx-auto" role="alert" aria-labelledby="error-title">
        <CardHeader>
          <CardTitle id="error-title" className="font-montserrat text-2xl text-red-600 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
            Erro na Assinatura
          </CardTitle>
          <CardDescription>
            Data de expiração não disponível. Entre em contato com o suporte.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const expiresAt = new Date(expiresAtRaw);
  const formattedDate = format(expiresAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card
      className="w-full mx-auto focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
      role="region"
      aria-labelledby="subscription-title"
      aria-describedby="subscription-description"
    >
      <CardHeader>
        <CardTitle
          id="subscription-title"
          className="font-montserrat text-2xl"
        >
          Plano Atual
        </CardTitle>
        <CardDescription id="subscription-description">
          Sua assinatura é válida até{" "}
          <strong>
            <time dateTime={expiresAt.toISOString()}>
              {formattedDate}
            </time>
          </strong>
          {isNearExpiration() && (
            <span className="block mt-1 text-amber-600 font-medium" role="alert">
              <AlertCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
              Sua assinatura expira em breve
            </span>
          )}
          {isExpired() && (
            <span className="block mt-1 text-red-600 font-medium" role="alert">
              <XCircle className="w-4 h-4 inline mr-1" aria-hidden="true" />
              Sua assinatura expirou
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-montserrat text-xl" id="plan-name">
            {getPlanDisplayName()}
          </h3>
          <div
            className={`${statusInfo.color} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium`}
            role="status"
            aria-label={statusInfo.ariaLabel}
          >
            <StatusIcon className="w-4 h-4" aria-hidden="true" />
            <span>{statusInfo.text}</span>
          </div>
        </div>

        {subscriptionInfo && subscriptionInfo.features.length > 0 && (
          <div>
            <h4 className="sr-only">Recursos inclusos no seu plano</h4>
            <ul
              className="space-y-2 list-disc ml-6 mt-4"
              role="list"
              aria-labelledby="plan-name"
            >
              {subscriptionInfo.features.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="text-gray-700"
                  role="listitem"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(!subscriptionInfo || subscriptionInfo.features.length === 0) && (
          <p className="text-gray-500 italic mt-4" role="alert">
            Informações do plano não disponíveis
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleManageSubscription}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Gerenciar sua assinatura no portal do Stripe"
          aria-describedby="manage-button-description"
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading && (
              <Loader2
                className="w-4 h-4 animate-spin"
                aria-hidden="true"
              />
            )}
            <span aria-live="polite">
              {isLoading ? "Carregando..." : "Gerenciar assinatura"}
            </span>
          </span>
        </Button>

        {/* Texto oculto para leitores de tela */}
        <span
          id="manage-button-description"
          className="sr-only"
        >
          Clique para ser redirecionado ao portal de gerenciamento de assinatura do Stripe, onde você pode alterar métodos de pagamento, cancelar ou atualizar sua assinatura.
        </span>
      </CardFooter>
    </Card>
  )
}