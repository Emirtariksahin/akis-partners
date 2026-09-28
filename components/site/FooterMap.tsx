"use client";

import { MapPin, Navigation } from "lucide-react";
import { tercihleriKaydet, useCerezTercihleri } from "@/lib/consent";

type FooterMapProps = { sorgu: string; adres: string };

// Google Haritalar yalnızca "Harita" çerez kategorisine onay verildiğinde yüklenir.
export function FooterMap({ sorgu, adres }: FooterMapProps) {
  const tercih = useCerezTercihleri();
  if (!sorgu) return null;

  const q = encodeURIComponent(sorgu);
  const yolTarifi = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <div className="relative w-full h-[320px] md:h-[380px] border border-border bg-background overflow-hidden" data-no-attribution>
      {tercih?.harita ? (
        <iframe
          title="Akış Partners ofis konumu"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 w-full h-full grayscale-[40%] dark:invert-[90%] dark:hue-rotate-180"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-5 p-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] bg-[size:40px_40px]"
          />
          <MapPin className="relative w-8 h-8 text-accent" />
          <p className="relative font-serif text-xl max-w-sm whitespace-pre-line">{adres}</p>
          <p className="relative font-sans text-xs opacity-60 max-w-sm">
            Harita Google tarafından sağlanır ve yüklendiğinde Google çerezleri kullanılabilir.
          </p>
          <button
            type="button"
            onClick={() => tercihleriKaydet({ harita: true, analitik: tercih?.analitik ?? false })}
            className="relative bg-foreground text-background px-6 py-3 font-sans text-xs tracking-widest uppercase hover:bg-foreground/90 transition-colors"
          >
            Haritayı göster
          </button>
        </div>
      )}
      <a
        href={yolTarifi}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-accent text-background px-4 py-2 font-sans text-xs tracking-widest uppercase hover:bg-accent-hover transition-colors"
      >
        <Navigation className="w-3.5 h-3.5" /> Yol tarifi al
      </a>
    </div>
  );
}
