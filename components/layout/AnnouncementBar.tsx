"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AnnouncementBar({ metin, gizli = false }: { metin: string; gizli?: boolean }) {
  // Metin değiştiğinde duyuru yeniden gösterilsin diye anahtara metin eklenir.
  const anahtar = `announcement-dismissed:${metin}`;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let kapatilmis = false;
    try {
      kapatilmis = !!localStorage.getItem(anahtar);
    } catch {
      kapatilmis = false;
    }
    if (!kapatilmis) {
      // eslint-disable-next-line
      setIsVisible(true);
    }
  }, [anahtar]);

  const dismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(anahtar, "true");
    } catch {
      // Depolama kapalıysa duyuru yalnızca bu sayfa görüntülemesinde gizlenir.
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !gizli && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-accent text-background px-4 py-2 relative flex items-center justify-center overflow-hidden"
        >
          <p className="font-sans text-xs sm:text-sm tracking-wide text-center mr-8">
            {metin}
          </p>
          <button
            onClick={dismiss}
            className="absolute right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
