"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface pt-24 pb-12 px-6 md:px-12 border-t border-border overflow-hidden relative">
      <div className="container mx-auto">
        <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-40 h-40 md:w-56 md:h-56 shrink-0"
          >
            <Image
              src="/akislogo.png"
              alt="Akış Partners Logo"
              fill
              className="object-contain transition-all opacity-80 hover:opacity-100 dark-footer-logo-bg"
            />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-[12vw] md:text-[8vw] leading-none font-serif font-light tracking-tighter text-foreground text-center md:text-left"
          >
            AKIŞ <span className="opacity-50">PARTNERS</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-accent mb-2">Adres</h3>
            <p className="font-serif text-lg leading-relaxed">
              Söğütözü, Çankaya<br />
              Ankara, Türkiye
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-accent mb-2">İletişim</h3>
            <a href="tel:+903120000000" className="font-serif text-lg hover:text-accent transition-colors">0 (312) 000 00 00</a>
            <a href="mailto:info@akispartners.com" className="font-serif text-lg hover:text-accent transition-colors">info@akispartners.com</a>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-accent mb-2">Çalışma Saatleri</h3>
            <p className="font-serif text-lg leading-relaxed">
              Pazartesi – Cuma<br />
              09:00 – 18:00
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-xs tracking-widest uppercase text-accent mb-2">Sosyal Medya</h3>
            <div className="flex flex-col gap-2">
              {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
                <a key={social} href="#" className="font-serif text-lg flex items-center gap-1 group hover:text-accent transition-colors w-fit">
                  {social}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="font-sans text-xs leading-relaxed opacity-60 max-w-3xl">
            Bu web sitesindeki içerikler Avukatlık Kanunu ve Türkiye Barolar Birliği Meslek Kuralları kapsamında yalnızca genel bilgilendirme amacı taşımaktadır ve hukuki görüş veya danışmanlık niteliğinde değildir.
          </p>
          <div className="font-sans text-xs uppercase tracking-widest opacity-60 shrink-0">
            © {new Date().getFullYear()} AKIŞ PARTNERS
          </div>
        </div>
      </div>
    </footer>
  );
}
