"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { formatTarih } from "@/lib/format";
import { cn } from "@/lib/utils";

export type MakaleKarti = {
  slug: string;
  baslik: string;
  tarih: string | null;
  ozet: string;
  kapak: string | null;
  alanSlug: string | null;
  alanBaslik: string | null;
};

export function ArticleList({ makaleler }: { makaleler: MakaleKarti[] }) {
  const [aktif, setAktif] = useState<string | null>(null);

  const kategoriler = Array.from(
    new Map(makaleler.filter((m) => m.alanSlug).map((m) => [m.alanSlug!, m.alanBaslik!])).entries(),
  );
  const liste = aktif ? makaleler.filter((m) => m.alanSlug === aktif) : makaleler;

  return (
    <>
      {kategoriler.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-16">
          {[[null, "Tümü"] as const, ...kategoriler].map(([slug, ad]) => (
            <button
              key={slug ?? "tumu"}
              onClick={() => setAktif(slug)}
              className={cn(
                "font-sans text-xs tracking-widest uppercase px-6 py-3 border transition-colors rounded-full",
                aktif === slug
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-foreground/70 hover:border-accent hover:text-accent",
              )}
            >
              {ad}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {liste.map((m) => (
            <motion.div
              layout
              key={m.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/makaleler/${m.slug}`} className="group block">
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden bg-foreground">
                  {m.kapak ? (
                    <Image
                      src={m.kapak}
                      alt={m.baslik}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute bottom-4 left-6 font-serif text-7xl text-accent/40">§</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest mb-4">
                  {m.alanBaslik && <span className="text-accent">{m.alanBaslik}</span>}
                  <span className="opacity-60">{formatTarih(m.tarih)}</span>
                </div>
                <h2 className="font-serif text-2xl leading-snug mb-3 group-hover:text-accent transition-colors">{m.baslik}</h2>
                <p className="font-sans text-sm opacity-65 line-clamp-3">{m.ozet}</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
