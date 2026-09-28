"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Kategori = { id: string; value: string; title: string; alanlar: { slug: string; baslik: string }[] };

export function ExpertiseSection({ kategoriler, toplamAlan }: { kategoriler: Kategori[]; toplamAlan: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-48 px-6 md:px-12 bg-surface relative">
      <div className="container mx-auto flex flex-col lg:flex-row gap-16 relative">
        {/* Yapışkan başlık alanı */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-48">
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">Faaliyet Alanlarımız</h2>
            <h3 className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[1.1] tracking-tight mb-8">
              Bireysel ve kurumsal <br />
              ihtiyaçlara <span className="italic">bütünsel bakış.</span>
            </h3>
            <p className="font-sans text-sm opacity-70 max-w-sm mb-10">
              Kurumsal danışmanlıktan dava takibine, aile hukukundan bilişim hukukuna uzanan {toplamAlan} faaliyet alanında
              hukuki destek sunuyoruz.
            </p>
            <Link
              href="/faaliyet-alanlari"
              className="group inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors"
            >
              Tüm faaliyet alanları <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Kategori listesi */}
        <div className="w-full lg:w-2/3" onMouseLeave={() => setHoveredIndex(null)}>
          <div className="border-t border-border">
            {kategoriler.map((kategori, index) => (
              <div
                key={kategori.value}
                className="group relative border-b border-border overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <motion.div
                  className="absolute inset-0 bg-accent/5"
                  initial={{ height: 0 }}
                  animate={{ height: hoveredIndex === index ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                <Link
                  href={`/faaliyet-alanlari#${kategori.value}`}
                  className="relative flex flex-col md:flex-row md:items-center py-8 md:py-12 px-4 gap-4 md:gap-12 z-10"
                >
                  <span
                    className={cn(
                      "font-sans text-xs tracking-widest transition-colors duration-300",
                      hoveredIndex === index ? "text-accent" : "text-foreground/40",
                    )}
                  >
                    {kategori.id}
                  </span>

                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-serif text-3xl md:text-5xl tracking-tight transition-all duration-500",
                        hoveredIndex === index ? "md:translate-x-4 text-accent" : "",
                      )}
                    >
                      {kategori.title}
                    </h4>
                    <p className="font-sans text-xs tracking-widest uppercase opacity-50 mt-3 md:hidden">
                      {kategori.alanlar.length} alan
                    </p>
                  </div>

                  <div className="hidden md:block w-1/3 overflow-hidden h-16 relative">
                    <AnimatePresence mode="wait">
                      {hoveredIndex === index && (
                        <motion.div
                          key="desc"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center"
                        >
                          <p className="text-xs font-sans opacity-70 line-clamp-3">
                            {kategori.alanlar.map((a) => a.baslik).join(" · ")}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-background transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </Link>

                {/* Mobil: alan listesi */}
                <div className="md:hidden px-4 pb-8 -mt-2 flex flex-wrap gap-2">
                  {kategori.alanlar.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/faaliyet-alanlari/${a.slug}`}
                      className="font-sans text-xs border border-border px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                    >
                      {a.baslik}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
