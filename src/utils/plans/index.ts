import { PlanDetailsProps } from "../permissions/get-plans";

export const PLANS: PlansProps = {
  BASIC: { maxServices: 3 },
  NORMAL: { maxServices: 30 },
  PROFESSIONAL: { maxServices: Infinity },
  TRIAL: { maxServices: Infinity },
  EXPIRED: { maxServices: 0 },
}

export type PlansProps = {
  BASIC: PlanDetailsProps;
  NORMAL: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
  TRIAL: PlanDetailsProps;
  EXPIRED: PlanDetailsProps;
}

export interface SubscriptionPlansProps {
  id: string;
  name: string;
  description: string;
  oldPrice: string;
  price: string;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlansProps[] = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Perfeito para clínicas menores",
    oldPrice: "R$ 27,90",
    price: "R$ 17,90",
    features: [
      `Até ${PLANS.BASIC.maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte básico",
      "Relatórios simples"
    ]
  },
  {
    id: "NORMAL",
    name: "Normal",
    description: "Perfeito para clínicas de médio porte",
    oldPrice: "R$ 47,90",
    price: "R$ 37,90",
    features: [
      `Até ${PLANS.NORMAL.maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte padrão",
      "Relatórios",
      "Confirmação de agendamentos via WhatsApp"
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Completo para clínicas de alto desempenho",
    oldPrice: "R$ 97,90",
    price: "R$ 67,90",
    features: [
      "Serviços ilimitados",
      "Agendamentos ilimitados",
      "Suporte prioritário",
      "Relatórios avançados",
      "Download de relatórios em PDF",
      "Confirmação de agendamentos via WhatsApp",
    ]
  },
]
