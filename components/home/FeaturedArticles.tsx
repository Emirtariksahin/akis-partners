"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    id: 1,
    category: "Ticaret Hukuku",
    title: "Anonim Şirketlerde Yönetim Kurulu Üyelerinin Hukuki Sorumluluğu",
    date: "12 Kasım 2024",
    readTime: "5 dk okuma",
    image: "https://picsum.photos/seed/law1/800/600",
    featured: true
  },
  {
    id: 2,
    category: "Bilişim Hukuku",
    title: "Yapay Zeka ve Telif Hakları: Mevcut Yasal Çerçeve Ne Söylüyor?",
    date: "28 Ekim 2024",
    readTime: "4 dk okuma",
    image: "https://picsum.photos/seed/law2/800/600",
    featured: false
  },
  {
    id: 3,
    category: "İş Hukuku",
    title: "Uzaktan Çalışma Modelinde İş Kazası Kapsamı ve İşveren Sorumlulukları",
    date: "15 Eylül 2024",
    readTime: "6 dk okuma",
    image: "https://picsum.photos/seed/law3/800/600",
    featured: false
  }
];

export function FeaturedArticlesSection() {
  const featured = ARTICLES.find(a => a.featured)!;
  const others = ARTICLES.filter(a => !a.featured);

  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Makaleler & İçgörüler</h2>
            <h3 className="font-serif text-3xl md:text-5xl tracking-tight">Hukuki Perspektif</h3>
          </div>
          <Link href="/makaleler" className="group flex items-center gap-2 font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors" data-cursor-text="TÜMÜ">
            Tüm Makaleler <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-8 group">
            <Link href={`/makaleler/${featured.id}`} className="block relative overflow-hidden h-[400px] md:h-[600px]" data-cursor-text="OKU">
              <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image 
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </motion.div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-widest mb-4">
                  <span className="text-accent">{featured.category}</span>
                  <span className="opacity-60">{featured.date}</span>
                </div>
                <h4 className="font-serif text-3xl md:text-5xl leading-tight mb-4 group-hover:text-accent transition-colors">
                  {featured.title}
                </h4>
                <span className="text-xs font-sans opacity-60 uppercase tracking-widest">{featured.readTime}</span>
              </div>
            </Link>
          </div>

          {/* Other Articles */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-8">
            {others.map((article) => (
              <Link key={article.id} href={`/makaleler/${article.id}`} className="group flex flex-col h-full border-b border-border pb-8 last:border-0 last:pb-0" data-cursor-text="OKU">
                <div className="relative w-full h-[200px] mb-6 overflow-hidden">
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
                <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest mb-3">
                  <span className="text-accent">{article.category}</span>
                  <span className="opacity-60">{article.date}</span>
                </div>
                <h4 className="font-serif text-xl md:text-2xl leading-snug mb-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h4>
                <span className="text-[10px] font-sans opacity-60 uppercase tracking-widest mt-auto">{article.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
