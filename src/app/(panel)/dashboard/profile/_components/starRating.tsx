"use client"
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  onValorChange: (valor: number) => void;
  ratingValue: number
}

export default function StarRating({ onValorChange, ratingValue }: StarRatingProps) {
  const [rating, setRating] = useState<number>(ratingValue);
  const [hover, setHover] = useState<number>(0);

  useEffect(() => {
    onValorChange(rating)
  }, [rating, onValorChange])

  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleMouseEnter = (value: number) => {
    setHover(value);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };



  const getRatingText = (rating: number): string => {
    const texts: Record<number, string> = {
      1: 'Muito ruim',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return texts[rating] || 'Clique para avaliar';
  };


  return (
    <div className="flex flex-col gap-2">

      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`}
          >
            <Star
              size={28}
              className={`transition-all duration-200 ${star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300 hover:text-yellow-200'
                }`}
            />
          </div>
        ))}
      </div>

      <p>
        {getRatingText(hover || rating)}
      </p>
    </div>
  );
}