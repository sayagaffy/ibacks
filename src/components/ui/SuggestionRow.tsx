"use client";

import React from "react";
import Image from "next/image";
import { HighlightedText } from "./HighlightedText";

interface SuggestionRowProps {
  name: string;
  query: string;
  category?: string;
  onSelect: () => void;
  icon?: React.ReactNode;
  imageSrc?: string | null;
  imageAlt?: string;
}

export function SuggestionRow({
  name,
  query,
  category,
  onSelect,
  icon,
  imageSrc,
  imageAlt,
}: SuggestionRowProps) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      className="w-full px-4 py-2.5 text-left text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-3"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        icon
      )}
      <div className="flex flex-col">
        <span className="font-semibold">
          <HighlightedText text={name} query={query} />
        </span>
        {category && (
          <span className="text-xs text-on-surface-variant">{category}</span>
        )}
      </div>
    </button>
  );
}
