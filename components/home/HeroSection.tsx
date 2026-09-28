"use client";

import { motion } from "motion/react";
import { MagneticButton } from "../ui/MagneticButton";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("../three/HeroScene").then(mod => mod.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

export function HeroSection() {
  return (
    <section className="relative w-full h-[100svh] flex items-center overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-64 md:pt-48">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          
          {/* Sol Taraf: Metin İçeriği */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-accent" />
              <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-accent">Hukuk & Danışmanlık</h2>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight mb-8"
            >
              Hukukun karmaşık <br />
              olduğu yerde <br />
              <span className="italic text-accent">netlik</span> yaratıyoruz.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-sans text-sm md:text-base opacity-70 max-w-lg mb-12 leading-relaxed"
            >
              Ankara merkezli büromuz, bireysel ve kurumsal müvekkillere avukatlık ve hukuki danışmanlık hizmeti sunar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <MagneticButton href="/iletisim" variant="primary" showArrow>
                Görüşme Talep Edin
              </MagneticButton>
              <MagneticButton href="/faaliyet-alanlari" variant="outline">
                Faaliyet Alanlarımız
              </MagneticButton>
            </motion.div>
          </div>

          {/* Sağ Taraf: 3D Terazi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 h-[40vh] lg:h-[65vh] relative flex items-center justify-center"
          >
            <HeroScene />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
