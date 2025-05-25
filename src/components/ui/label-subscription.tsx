import Link from "next/link";

export function LabelSubscription({ expired }: { expired: boolean }) {
  return (
    <div className="bg-red-400 text-white shadow-md text-sm md:text-base px-3 py-2 my-4 rounded-md flex flex-col lg:flex-row lg:items-center justify-between gap-1">
      <div>
        {expired ? (
          <h3 className="font-semibold">
            Seu planos expirou ou você não possue um plano ativo!
          </h3>
        ) : (
          <h3 className="font-semibold">
            Você excedeu o limite do seu plano!
          </h3>
        )}
        <p className="text-sm text-gray-50">
          Acesse o seu plano para verificar os detalhes
        </p>
      </div>
      <Link
        href="/dashboard/plans"
        className="text-white bg-zinc-900 py-1 px-3 rounded-md w-fit h-fit"
      >
        Acessar planos
      </Link>
    </div>
  )
}