"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Süreç boyunca gösterdikleri şeffaflık ve stratejik öngörü sayesinde, şirketimizin en kritik davalarından birini başarıyla atlattık.",
    author: "Ahmet Y. (Placeholder)",
    role: "Yönetim Kurulu Başkanı"
  },
  {
    quote: "Sadece hukuki bir danışman değil, aynı zamanda iş süreçlerimizi anlayan ve vizyonumuza katkı sağlayan bir iş ortağı.",
    author: "Zeynep K. (Placeholder)",
    role: "Girişimci"
  },
  {
    quote: "Karmaşık aile hukuku meselelerinde gösterdikleri hassasiyet ve çözüm odaklı yaklaşımları için minnettarım.",
    author: "Murat C. (Placeholder)",
    role: "Müvekkil"
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-16">Müvekkil Görüşleri</h2>
          
          <div className="relative h-[250px] w-full flex items-center justify-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] leading-snug tracking-tight mb-8">
                  &quot;{TESTIMONIALS[currentIndex].quote}&quot;
                </p>
                <div className="font-sans text-xs uppercase tracking-widest text-accent mb-1">
                  {TESTIMONIALS[currentIndex].author}
                </div>
                <div className="font-sans text-xs opacity-50">
                  {TESTIMONIALS[currentIndex].role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6 mt-12">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === currentIndex ? "bg-accent" : "bg-border"}`}
                />
              ))}
            </div>
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative large quotes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[40vw] text-surface pointer-events-none select-none z-0">
        &quot;
      </div>
    </section>
  );
}
