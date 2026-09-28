"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatTarih } from "@/lib/format";

export type OneCikanMakale = {
  slug: string;
  baslik: string;
  tarih: string | null;
  ozet: string;
  kapak: string | null;
  alan: string | null;
};

function Kapak({ src, alt, sizes }: { src: string | null; alt: string; sizes: string }) {
  if (!src) {
    return (
      <div className="w-full h-full bg-foreground flex items-end p-6">
        <span className="font-serif text-6xl text-accent/40 leading-none">§</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />;
}

export function FeaturedArticlesSection({ makaleler }: { makaleler: OneCikanMakale[] }) {
  const [featured, ...others] = makaleler;

  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Makaleler</h2>
            <h3 className="font-serif text-3xl md:text-5xl tracking-tight">Hukuki Perspektif</h3>
          </div>
          <Link
            href="/makaleler"
            className="group flex items-center gap-2 font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors"
          >
            Tüm Makaleler <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={others.length ? "lg:col-span-8 group" : "lg:col-span-12 group"}>
            <Link href={`/makaleler/${featured.slug}`} className="block relative overflow-hidden h-[400px] md:h-[560px]">
              <motion.div className="w-full h-full relative" whileHover={{ scale: 1.03 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <Kapak src={featured.kapak} alt={featured.baslik} sizes="(min-width: 1024px) 66vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </motion.div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-widest mb-4">
                  {featured.alan && <span className="text-accent">{featured.alan}</span>}
                  <span className="opacity-60">{formatTarih(featured.tarih)}</span>
                </div>
                <h4 className="font-serif text-3xl md:text-5xl leading-tight mb-4 group-hover:text-accent transition-colors">
                  {featured.baslik}
                </h4>
                <p className="font-sans text-sm opacity-70 max-w-2xl line-clamp-2">{featured.ozet}</p>
              </div>
            </Link>
          </div>

          {others.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-8">
              {others.map((m) => (
                <Link key={m.slug} href={`/makaleler/${m.slug}`} className="group flex flex-col border-b border-border pb-8 last:border-0 last:pb-0">
                  <div className="relative w-full h-[200px] mb-6 overflow-hidden">
                    <Kapak src={m.kapak} alt={m.baslik} sizes="(min-width: 1024px) 33vw, 100vw" />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest mb-3">
                    {m.alan && <span className="text-accent">{m.alan}</span>}
                    <span className="opacity-60">{formatTarih(m.tarih)}</span>
                  </div>
                  <h4 className="font-serif text-xl md:text-2xl leading-snug group-hover:text-accent transition-colors">{m.baslik}</h4>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
