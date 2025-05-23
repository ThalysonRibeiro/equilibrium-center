import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ProgressProps extends ComponentProps<'div'> {
  width: number;
  max: number;
  color?: string;
}

const colorDefault = "bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500"

export function Progress({ width, max, color = colorDefault, className, ...props }: ProgressProps) {
  const [currentWidth, setCurrentWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentWidth(width);
    }, 100); // pequeno delay para garantir que a transição ocorra

    return () => clearTimeout(timeout);
  }, [width]);

  const percent = (currentWidth / max) * 100;

  return (
    <div className={twMerge("bg-gray-200 w-full h-2.5 rounded overflow-hidden", className)} {...props}>
      <div
        className={`${color} rounded h-full transition-all duration-700 ease-in-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
