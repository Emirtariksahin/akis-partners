"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["Tümü", "Ceza Hukuku", "İş Hukuku", "Ticaret Hukuku", "Aile Hukuku", "Gayrimenkul", "Bilişim Hukuku"];

const ARTICLES = [
  { id: 1, category: "Ticaret Hukuku", title: "Anonim Şirketlerde Yönetim Kurulu Üyelerinin Hukuki Sorumluluğu", date: "12 Kasım 2024", readTime: "5 dk okuma", image: "https://picsum.photos/seed/law1/800/600" },
  { id: 2, category: "Bilişim Hukuku", title: "Yapay Zeka ve Telif Hakları: Mevcut Yasal Çerçeve Ne Söylüyor?", date: "28 Ekim 2024", readTime: "4 dk okuma", image: "https://picsum.photos/seed/law2/800/600" },
  { id: 3, category: "İş Hukuku", title: "Uzaktan Çalışma Modelinde İş Kazası Kapsamı ve İşveren Sorumlulukları", date: "15 Eylül 2024", readTime: "6 dk okuma", image: "https://picsum.photos/seed/law3/800/600" },
  { id: 4, category: "Ceza Hukuku", title: "Beyaz Yaka Suçlarında Şirket İçi Soruşturma Usulleri", date: "02 Eylül 2024", readTime: "7 dk okuma", image: "https://picsum.photos/seed/law4/800/600" },
  { id: 5, category: "Gayrimenkul", title: "Kentsel Dönüşüm Sürecinde Kat Maliklerinin Hakları", date: "14 Ağustos 2024", readTime: "5 dk okuma", image: "https://picsum.photos/seed/law5/800/600" },
  { id: 6, category: "Aile Hukuku", title: "Mal Rejiminin Tasfiyesinde Edinilmiş Mallara Katılma Rejimi", date: "25 Temmuz 2024", readTime: "8 dk okuma", image: "https://picsum.photos/seed/law6/800/600" },
];

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filteredArticles = activeCategory === "Tümü" 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="pt-64 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-16"
        >
          <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-tight mb-8">Makaleler</h1>
          <p className="font-sans text-lg md:text-2xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">
            Hukuki gelişmelere dair uzman görüşleri, güncel emsal kararlar ve sektörel analizler.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-16">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-sans text-xs tracking-widest uppercase px-6 py-3 border transition-colors rounded-full ${
                activeCategory === category 
                  ? "bg-foreground text-background border-foreground" 
                  : "border-border text-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map(article => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                key={article.id}
              >
                <Link href={`/makaleler/${article.id}`} className="group block" data-cursor-text="OKU">
                  <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden">
                    <motion.div 
                      className="w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image 
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest mb-4">
                    <span className="text-accent">{article.category}</span>
                    <span className="opacity-60">{article.date}</span>
                  </div>
                  <h4 className="font-serif text-2xl leading-snug mb-4 group-hover:text-accent transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-[10px] font-sans opacity-60 uppercase tracking-widest">{article.readTime}</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
