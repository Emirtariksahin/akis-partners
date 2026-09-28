"use client";

import { motion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const EXPERTISE_AREAS = [
  { id: "01", title: "Ceza Hukuku", desc: "Karmaşık ceza soruşturmaları ve davalarında stratejik savunma. Beyaz yaka suçları, bilişim suçları ve ekonomik suçlar alanlarında derin uzmanlık." },
  { id: "02", title: "İdare Hukuku", desc: "İdari işlemlere karşı iptal ve tam yargı davaları, kamu ihaleleri uyuşmazlıkları ve regülasyon uyum süreçleri." },
  { id: "03", title: "Ticaret & Şirketler Hukuku", desc: "Şirket kuruluşları, birleşme ve devralmalar, ticari sözleşmeler, kurumsal yönetim ve ortaklar arası uyuşmazlıkların çözümü." },
  { id: "04", title: "Aile Hukuku", desc: "Anlaşmalı ve çekişmeli boşanma, mal rejiminin tasfiyesi, velayet, nafaka ve soybağı davalarında hassas ve gizlilik odaklı temsil." },
  { id: "05", title: "İş Hukuku", desc: "İşçi-işveren uyuşmazlıkları, işe iade süreçleri, iş kazaları, mobbing davaları ve şirketlerin İK süreçlerinin hukuki yapılandırması." },
  { id: "06", title: "Gayrimenkul Hukuku", desc: "Tapu iptali, tescil, kentsel dönüşüm süreçleri, kira uyuşmazlıkları ve inşaat sözleşmelerinin hazırlanması." },
  { id: "07", title: "Miras Hukuku", desc: "Miras taksimi, vasiyetname hazırlanması, tenkis ve muris muvazaası davaları." },
  { id: "08", title: "Bilişim Hukuku", desc: "KVKK süreçleri, e-ticaret regülasyonları, siber suçlar, IT projeleri sözleşmeleri ve yapay zeka hukuku danışmanlığı." },
];

export default function ExpertisePage() {
  return (
    <div className="pt-64 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 relative">
        <div className="w-full lg:w-1/3">
          <div className="sticky top-32">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-[clamp(2.5rem,4vw,4rem)] leading-[1.1] tracking-tight mb-8"
            >
              Uzmanlık Alanları
            </motion.h1>
            <nav className="hidden lg:flex flex-col gap-4 border-l border-border pl-6 mt-12">
              {EXPERTISE_AREAS.map((area) => (
                <a key={area.id} href={`#${area.id}`} className="font-sans text-xs tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-accent transition-colors">
                  {area.id} — {area.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="w-full lg:w-2/3 pb-32">
          {EXPERTISE_AREAS.map((area, idx) => (
            <motion.div 
              key={area.id}
              id={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`py-16 md:py-24 ${idx !== 0 ? 'border-t border-border' : ''} scroll-mt-24`}
            >
              <span className="font-serif text-5xl text-accent/20 block mb-6">{area.id}</span>
              <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-6">{area.title}</h2>
              <p className="font-sans text-lg opacity-70 leading-relaxed mb-12 max-w-2xl">
                {area.desc}
              </p>
              
              <div className="flex gap-4">
                <MagneticButton href="/iletisim" variant="outline" data-cursor-text="RANDEVU">
                  Bu Alanda Destek Al
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
