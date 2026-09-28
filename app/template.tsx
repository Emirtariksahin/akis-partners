"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const ROUTES_INDEX: Record<string, string> = {
  "/": "01",
  "/kurumsal": "02",
  "/uzmanlik-alanlari": "03",
  "/ekibimiz": "04",
  "/hukuki-araclar": "05",
  "/makaleler": "06",
  "/iletisim": "07"
};

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const index = ROUTES_INDEX[pathname] || "00";

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
      
      {/* We need an entering curtain for when page is left, but App Router doesn't natively support exit animations easily without a custom router wrapper. For this requirement, a simple overlay that slides up on load is usually sufficient to give the curtain effect on every navigation. */}
      
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
