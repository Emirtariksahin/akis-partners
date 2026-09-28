"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const PROCESS_STEPS = [
  { id: "01", title: "İlk Görüşme", desc: "Müvekkilin hukuki problemini ve hedeflerini anlamaya yönelik detaylı dinleme ve analiz seansı." },
  { id: "02", title: "Hukuki Analiz", desc: "Mevzuat, emsal kararlar ve sektörel risklerin çok boyutlu değerlendirilmesi." },
  { id: "03", title: "Stratejinin Belirlenmesi", desc: "En güvenli ve efektif çözüm yolunun, alternatif planlarla birlikte sunulması." },
  { id: "04", title: "Süreç Yönetimi", desc: "Davaların veya danışmanlık sürecinin şeffaf, sonuç odaklı ve proaktif takibi." },
];

export function ProcessSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        <div className="absolute top-24 left-6 md:left-12 z-20">
          <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-2">Çalışma Süreci</h2>
          <h3 className="font-serif text-3xl md:text-5xl tracking-tight">Nasıl İlerliyoruz?</h3>
        </div>

        {/* Progress Line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-border z-0">
          <motion.div 
            className="h-full bg-accent origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        <motion.div style={{ x }} className="flex w-[400vw] h-full items-center relative z-10 px-[10vw]">
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.id} className="w-[100vw] flex flex-col justify-center shrink-0 px-6 md:px-12">
              <div className="max-w-md bg-background py-8">
                <span className="font-serif text-[clamp(4rem,8vw,6rem)] leading-none text-accent/20 block mb-4">
                  {step.id}
                </span>
                <h4 className="font-serif text-3xl md:text-4xl mb-4">{step.title}</h4>
                <p className="font-sans text-sm md:text-base opacity-70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
