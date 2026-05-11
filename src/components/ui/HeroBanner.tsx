import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  priority?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  priority = true,
}) => {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-end justify-start rounded-[24px] overflow-hidden group">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
      />

      {/* Dark Vignette Overlay for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 pb-12 md:pb-16 max-w-2xl flex flex-col items-start gap-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-lg leading-relaxed">
          {subtitle}
        </p>

        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="mt-4 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors shadow-xl"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
};
