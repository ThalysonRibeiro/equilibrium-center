import Link from "next/link";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto">
        <Header />
        <article className="max-w-7xl mx-auto p-6 mt-24">

          <h1 className="text-2xl font-bold mb-4 text-center">
            Política de Privacidade
          </h1>

          <p className="mb-4">
            Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações dos usuários da nossa plataforma SaaS para profissionais de massoterapia.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Informações que coletamos</h2>
          <p className="mb-2 font-medium">Informações dos profissionais:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Nome, e-mail e foto (provenientes do login via Google ou Discord)</li>
            <li>Informações de serviços cadastrados</li>
          </ul>
          <p className="mb-2 font-medium">Informações dos clientes finais:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Nome, e-mail e telefone, fornecidos pelo profissional</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso das informações</h2>
          <p className="mb-4">
            As informações coletadas são utilizadas para:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Gerenciar agendamentos e serviços</li>
            <li>Emitir relatórios de atendimento</li>
            <li>Facilitar o contato entre profissionais e clientes</li>
            <li>Cumprir obrigações legais e fiscais</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartilhamento de dados</h2>
          <p className="mb-4">
            Não compartilhamos os dados dos usuários com terceiros, exceto quando necessário para:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Processamento de pagamentos via Stripe</li>
            <li>Autenticação de login com Google ou Discord</li>
            <li>Cumprimento de exigências legais</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Armazenamento e segurança</h2>
          <p className="mb-4">
            Todos os dados são armazenados de forma segura em nosso banco de dados (Neo4j via Prisma) com medidas adequadas para prevenir acessos não autorizados. Usamos conexões criptografadas (HTTPS).
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Direitos dos titulares</h2>
          <p className="mb-4">
            Em conformidade com a LGPD, os usuários podem:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Solicitar acesso, correção ou exclusão de seus dados</li>
            <li>Revogar consentimentos</li>
            <li>Solicitar a portabilidade das informações</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies</h2>
          <p className="mb-4">
            Utilizamos cookies para melhorar a navegação e funcionalidades da plataforma. O usuário pode gerenciar suas preferências a qualquer momento. Para mais detalhes, veja nossa{" "}
            <Link
              href={"/cookies-policy"}
              className="font-semibold ml-1 hover:text-accent underline"
            >
              Política de Cookies
            </Link>.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Alterações nesta política</h2>
          <p className="mb-4">
            Podemos atualizar esta política periodicamente. Recomendamos revisar esta página regularmente. A data da última atualização será sempre informada no final.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Contato</h2>
          <p className="mb-4">
            Em caso de dúvidas ou solicitações relacionadas a privacidade, entre em contato pelo e-mail:{" "}
            <Link
              href={"mailto:rafinha.head@gmail.com"}
              className="font-semibold ml-1 hover:text-accent underline"
            >
              rafinha.head@gmail.com
            </Link>.
          </p>

          <p className="text-sm text-gray-600 mt-8">Última atualização: Junho de 2025</p>
        </article>
      </div>
      <Footer />
    </main>
  )
}