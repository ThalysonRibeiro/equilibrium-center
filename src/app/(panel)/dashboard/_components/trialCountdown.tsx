"use client"
import { useEffect, useState } from "react";

export function TrialCountdown({ trialEndDate }: { trialEndDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const end = new Date(trialEndDate).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("Expirado");
        setIsExpired(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      setIsExpired(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [trialEndDate]);

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label="Contador do período de teste gratuito"
    >
      <p className={`font-semibold ${isExpired ? 'text-red-600' : ''}`}>
        Você está no período de teste gratuito.
        {isExpired ? (
          <span aria-label="Período de teste expirado"> Expirado</span>
        ) : (
          <span aria-label={`Tempo restante: ${timeLeft}`}> Faltam: {timeLeft}</span>
        )}
      </p>
    </div>
  );
}