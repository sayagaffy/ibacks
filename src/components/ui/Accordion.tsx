"use client";

import React, { useState } from 'react';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-surface-variant/50 w-full">
      <button
        type="button"
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-on-surface text-lg">{title}</span>
        <svg
          className={`w-5 h-5 text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] pb-4 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-on-surface-variant text-base">
          {children}
        </div>
      </div>
    </div>
  );
};
