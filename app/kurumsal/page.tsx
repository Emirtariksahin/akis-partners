"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function KurumsalPage() {
  return (
    <div className="pt-64 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-24"
        >
          <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-tight mb-8">Biz Kimiz?</h1>
          <p className="font-sans text-lg md:text-2xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">
            Hukuk yalnızca mevzuatı bilmek değil, doğru zamanda doğru stratejiyi kurabilmektir.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] w-full"
          >
            <Image 
              src="https://picsum.photos/seed/law-office/1000/1200" 
              alt="Akış Partners Office" 
              fill 
              className="object-cover" 
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Misyon</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Müvekkillerimizin hukuki haklarını en üst düzeyde korurken, ticari ve kişisel hedeflerine ulaşmalarını sağlayacak stratejik, şeffaf ve sonuç odaklı çözümler üretmek.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Vizyon</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Hukuki danışmanlık standartlarını yeniden belirleyen, ulusal ve uluslararası arenada güvenin ve stratejik zekanın sembolü bir hukuk bürosu olmak.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
