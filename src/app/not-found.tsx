import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import img_404 from "@/assets/massage-couple.gif";
import Image from 'next/image';


export default function NotFound() {

  return (
    <div className="min-h-screen text-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center justify-center">

        <div className='flex items-center gap-3'>
          <span className="text-[250px] font-bold tracking-tight animate-pulse">4</span>
          <div className='relative w-50 h-50'>
            <Image
              src={img_404}
              alt='imagem de ilustração da pagina 404'
              fill
              className='object-cover'
            />
          </div>
          <span className="text-[250px] font-bold tracking-tight animate-pulse">4</span>
        </div>
        <h2 className="text-3xl font-medium text-borderColor">Ops! Página não encontrada...</h2>



        <div className="space-y-4 flex flex-col items-center justify-center">
          <p className='text-2xl text-center'>
            Aproveite o momento e relaxe. Volte à página inicial e descubra os nossos serviços de massagem.
          </p>

          <div className="w-80 flex items-center justify-center">
            <Link
              href="/"
              className="bg-primary border hover:bg-accent text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para o inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}