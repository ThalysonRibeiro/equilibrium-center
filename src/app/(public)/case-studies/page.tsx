import { CircleAlert, Hammer } from "lucide-react";

export default function CaseStudies() {
  return (
    <main className="container mx-auto px-4 p-6 space-y-4 min-h-screen">
      <h1 className="text-5xl font-semibold text-center">
        Estudos de caso
      </h1>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Hammer className="w-20 h-20" />
        <div className="flex items-center gap-1">
          <p className="text-2xl">
            Página em construção
          </p>
          <CircleAlert />
        </div>
      </div>
    </main>
  )
}