import React from 'react';

export interface ProductCardProps {
  imageSrc: string;
  name: string;
  price: string;
  category?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  name,
  price,
  category = 'Aksesoris'
}) => {
  return (
    <div className="flex flex-col gap-4 bg-surface-container-lowest rounded-[12px] p-4 ambient-shadow">
      <div className="bg-surface-container-highest rounded-[8px] aspect-square flex items-center justify-center overflow-hidden">
        {/* Using a standard img tag for simplicity, Next/Image would be better in a full implementation */}
        <img src={imageSrc} alt={name} className="object-cover w-full h-full mix-blend-multiply" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant font-bold">
          {category}
        </span>
        <h3 className="text-on-surface text-base font-medium leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="text-on-surface-variant text-lg font-bold mt-1">
          {price}
        </p>
      </div>
    </div>
  );
};
