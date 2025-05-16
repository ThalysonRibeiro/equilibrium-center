"use client"

import { useEffect, useState } from "react";

export function RadialProgress({ progress = 10, size = 120, stroke = 10 }) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentProgress / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100); // pequeno delay para garantir que a transição ocorra

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <svg width={size} height={size} className="transform">
      {/* Fundo (trilha cinza) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb" // Tailwind gray-200
        strokeWidth={stroke}
        fill="none"
      />
      {/* Progresso (círculo animado) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#22c55e" // Tailwind green-500
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
      {/* Texto central */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1rem"
        className="fill-gray-800 font-semibold"
      >
        {progress}%
      </text>
    </svg>
  );
}