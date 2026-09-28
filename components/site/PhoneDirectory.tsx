"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Printer, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type RehberKaydi = {
  id: string;
  tur: "adliye" | "cezaevi";
  il: string;
  ad: string;
  adres: string;
  telefonlar: string[];
  faks: string | null;
  web: string;
};

const normalize = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");

const telLink = (t: string) => `tel:+90${t.replace(/\D/g, "").replace(/^0/, "")}`;

const SAYFA_BOYUTU = 30;

export function PhoneDirectory({ adliyeler, cezaevleri }: { adliyeler: RehberKaydi[]; cezaevleri: RehberKaydi[] }) {
  const [sekme, setSekme] = useState<"adliye" | "cezaevi">("adliye");
  const [il, setIl] = useState("");
  const [arama, setArama] = useState("");
  const [gosterilen, setGosterilen] = useState(SAYFA_BOYUTU);

  const kaynak = sekme === "adliye" ? adliyeler : cezaevleri;
  const iller = useMemo(() => [...new Set(kaynak.map((k) => k.il))].sort((a, b) => a.localeCompare(b, "tr")), [kaynak]);

  const sonuc = useMemo(() => {
    const q = normalize(arama.trim());
    return kaynak.filter(
      (k) => (!il || k.il === il) && (!q || normalize(`${k.ad} ${k.il} ${k.adres} ${k.telefonlar.join(" ")}`).includes(q)),
    );
  }, [kaynak, il, arama]);

  const sekmeDegistir = (s: "adliye" | "cezaevi") => {
    setSekme(s);
    setIl("");
    setGosterilen(SAYFA_BOYUTU);
  };

  return (
    <div data-no-attribution>
      <div role="tablist" aria-label="Rehber türü" className="flex border-b border-border mb-8">
        {[
          { v: "adliye" as const, l: "Adliyeler", n: adliyeler.length },
          { v: "cezaevi" as const, l: "Cezaevleri ve DS Müdürlükleri", n: cezaevleri.length },
        ].map((s) => (
          <button
            key={s.v}
            role="tab"
            aria-selected={sekme === s.v}
            onClick={() => sekmeDegistir(s.v)}
            className={cn(
              "px-6 py-4 font-sans text-sm tracking-wide border-b-2 -mb-px transition-colors",
              sekme === s.v ? "border-accent text-foreground" : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            {s.l} <span className="opacity-50 ml-1">({s.n})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <label className="relative flex-1">
          <span className="sr-only">Kurum, şehir, adres veya telefon ara</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="search"
            value={arama}
            onChange={(e) => {
              setArama(e.target.value);
              setGosterilen(SAYFA_BOYUTU);
            }}
            placeholder="Kurum, şehir, adres veya telefon ara"
            className="w-full bg-background border border-border pl-11 pr-4 py-3 font-sans outline-none focus:border-accent transition-colors"
          />
        </label>
        <select
          value={il}
          onChange={(e) => {
            setIl(e.target.value);
            setGosterilen(SAYFA_BOYUTU);
          }}
          aria-label="İl seçin"
          className="md:w-64 bg-background border border-border px-4 py-3 font-sans outline-none focus:border-accent cursor-pointer"
        >
          <option value="">Tüm iller</option>
          {iller.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <p className="font-sans text-xs tracking-widest uppercase opacity-60 mb-4" aria-live="polite">
        {sonuc.length} kayıt
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border border border-border">
        {sonuc.slice(0, gosterilen).map((k) => (
          <li key={k.id + k.ad} className="bg-background p-6 flex flex-col gap-3">
            <p className="font-sans text-[10px] tracking-widest uppercase text-accent">
              {k.tur === "adliye" ? "Adliye" : /denetimli serbestlik/i.test(k.ad) ? "Denetimli serbestlik" : "Ceza infaz kurumu"} · {k.il}
            </p>
            <h3 className="font-serif text-xl leading-snug">{k.ad}</h3>
            {k.adres && (
              <p className="flex gap-2 font-sans text-sm opacity-70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent" /> {k.adres}
              </p>
            )}
            <div className="flex flex-col gap-1.5 mt-auto pt-2">
              {k.telefonlar.map((t) => (
                <a key={t} href={telLink(t)} className="inline-flex items-center gap-2 font-sans text-sm hover:text-accent transition-colors tabular-nums">
                  <Phone className="w-4 h-4 text-accent" /> {t}
                </a>
              ))}
              {k.faks && (
                <span className="inline-flex items-center gap-2 font-sans text-sm opacity-60 tabular-nums">
                  <Printer className="w-4 h-4" /> {k.faks} (faks)
                </span>
              )}
              <a
                href={k.web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-sans text-xs opacity-60 hover:opacity-100 hover:text-accent transition-colors mt-1"
              >
                Resmî site <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </li>
        ))}
        {sonuc.length === 0 && <li className="bg-background p-10 text-center font-sans opacity-60 md:col-span-2 xl:col-span-3">Kayıt bulunamadı.</li>}
      </ul>

      {sonuc.length > gosterilen && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setGosterilen((g) => g + SAYFA_BOYUTU)}
            className="border border-border px-8 py-3 font-sans text-xs tracking-widest uppercase hover:border-accent hover:text-accent transition-colors"
          >
            Daha fazla göster ({sonuc.length - gosterilen})
          </button>
        </div>
      )}
    </div>
  );
}
