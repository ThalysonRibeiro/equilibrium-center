import Link from "next/link";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";

export default function TermsOfService() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto">
        <Header />

        <article className="max-w-7xl mx-auto p-6 mt-24">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Termos de Serviço
          </h1>

          <p className="mb-4">
            Estes Termos de Serviço regulam o uso da plataforma SaaS disponibilizada para profissionais de massoterapia. Ao criar uma conta ou utilizar o serviço, você concorda com estes termos.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Descrição do serviço</h2>
          <p className="mb-4">
            Oferecemos uma plataforma online onde profissionais de massoterapia podem criar perfis, cadastrar serviços, disponibilizar links de agendamento e gerenciar informações de seus clientes.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Cadastro e acesso</h2>
          <ul className="list-disc list-inside mb-4">
            <li>O acesso à plataforma é realizado por meio de login com provedores terceiros (como Google ou Discord).</li>
            <li>Você é responsável por manter suas credenciais de acesso seguras.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Responsabilidades do profissional</h2>
          <ul className="list-disc list-inside mb-4">
            <li>O profissional é responsável pelo conteúdo e veracidade das informações cadastradas na plataforma.</li>
            <li>O uso da plataforma deve estar em conformidade com as leis aplicáveis e normas éticas da prática de massoterapia.</li>
            <li>É proibido cadastrar serviços que não estejam relacionados à prática de bem-estar e massoterapia.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Dados dos clientes</h2>
          <p className="mb-4">
            Os dados inseridos sobre os clientes (nome, e-mail, telefone) são de responsabilidade do profissional e devem ser usados apenas para fins relacionados ao agendamento e atendimento, em conformidade com a LGPD.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Pagamentos</h2>
          <p className="mb-4">
            Os pagamentos são processados de forma segura pela Stripe. Nós não armazenamos informações de cartão de crédito em nossos servidores.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Cancelamento e exclusão de conta</h2>
          <p className="mb-4">
            O usuário pode solicitar a exclusão de sua conta a qualquer momento. Reservamo-nos o direito de suspender contas que violem estes termos.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitação de responsabilidade</h2>
          <p className="mb-4">
            Não nos responsabilizamos por falhas no cumprimento de atendimentos, prejuízos causados por terceiros ou má conduta de profissionais cadastrados na plataforma.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Modificações nos termos</h2>
          <p className="mb-4">
            Podemos atualizar estes Termos de Serviço a qualquer momento. O uso continuado da plataforma após a atualização constitui aceitação das mudanças.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Contato</h2>
          <p className="mb-4">
            Em caso de dúvidas, entre em contato pelo e-mail: <Link
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