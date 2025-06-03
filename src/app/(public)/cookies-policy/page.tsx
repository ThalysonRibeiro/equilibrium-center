import Link from "next/link";
import { Header } from "../_components/header";
import { Footer } from "../_components/footer";

export default function CookiesPolicy() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto">

        <article className="max-w-7xl mx-auto p-6 mt-24">
          <h1 className="text-2xl font-bold mb-4 text-center">Política de Cookies</h1>

          <p className="mb-4">
            Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, realizar autenticação, analisar o tráfego e permitir funcionalidades essenciais do nosso sistema.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">O que são cookies?</h2>
          <p className="mb-4">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você acessa um site. Eles ajudam a lembrar de informações entre sessões e a oferecer funcionalidades personalizadas.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Cookies que utilizamos</h2>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Cookies essenciais:</strong> usados para login, autenticação e segurança da conta.</li>
            <li><strong>Cookies de terceiros:</strong> usados por serviços como Google (login), Discord (login) e Stripe (pagamentos).</li>
            <li><strong>Cookies de desempenho:</strong> usados para entender como os usuários interagem com a plataforma (caso use ferramentas como Google Analytics).</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Gerenciamento de cookies</h2>
          <p className="mb-4">
            Você pode configurar seu navegador para recusar ou apagar cookies. No entanto, isso pode afetar funcionalidades do sistema, como login ou acesso à área do profissional.
          </p>

          <p>
            Para mais informações sobre como tratamos seus dados, consulte nossa{" "}
            <Link
              href={"/privacy-policy"}
              className="font-semibold ml-1 hover:text-accent underline"
            >
              Política de Privacidade
            </Link>.
          </p>
        </article>
      </div>
      <Footer />
    </main>
  );
}