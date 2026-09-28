"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  showArrow?: boolean;
}

export function MagneticButton({ children, href, className, variant = "primary", showArrow = false }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative inline-flex items-center justify-center px-8 py-4 font-sans text-sm tracking-wider uppercase overflow-hidden transition-colors duration-300";
  
  const variants = {
    primary: "bg-accent text-background hover:bg-accent-hover",
    secondary: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border text-foreground hover:border-accent hover:text-accent"
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <div className={cn(baseClasses, variants[variant], className)}>
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group">
        {content}
      </Link>
    );
  }

  return <button className="inline-block group">{content}</button>;
}
