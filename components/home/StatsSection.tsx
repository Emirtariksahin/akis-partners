"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const STATS = [
  { value: 15, suffix: "+", label: "Yıllık Birleşik Tecrübe" },
  { value: 850, suffix: "+", label: "Sonuçlanan Dosya" },
  { value: 12, suffix: "", label: "Uzmanlık Alanı" },
  { value: 98, suffix: "%", label: "Müvekkil Memnuniyeti" },
];

function Counter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-border">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none text-foreground mb-4">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-sans text-xs uppercase tracking-widest text-accent max-w-[120px]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-24 max-w-4xl mx-auto text-center">
          <p className="font-sans text-xs opacity-40">
            * Yukarıda yer alan veriler; kurucu ortaklarımızın birleşik tecrübesi ve tamamlanan dosyalar baz alınarak 2024 yılı itibarıyla örneklendirilmiştir. (Placeholder)
          </p>
        </div>
      </div>
    </section>
  );
}
