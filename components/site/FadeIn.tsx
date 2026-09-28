"use client";

import { motion } from "motion/react";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Sayfa açılışında hemen oynat (başlıklar için); aksi hâlde görünür olunca oynar. */
  immediate?: boolean;
  y?: number;
};

const EASE = [0.76, 0, 0.24, 1] as const;

export function FadeIn({ children, className, delay = 0, immediate = false, y = 30 }: FadeInProps) {
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: target } : { whileInView: target, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
