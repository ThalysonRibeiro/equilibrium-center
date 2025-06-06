import React from 'react';
import {
  Users,
  Calendar,
  Bell,
  CreditCard,
  ClipboardList,
  BarChart,
  Check
} from 'lucide-react';
import { FEATURES } from '@/utils/constants';
import img_features from "@/assets/img-features.jpg";
import Image from 'next/image';

function FeatureIcon({ name }: { name: string }) {
  const iconProps = { size: 36, className: "text-white" };

  switch (name) {
    case 'users':
      return <Users {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'bell':
      return <Bell {...iconProps} />;
    case 'bar-chart':
      return <BarChart {...iconProps} />;
    default:
      return <div className="w-9 h-9 bg-teal-100" />;
  }
};


export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Tudo o que você precisa para administrar seu consultório de massagem
          </h2>
          <p className="text-lg text-gray-600">
            Nossa plataforma abrangente foi projetada especificamente para massoterapeutas, com ferramentas que simplificam as operações diárias e aumentam a satisfação do cliente.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="mb-5 bg-ring w-16 h-16 rounded-full flex items-center justify-center">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-teal-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6">
                Uma solução completa, projetada com terapeutas
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Ao contrário das ferramentas de agendamento genéricas, o Equilibrium
                Center foi criado especificamente para massoterapeutas, com recursos especializados que dão suporte ao seu fluxo de trabalho exclusivo
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="text-white rounded-full p-0.5 w-4 h-4 bg-ring mr-1" />
                  <span className="text-gray-700">Configurações de disponibilidade específicas do terapeuta</span>
                </li>
              </ul>
            </div>
            <div className="relative h-full min-h-[320px] lg:min-h-0">
              <Image
                src={img_features}
                alt="Massage therapist using SereneBook software"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};