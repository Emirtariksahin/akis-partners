"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERTISE_AREAS = [
  { id: "01", title: "Ceza Hukuku", desc: "Karmaşık ceza soruşturmaları ve davalarında stratejik savunma." },
  { id: "02", title: "İdare Hukuku", desc: "İdari işlemlere karşı iptal ve tam yargı davaları." },
  { id: "03", title: "Ticaret & Şirketler Hukuku", desc: "Şirket kuruluşları, birleşme ve devralmalar, ticari sözleşmeler." },
  { id: "04", title: "Aile Hukuku", desc: "Boşanma, mal paylaşımı ve velayet süreçlerinde hassas temsil." },
  { id: "05", title: "İş Hukuku", desc: "İşçi-işveren uyuşmazlıkları ve işe iade süreçleri." },
  { id: "06", title: "Gayrimenkul Hukuku", desc: "Tapu iptali, tescil ve kentsel dönüşüm süreçleri." },
  { id: "07", title: "Miras Hukuku", desc: "Miras taksimi, vasiyetname ve tenkis davaları." },
  { id: "08", title: "Bilişim Hukuku", desc: "KVKK, e-ticaret, siber suçlar ve IT projeleri." },
];

export function ExpertiseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-48 px-6 md:px-12 bg-surface relative">
      <div className="container mx-auto flex flex-col lg:flex-row gap-16 relative">
        {/* Sticky Title Area */}
        <div className="w-full lg:w-1/3 relative">
          <div className="sticky top-48">
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-6">Uzmanlık Alanları</h2>
            <h3 className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[1.1] tracking-tight mb-8">
              Her alanda spesifik <br />
              derinlik, bütünsel <br />
              <span className="italic">strateji.</span>
            </h3>
            <p className="font-sans text-sm opacity-70 max-w-sm mb-12">
              Karmaşık hukuki meseleleri alanında uzman kadromuzla, sektör dinamiklerini gözeterek çözümlüyoruz.
            </p>
          </div>
        </div>

        {/* Interactive List Area */}
        <div className="w-full lg:w-2/3" onMouseLeave={() => setHoveredIndex(null)}>
          <div className="border-t border-border">
            {EXPERTISE_AREAS.map((area, index) => (
              <div 
                key={area.id}
                className="group relative border-b border-border overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Hover Background Fill */}
                <motion.div
                  className="absolute inset-0 bg-accent/5"
                  initial={{ height: 0 }}
                  animate={{ height: hoveredIndex === index ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                <Link 
                  href={`/uzmanlik-alanlari#${area.id}`}
                  className="relative flex flex-col md:flex-row md:items-center py-8 md:py-12 px-4 gap-4 md:gap-12 z-10"
                  data-cursor-text="İNCELE"
                >
                  <span className={cn(
                    "font-sans text-xs tracking-widest transition-colors duration-300",
                    hoveredIndex === index ? "text-accent" : "text-foreground/40"
                  )}>
                    {area.id}
                  </span>
                  
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-serif text-3xl md:text-5xl tracking-tight transition-all duration-500",
                      hoveredIndex === index ? "md:translate-x-4 text-accent" : ""
                    )}>
                      {area.title}
                    </h4>
                  </div>

                  {/* Desktop Hover Info */}
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
                          <p className="text-xs font-sans opacity-70 line-clamp-2">
                            {area.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-background transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </Link>
                
                {/* Mobile Info */}
                <div className="md:hidden px-4 pb-8 -mt-4 opacity-70 text-sm">
                  {area.desc}
                  <Link href={`/uzmanlik-alanlari#${area.id}`} className="flex items-center gap-2 mt-4 text-accent text-xs uppercase tracking-widest">
                    Alanı İncele <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
