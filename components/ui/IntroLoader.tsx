"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("intro-loaded");
    if (hasLoaded) {
      // eslint-disable-next-line
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("intro-loaded", "true");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-foreground"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          <div className="flex flex-col items-center overflow-hidden">
            <motion.h1 
              className="text-4xl md:text-7xl font-serif font-light tracking-[0.2em] mb-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            >
              AKIŞ
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-4xl font-serif font-light tracking-[0.4em] opacity-70"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            >
              PARTNERS
            </motion.h2>
            <motion.div 
              className="h-[1px] bg-accent mt-8"
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
