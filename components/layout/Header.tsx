"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Kurumsal", href: "/kurumsal" },
  { name: "Uzmanlık Alanları", href: "/uzmanlik-alanlari" },
  { name: "Ekibimiz", href: "/ekibimiz" },
  { name: "Hukuki Araçlar", href: "/hukuki-araclar" },
  { name: "Makaleler", href: "/makaleler" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-4 bg-background/80 backdrop-blur-md border-b border-border" : "py-8 bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="relative z-50 group flex items-center gap-4" data-cursor-text="ANA SAYFA">
            <div className="relative w-24 h-16 md:w-36 md:h-24 shrink-0">
              <Image 
                src="/akislogo.png" 
                alt="Akış Partners Logo" 
                fill 
                className="object-contain object-left transition-all dark-logo-bg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-widest text-foreground">
                AKIŞ <span className="font-light opacity-70">PARTNERS</span>
              </span>
              <div className="h-[1px] w-0 bg-accent transition-all duration-300 group-hover:w-full mt-1" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative font-sans text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                <span className="absolute -top-2 -left-2 text-[8px] opacity-0 group-hover:opacity-50 transition-opacity text-accent">
                  0{index + 1}
                </span>
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
              <ThemeToggle />
              <Link
                href="/iletisim"
                className="text-xs uppercase tracking-widest px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
                data-cursor-text="İLETİŞİM"
              >
                İletişim
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4 relative z-50">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5 w-8 p-2"
              aria-label="Toggle Menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-full h-[1px] bg-foreground block"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-2/3 h-[1px] bg-foreground block ml-auto"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-full h-[1px] bg-foreground block"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-32 px-6 pb-12"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-4xl tracking-wide block border-b border-border pb-4"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Link
                  href="/iletisim"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-sm tracking-widest uppercase bg-foreground text-background py-4 px-8 inline-block text-center w-full"
                >
                  Görüşme Talep Et
                </Link>
              </motion.div>
            </nav>
            
            <div className="mt-auto pt-12 border-t border-border flex justify-between text-xs tracking-wider opacity-60 uppercase font-sans">
              <span>Söğütözü, Ankara</span>
              <span>0312 000 00 00</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
