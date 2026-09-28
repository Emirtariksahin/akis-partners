"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AnnouncementBar } from "./AnnouncementBar";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavAlan, type NavItem } from "@/lib/navigation";
import { FAALIYET_KATEGORILERI } from "@/lib/taxonomy";

type HeaderProps = { alanlar: NavAlan[]; telefon: string; adresKisa: string; duyuru?: string };

function aktifMi(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(item.href + "/")) return true;
  return item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")) ?? false;
}

export function Header({ alanlar, telefon, adresKisa, duyuru }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [acikMenu, setAcikMenu] = useState<string | null>(null);
  const [oncekiPath, setOncekiPath] = useState(pathname);

  // Sayfa değişince açık menüleri kapat.
  if (oncekiPath !== pathname) {
    setOncekiPath(pathname);
    setAcikMenu(null);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const kategoriler = FAALIYET_KATEGORILERI.map((k) => ({
    ...k,
    alanlar: alanlar.filter((a) => a.kategori === k.value),
  })).filter((k) => k.alanlar.length > 0);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || acikMenu ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent",
        )}
        onMouseLeave={() => setAcikMenu(null)}
      >
        {/* Duyuru çubuğu header'ın içinde durur ki logonun üstüne binmesin; sayfa kaydırılınca gizlenir. */}
        {duyuru && <AnnouncementBar metin={duyuru} gizli={scrolled} />}
        <div
          className={cn(
            "container mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-500",
            scrolled || acikMenu ? "py-4" : "py-6 md:py-8",
          )}
        >
          <Link href="/" className="relative z-50 group flex items-center gap-4" aria-label="Akış Partners ana sayfa">
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 aspect-square">
              <Image
                src="/akislogo.png"
                alt="Akış Partners Logo"
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-contain object-center transition-all dark-logo-bg"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-2xl tracking-widest text-foreground">
                AKIŞ <span className="font-light opacity-70">PARTNERS</span>
              </span>
              <div className="h-[1px] w-0 bg-accent transition-all duration-300 group-hover:w-full mt-1" />
            </div>
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Ana menü">
            {NAV_ITEMS.map((item) => {
              const altVar = !!item.children || !!item.mega;
              return (
                <div key={item.name} className="relative" onMouseEnter={() => setAcikMenu(altVar ? item.name : null)}>
                  <Link
                    href={item.href}
                    aria-haspopup={altVar ? "true" : undefined}
                    aria-expanded={altVar ? acikMenu === item.name : undefined}
                    onFocus={() => setAcikMenu(altVar ? item.name : null)}
                    className={cn(
                      "group relative flex items-center gap-1 font-sans text-xs uppercase tracking-widest transition-colors py-2",
                      aktifMi(pathname, item) ? "text-accent" : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    {item.name}
                    {altVar && (
                      <ChevronDown className={cn("w-3 h-3 transition-transform", acikMenu === item.name && "rotate-180")} />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
                  </Link>

                  <AnimatePresence>
                    {acikMenu === item.name && item.children && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                      >
                        <div className="w-80 bg-background border border-border shadow-xl p-3 flex flex-col">
                          {item.children.map((c) => (
                            <Link key={c.href + c.name} href={c.href} className="px-4 py-3 hover:bg-surface transition-colors group/alt">
                              <span className="block font-serif text-lg group-hover/alt:text-accent transition-colors">{c.name}</span>
                              {c.desc && <span className="block font-sans text-xs opacity-60 mt-1">{c.desc}</span>}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="flex items-center gap-4 ml-2 pl-6 border-l border-border">
              <ThemeToggle />
              <Link
                href="/iletisim"
                className="text-xs uppercase tracking-widest px-4 py-2 border border-border hover:border-accent hover:text-accent transition-colors"
              >
                İletişim
              </Link>
            </div>
          </nav>

          {/* Mobil menü düğmesi */}
          <div className="lg:hidden flex items-center gap-4 relative z-50">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5 w-8 p-2"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileMenuOpen}
            >
              <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="w-full h-[1px] bg-foreground block" />
              <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-2/3 h-[1px] bg-foreground block ml-auto" />
              <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="w-full h-[1px] bg-foreground block" />
            </button>
          </div>
        </div>

        {/* Faaliyet alanları mega menüsü */}
        <AnimatePresence>
          {acikMenu === "Faaliyet Alanları" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="hidden lg:block absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl"
            >
              <div className="container mx-auto px-12 py-10 grid grid-cols-5 gap-8">
                {kategoriler.map((k) => (
                  <div key={k.value}>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-accent mb-4">{k.label}</p>
                    <ul className="flex flex-col gap-2">
                      {k.alanlar.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/faaliyet-alanlari/${a.slug}`} className="font-serif text-base leading-snug hover:text-accent transition-colors">
                            {a.baslik}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="container mx-auto px-12 pb-8">
                <Link href="/faaliyet-alanlari" className="font-sans text-xs tracking-widest uppercase hover:text-accent transition-colors">
                  Tüm faaliyet alanları →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Tam ekran mobil menü */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-32 px-6 pb-10 overflow-y-auto"
          >
            <nav className="flex flex-col gap-5" aria-label="Mobil menü">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                  className="border-b border-border pb-4"
                >
                  <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="font-serif text-4xl tracking-wide block">
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="flex flex-col gap-2 mt-3 pl-1">
                      {item.children.map((c) => (
                        <Link
                          key={c.href + c.name}
                          href={c.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="font-sans text-sm opacity-70 hover:text-accent"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-4">
                <Link
                  href="/iletisim"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-sm tracking-widest uppercase bg-foreground text-background py-4 px-8 inline-block text-center w-full"
                >
                  Görüşme Talep Et
                </Link>
              </motion.div>
            </nav>

            <div className="mt-auto pt-10 flex justify-between gap-4 text-xs tracking-wider opacity-60 uppercase font-sans" data-no-attribution>
              <span>{adresKisa}</span>
              <span>{telefon}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
