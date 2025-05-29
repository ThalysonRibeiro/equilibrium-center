import { FAQItem, Feature } from "../../types/features";

export const FEATURES: Feature[] = [
  {
    title: "Gestão de Clientes",
    description: "Organize registros, notas e preferências de clientes em um local seguro.",
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
    description: "Obtenha insights sobre seu negócio com ferramentas de relatórios poderosas.",
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
    answer: "Você tem 14 dias para testar todos os recursos do plano escolhido, sem precisar colocar cartão de crédito. Pode cancelar a qualquer momento antes de acabar o teste, sem pagar nada por isso.",
  },
  {
    id: "2",
    question: "Os dados dos meus clientes estão seguros?",
    answer: "Sim! A segurança é prioridade por aqui. Usamos criptografia avançada, armazenamento conforme as normas da HIPAA e acesso super controlado. Seus dados e os dos seus clientes nunca são compartilhados.",
  },
  {
    id: "3",
    question: "Consigo importar meus clientes atuais?",
    answer: "Claro! É só usar nossa ferramenta de importação para arquivos CSV ou Excel. E se precisar de ajuda, nossa equipe está pronta para dar aquela força – sem custo extra.",
  },
  {
    id: "4",
    question: "Como funcionam os pagamentos online?",
    answer: "A gente integra com plataformas como Stripe e PayPal, então você pode receber com cartão, carteiras digitais e outros meios. O dinheiro vai direto pra sua conta, só com a taxa padrão de cada operadora.",
  },
  {
    id: "5",
    question: "Dá pra agendar com terapeutas específicos?",
    answer: "Dá sim! O cliente pode escolher o terapeuta, o tipo de atendimento e o horário, tudo com base no que estiver disponível no momento. E você escolhe o que aparece pra eles.",
  },
  {
    id: "6",
    question: "Que tipo de suporte vocês oferecem?",
    answer: "Todos os planos têm suporte por e-mail e a gente responde em até 24h. Se você tiver um plano Profissional ou Clínica, também tem acesso ao chat ao vivo e ajuda personalizada pra começar com tudo.",
  },
];
