"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/faq-schema";
import type { SeoLinkGroup, SeoLinkItem } from "@/lib/seo/mega-footer";

interface SeoContentBlockProps {
  title: string;
  intro?: string;
  items: FaqItem[];
  linkGroups?: SeoLinkGroup[];
  popularSearches?: SeoLinkItem[];
}

export function SeoContentBlock({
  title,
  intro,
  items,
  linkGroups = [],
  popularSearches = [],
}: SeoContentBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-12">
      <div className="rounded-3xl border surface-border bg-surface-container p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold text-on-surface">
              {title}
            </h2>
            {intro && (
              <p className="text-sm md:text-base text-on-surface-variant mt-2">
                {intro}
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary hover:text-primary-container transition-colors"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? "Tutup" : "Baca Lengkap"}
          </button>
        </div>

        <div
          className={`mt-6 flex flex-col gap-4 overflow-hidden transition-all duration-500 ${
            expanded ? "max-h-[2000px]" : "max-h-40"
          }`}
        >
          {items.map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              className="flex flex-col gap-2"
            >
              <p className="text-sm md:text-base font-semibold text-on-surface">
                {item.question}
              </p>
              <p className="text-sm md:text-base text-on-surface-variant">
                {item.answer}
              </p>
            </div>
          ))}

          {(linkGroups.length > 0 || popularSearches.length > 0) && (
            <div className="mt-4 flex flex-col gap-6">
              {linkGroups.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm md:text-base font-semibold text-on-surface">
                    Direktori Kategori
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {linkGroups.map((group) => (
                      <div key={group.title} className="flex flex-col gap-2">
                        <Link
                          href={group.href}
                          className="text-sm font-semibold text-primary hover:text-primary-container transition-colors"
                        >
                          {group.title}
                        </Link>
                        <div className="flex flex-col gap-1.5">
                          {group.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {popularSearches.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm md:text-base font-semibold text-on-surface">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-3 py-1 rounded-full bg-surface-container-high text-xs text-on-surface-variant hover:text-on-surface hover:border-primary/40 border border-surface-variant/30 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
