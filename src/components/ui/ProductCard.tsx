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
    <div className="relative flex flex-col gap-5 bg-surface-container-low rounded-xl p-5 ambient-shadow overflow-hidden group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="bg-surface-container-highest/50 rounded-lg aspect-[4/5] flex items-center justify-center overflow-hidden relative">
        {/* Menggunakan object-cover tanpa multiply agar aman di dark mode */}
        <img 
          src={imageSrc} 
          alt={name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
          loading="lazy" 
        />
        {/* Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="glass-elevated px-4 py-2 rounded-full text-sm font-semibold tracking-wide text-white">Lihat Detail</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 px-1">
        <span className="text-[0.65rem] uppercase tracking-widest text-primary font-bold">
          {category}
        </span>
        <h3 className="text-on-surface text-lg font-medium leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-tertiary text-xl font-semibold mt-2">
          {price}
        </p>
      </div>
    </div>
  );
};
