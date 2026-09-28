"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

export function FirmIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-12 relative overflow-hidden bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
          <div className="w-full md:w-2/3">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] tracking-tight"
            >
              Bir dosyayı değil, müvekkilimizin <br />
              <span className="italic text-accent">bütün hukuki pozisyonunu</span> <br />
              değerlendiriyoruz.
            </motion.h2>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col justify-end pt-4 md:pt-24 border-t md:border-t-0 md:border-l border-border md:pl-16">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-sm md:text-base leading-relaxed opacity-70 mb-12"
            >
              Hukuk yalnızca mevzuatı bilmek değil, doğru zamanda doğru stratejiyi kurabilmektir. Amacımız hukuki ihtilafları çözmekten öte, müvekkillerimizin hedeflerine güvenle ulaşmasını sağlamaktır.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-auto"
            >
              <div className="font-serif text-3xl opacity-40 mb-2 italic">Akış Partners</div>
              <div className="text-xs tracking-widest font-sans uppercase text-accent">Kurucu Ortaklar</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative large logo watermark */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: -100, opacity: 0.05 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] pointer-events-none select-none"
      >
        <Image 
          src="/akislogo.png"
          alt="Watermark"
          fill
          className="object-contain opacity-50 dark:invert dark:opacity-20"
        />
      </motion.div>
    </section>
  );
}
