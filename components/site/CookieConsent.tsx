"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { TERCIH_PANELI_OLAYI, tercihleriKaydet, useCerezTercihleri } from "@/lib/consent";

export function CookieConsent() {
  const tercih = useCerezTercihleri();
  const [panelAcik, setPanelAcik] = useState(false);
  const [detay, setDetay] = useState(false);
  const [harita, setHarita] = useState(false);
  const [analitik, setAnalitik] = useState(false);

  useEffect(() => {
    const ac = () => {
      setHarita(tercih?.harita ?? false);
      setAnalitik(tercih?.analitik ?? false);
      setDetay(true);
      setPanelAcik(true);
    };
    window.addEventListener(TERCIH_PANELI_OLAYI, ac);
    return () => window.removeEventListener(TERCIH_PANELI_OLAYI, ac);
  }, [tercih]);

  const gorunur = panelAcik || tercih === null;

  const kaydet = (t: { harita: boolean; analitik: boolean }) => {
    tercihleriKaydet(t);
    setPanelAcik(false);
    setDetay(false);
  };

  return (
    <AnimatePresence>
      {gorunur && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihleri"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-[70] bg-background border border-border shadow-2xl p-6"
          data-no-attribution
        >
          <h2 className="font-serif text-2xl mb-3">Çerez tercihleri</h2>
          <p className="font-sans text-sm opacity-75 leading-relaxed mb-4">
            Sitemiz yalnızca çalışması için zorunlu olan yerel depolama kayıtlarını kullanır. Harita gibi üçüncü taraf
            içerikler yalnızca onay vermeniz hâlinde yüklenir. Ayrıntılar için{" "}
            <Link href="/cerez-politikasi" className="text-accent underline underline-offset-4">
              Çerez Politikası
            </Link>
            .
          </p>

          {detay && (
            <div className="flex flex-col gap-3 mb-5 border-t border-border pt-4">
              <label className="flex items-start gap-3 font-sans text-sm opacity-60">
                <input type="checkbox" checked disabled className="mt-1 accent-[var(--accent)]" />
                <span>
                  <strong className="font-medium">Zorunlu</strong> — tema, duyuru ve çerez tercihinizin hatırlanması.
                </span>
              </label>
              <label className="flex items-start gap-3 font-sans text-sm cursor-pointer">
                <input type="checkbox" checked={harita} onChange={(e) => setHarita(e.target.checked)} className="mt-1 accent-[var(--accent)]" />
                <span>
                  <strong className="font-medium">Harita</strong> — Google Haritalar gömülü içeriği (Google çerezleri).
                </span>
              </label>
              <label className="flex items-start gap-3 font-sans text-sm cursor-pointer">
                <input type="checkbox" checked={analitik} onChange={(e) => setAnalitik(e.target.checked)} className="mt-1 accent-[var(--accent)]" />
                <span>
                  <strong className="font-medium">Analitik</strong> — anonim ziyaret istatistikleri.
                </span>
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {detay ? (
              <button
                onClick={() => kaydet({ harita, analitik })}
                className="bg-foreground text-background px-5 py-3 font-sans text-xs tracking-widest uppercase hover:bg-foreground/90 transition-colors"
              >
                Seçimimi kaydet
              </button>
            ) : (
              <button
                onClick={() => setDetay(true)}
                className="border border-border px-5 py-3 font-sans text-xs tracking-widest uppercase hover:border-accent hover:text-accent transition-colors"
              >
                Tercihler
              </button>
            )}
            <button
              onClick={() => kaydet({ harita: false, analitik: false })}
              className="border border-border px-5 py-3 font-sans text-xs tracking-widest uppercase hover:border-accent hover:text-accent transition-colors"
            >
              Reddet
            </button>
            <button
              onClick={() => kaydet({ harita: true, analitik: true })}
              className="bg-accent text-background px-5 py-3 font-sans text-xs tracking-widest uppercase hover:bg-accent-hover transition-colors"
            >
              Tümünü kabul et
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
