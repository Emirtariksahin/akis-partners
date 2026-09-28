"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import sezin from "../../public/sezin.jpeg";

const TEAM = [
  {
    name: "Av. Melek Sezinnur Arslan",
    role: "Kurucu Ortak",
    expertise: "Ceza & İdare Hukuku",
    bio: "Atılım Üniversitesi Hukuk Fakültesi mezunu.",
    image: sezin
  },
  {
    name: "Av. Ayşe Demir (Placeholder)",
    role: "Kurucu Ortak",
    expertise: "Ticaret & Şirketler Hukuku",
    bio: "Galatasaray Üniversitesi Hukuk Fakültesi mezunu. Kurumsal yapılandırma uzmanı.",
    image: "https://picsum.photos/seed/portrait3/600/800"
  },
  {
    name: "Av. Can Kaya (Placeholder)",
    role: "Kıdemli Avukat",
    expertise: "İş & Sosyal Güvenlik Hukuku",
    bio: "İş hukuku davalarında 10+ yıl deneyim ve akademik çalışmalar.",
    image: "https://picsum.photos/seed/portrait4/600/800"
  },
  {
    name: "Av. Elif Şahin (Placeholder)",
    role: "Kıdemli Avukat",
    expertise: "Aile & Gayrimenkul Hukuku",
    bio: "Miras ve kentsel dönüşüm süreçlerinde özel uzmanlık.",
    image: "https://picsum.photos/seed/portrait5/600/800"
  }
];

export default function TeamPage() {
  return (
    <div className="pt-64 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-24"
        >
          <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-tight mb-8">Ekibimiz</h1>
          <p className="font-sans text-lg md:text-2xl leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">
            Gücümüzü; farklı disiplinlerde uzmanlaşmış, analitik düşünen ve sonuç odaklı avukat kadromuzdan alıyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-32">
          {TEAM.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-2xl group-hover:text-accent transition-colors">{member.name}</h3>
              </div>
              <div className="font-sans text-xs tracking-widest uppercase opacity-60 mb-1">{member.role}</div>
              <div className="font-sans text-xs tracking-widest uppercase text-accent mb-4">{member.expertise}</div>
              <p className="font-sans text-sm opacity-70 mb-4 line-clamp-3">{member.bio}</p>
              
              <a href="#" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-accent transition-all">
                LinkedIn Profil <ArrowUpRight className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
