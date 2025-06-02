import { FAQItem, Feature } from "../../types/features";
import { TRIAL_DAYS } from "./permissions/trial-limits";

export const FEATURES: Feature[] = [
  {
    title: "Gestão de Clientes",
    description: "Organize registros e preferências de clientes em um local seguro.",
    icon: "users",
  },
  {
    title: "Agendamento Online",
    description: "Permita que os clientes agendem consultas 24 horas por dia, 7 dias por semana, com disponibilidade em tempo real.",
    icon: "calendar",
  },
  {
    title: "Lembretes",
    description: "Reduza as faltas com lembretes de compromissos.",
    icon: "bell",
  },
  {
    title: "Análise de negócios",
    description: "Obtenha insights sobre seu negócio com ferramentas de relatórios.",
    icon: "bar-chart",
  },
];

export const fakeReviews = [
  {
    id: "cmb38v6yt0000a1b2c3d4e5fg",
    message: "Plataforma muito intuitiva! Facilita bastante o agendamento das sessões.",
    rating: 5,
    userId: "cmb38v6yt0000g9x8v7w6r5tq",
    user: {
      id: "cmb38v6yt0000g9x8v7w6r5tq",
      name: "Ana Souza",
      image: ""
    },
    createdAt: new Date("2025-05-01T10:00:00Z"),
    updatedAt: new Date("2025-05-01T10:00:00Z"),
  },
  {
    id: "cmb38v6yt0000mnbvcxzlkjhg",
    message: "Gostei da ideia, mas acho que o app pode ser mais rápido.",
    rating: 3,
    userId: "cmb38v6yt0000q1w2e3r4t5y6",
    user: {
      id: "cmb38v6yt0000q1w2e3r4t5y6",
      name: "Carlos Pereira",
      image: ""
    },
    createdAt: new Date("2025-05-05T14:30:00Z"),
    updatedAt: new Date("2025-05-05T14:30:00Z")
  },
  {
    id: "cmb38v6yt0000zxcvbnmasdfg",
    message: "Excelente suporte ao cliente e os massoterapeutas são muito qualificados!",
    rating: 4,
    userId: "cmb38v6yt0000lkjhgfdsapoi",
    user: {
      id: "cmb38v6yt0000lkjhgfdsapoi",
      name: "Juliana Lima",
      image: ""
    },
    createdAt: new Date("2025-05-10T08:45:00Z"),
    updatedAt: new Date("2025-05-10T08:45:00Z")
  },
  {
    id: "cmb38v6yt0000uytrewqlkjhg",
    message: "Funciona perfeitamente, nunca tive problemas para marcar sessões.",
    rating: 5,
    userId: "cmb38v6yt0000abc123xyz789",
    user: {
      id: "cmb38v6yt0000abc123xyz789",
      name: "Rodrigo Martins",
      image: ""
    },
    createdAt: new Date("2025-05-12T11:20:00Z"),
    updatedAt: new Date("2025-05-12T11:20:00Z")
  },
  {
    id: "cmb38v6yt0000plmoknijbuhv",
    message: "A interface poderia ser mais bonita, mas cumpre o que promete.",
    rating: 4,
    userId: "cmb38v6yt0000rfvtgbyhnujm",
    user: {
      id: "cmb38v6yt0000rfvtgbyhnujm",
      name: "Fernanda Alves",
      image: ""
    },
    createdAt: new Date("2025-05-15T09:10:00Z"),
    updatedAt: new Date("2025-05-15T09:10:00Z")
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "Como funciona o teste grátis?",
    answer: `Você tem ${TRIAL_DAYS} dias para experimentar todos os recursos do plano Profissional, sem precisar cadastrar cartão de crédito. Aproveite esse tempo para conhecer tudo que a plataforma oferece.`,
  },
  {
    id: "2",
    question: "Os dados dos meus clientes estão seguros?",
    answer: "Sim! A segurança é prioridade por aqui. Utilizamos criptografia de ponta, armazenamento conforme a LGPD e controle rigoroso de acesso. Seus dados — e os dos seus clientes — estão sempre protegidos e nunca são compartilhados.",
  },
  {
    id: "3",
    question: "É possível agendar com terapeutas específicos?",
    answer: "Sim! Seus clientes podem escolher o terapeuta, o tipo de atendimento e o melhor horário, de acordo com a disponibilidade. E você controla o que aparece para eles no agendamento.",
  },
  {
    id: "4",
    question: "Qual tipo de suporte está disponível?",
    answer: "Todos os planos contam com suporte por e-mail, com resposta em até 24h. Nos planos Profissional e Clínica, você também tem acesso ao chat ao vivo e suporte personalizado para tirar dúvidas e começar com o pé direito.",
  },
  {
    id: "5",
    question: "Consigo controlar meus atendimentos e ganhos?",
    answer: "Sim! Você pode cadastrar seus serviços, acompanhar todos os agendamentos e ter relatórios financeiros detalhados por semana, mês, semestre, ano ou datas específicas. Tudo de forma simples e visual.",
  },
  {
    id: "6",
    question: "Posso personalizar os serviços que ofereço?",
    answer: "Pode sim! Você pode cadastrar diferentes tipos de atendimento, definir duração, preços e ainda escolher quais ficam visíveis para os clientes na hora do agendamento.",
  }

];

