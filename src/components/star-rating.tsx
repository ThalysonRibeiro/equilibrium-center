import { Star } from "lucide-react";

export function StarRating({ rating, size = 22 }: { rating: number, size?: number }) {
  const numericRating = Number(rating);
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          size={size}
          key={index}
          className={index < numericRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}
        />
      ))}
    </div>
  );
};