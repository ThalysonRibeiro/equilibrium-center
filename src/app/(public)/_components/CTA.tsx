import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-ring text-white py-6 sm:px-1 flex flex-col items-center justify-center gap-6">
      <div className="container mx-auto px-6 space-y-4">
        <h2 className="text-3xl text-center font-bold">
          Pronto para elevar sua prática de massoterapia?
        </h2>
        <p className="text-center">
          Junte-se a milhares de terapeutas que transformaram suas práticas com o SereneBook. Comece seu teste gratuito hoje mesmo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            className="bg-white text-teal-700 hover:bg-teal-100"
          >
            Comece seu teste gratuito
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white bg-white text-teal-700 hover:bg-teal-600"
          >
            Agende uma demonstração
          </Button>
        </div>
        <p className="text-center">
          Não é necessário cartão de crédito. Teste grátis por 14 dias. Cancele quando quiser.
        </p>
      </div>
    </section>
  )
}