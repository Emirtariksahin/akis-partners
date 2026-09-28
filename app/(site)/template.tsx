"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

// Perde animasyonunda gösterilen bölüm numarası; alt sayfalar üst bölümün numarasını alır.
const ROUTES_INDEX: Record<string, string> = {
  "": "01",
  kurumsal: "02",
  ekibimiz: "02",
  "faaliyet-alanlari": "03",
  "hukuki-araclar": "04",
  makaleler: "05",
  iletisim: "06",
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const index = ROUTES_INDEX[pathname.split("/")[1] ?? ""] ?? "00";

  return (
    <>
      <motion.div
        key={pathname + "-curtain"}
        className="fixed inset-0 z-[150] bg-background flex items-center justify-center pointer-events-none"
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <div className="font-sans text-xs tracking-[0.5em] text-accent uppercase">
          AKIŞ / {index}
        </div>
      </motion.div>
      
      <motion.div
        key={pathname + "-content"}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}
