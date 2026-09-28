"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("announcement-dismissed");
    if (!isDismissed) {
      // eslint-disable-next-line
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-accent text-background px-4 py-2 relative z-[60] flex items-center justify-center overflow-hidden"
        >
          <p className="font-sans text-xs sm:text-sm tracking-wide text-center mr-8">
            Hukuki danışmanlık ve randevu talepleriniz için bizimle iletişime geçebilirsiniz.
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
