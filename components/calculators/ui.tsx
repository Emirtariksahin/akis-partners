"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Info, AlertTriangle } from "lucide-react";
import { formatSayi, parseTutar } from "@/lib/calculators/core/money";
import { cn } from "@/lib/utils";

export const inputSinifi =
  "w-full bg-background border border-border px-4 py-3 font-sans text-base outline-none focus:border-accent transition-colors disabled:opacity-50";

export function Alan({
  etiket,
  ipucu,
  hata,
  children,
  htmlFor,
  className,
}: {
  etiket: string;
  ipucu?: string;
  hata?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="font-sans text-xs tracking-widest uppercase opacity-70">
        {etiket}
      </label>
      {children}
      {ipucu && !hata && <p className="font-sans text-xs opacity-55">{ipucu}</p>}
      {hata && <p className="font-sans text-xs text-red-600 dark:text-red-400">{hata}</p>}
    </div>
  );
}

/** Türkçe biçimli tutar girişi; odak dışında "33.030,50" biçimine getirilir. */
export function TutarInput({
  etiket,
  deger,
  onChange,
  ipucu,
  hata,
  birim = "TL",
}: {
  etiket: string;
  deger: string;
  onChange: (v: string) => void;
  ipucu?: string;
  hata?: string;
  birim?: string;
}) {
  const id = useId();
  return (
    <Alan etiket={etiket} ipucu={ipucu} hata={hata} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={deger}
          placeholder="0,00"
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            const n = parseTutar(deger);
            if (n !== null) onChange(new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n));
          }}
          className={cn(inputSinifi, "pr-12")}
          aria-invalid={!!hata}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-sm opacity-50">{birim}</span>
      </div>
    </Alan>
  );
}

export function SayiInput({
  etiket,
  deger,
  onChange,
  ipucu,
  hata,
  min,
  max,
  step,
  birim,
}: {
  etiket: string;
  deger: string;
  onChange: (v: string) => void;
  ipucu?: string;
  hata?: string;
  min?: number;
  max?: number;
  step?: number;
  birim?: string;
}) {
  const id = useId();
  return (
    <Alan etiket={etiket} ipucu={ipucu} hata={hata} htmlFor={id}>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={deger}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputSinifi, birim && "pr-16")}
          aria-invalid={!!hata}
        />
        {birim && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-sm opacity-50">{birim}</span>}
      </div>
    </Alan>
  );
}

export function TarihInput({
  etiket,
  deger,
  onChange,
  ipucu,
  hata,
}: {
  etiket: string;
  deger: string;
  onChange: (v: string) => void;
  ipucu?: string;
  hata?: string;
}) {
  const id = useId();
  return (
    <Alan etiket={etiket} ipucu={ipucu} hata={hata} htmlFor={id}>
      <input id={id} type="date" value={deger} onChange={(e) => onChange(e.target.value)} className={inputSinifi} aria-invalid={!!hata} />
    </Alan>
  );
}

export function Secim<T extends string>({
  etiket,
  deger,
  onChange,
  secenekler,
  ipucu,
}: {
  etiket: string;
  deger: T;
  onChange: (v: T) => void;
  secenekler: readonly { value: T; label: string }[];
  ipucu?: string;
}) {
  const id = useId();
  return (
    <Alan etiket={etiket} ipucu={ipucu} htmlFor={id}>
      <select id={id} value={deger} onChange={(e) => onChange(e.target.value as T)} className={cn(inputSinifi, "cursor-pointer")}>
        {secenekler.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </Alan>
  );
}

/** İki-üç seçenekli yatay düğme grubu. */
export function Segment<T extends string>({
  etiket,
  deger,
  onChange,
  secenekler,
}: {
  etiket: string;
  deger: T;
  onChange: (v: T) => void;
  secenekler: readonly { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-xs tracking-widest uppercase opacity-70">{etiket}</span>
      <div role="radiogroup" aria-label={etiket} className="flex border border-border">
        {secenekler.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={deger === s.value}
            onClick={() => onChange(s.value)}
            className={cn(
              "flex-1 px-3 py-3 font-sans text-sm transition-colors",
              deger === s.value ? "bg-foreground text-background" : "hover:bg-surface",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Onay({ etiket, deger, onChange, ipucu }: { etiket: string; deger: boolean; onChange: (v: boolean) => void; ipucu?: string }) {
  return (
    <label className="flex items-start gap-3 font-sans text-sm cursor-pointer select-none">
      <input type="checkbox" checked={deger} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[var(--accent)]" />
      <span>
        {etiket}
        {ipucu && <span className="block text-xs opacity-55 mt-0.5">{ipucu}</span>}
      </span>
    </label>
  );
}

export function HesaplaButonu({ children = "Hesapla" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full md:w-auto bg-foreground text-background px-10 py-4 font-sans text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
    >
      {children}
    </button>
  );
}

export function FormIzgara({ children, onSubmit }: { children: React.ReactNode; onSubmit: () => void }) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
    >
      {children}
    </form>
  );
}

export type SonucSatiri = { etiket: string; deger: string; vurgu?: boolean; ayrac?: boolean; aciklama?: string };

export function SonucPaneli({
  baslik = "Sonuç",
  anaEtiket,
  anaDeger,
  satirlar,
  notlar = [],
  tahmini,
}: {
  baslik?: string;
  anaEtiket: string;
  anaDeger: string;
  satirlar: SonucSatiri[];
  notlar?: string[];
  tahmini?: boolean;
}) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    const metin = [
      `${anaEtiket}: ${anaDeger}`,
      ...satirlar.filter((s) => !s.ayrac).map((s) => `${s.etiket}: ${s.deger}`),
      "",
      `Kaynak: ${window.location.origin}${window.location.pathname}`,
      "Bu sonuç tahmini olup hukuki görüş niteliği taşımaz.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      setKopyalandi(false);
    }
  };

  return (
    <motion.section
      aria-live="polite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12 border border-accent/40 bg-background"
    >
      <div className="p-8 md:p-10 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            {baslik}
            {tahmini && <span className="ml-2 px-2 py-0.5 border border-accent/50 text-[10px]">Tahmini</span>}
          </p>
          <p className="font-sans text-sm opacity-70 mb-2">{anaEtiket}</p>
          <p className="font-serif text-4xl md:text-5xl text-foreground">{anaDeger}</p>
        </div>
        <button
          type="button"
          onClick={kopyala}
          className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase border border-border px-4 py-2.5 hover:border-accent hover:text-accent transition-colors self-start md:self-auto"
        >
          {kopyalandi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {kopyalandi ? "Kopyalandı" : "Sonucu kopyala"}
        </button>
      </div>

      {satirlar.length > 0 && (
        <dl className="px-8 md:px-10 py-4">
          {satirlar.map((s, i) =>
            s.ayrac ? (
              <dt key={i} className="pt-6 pb-2 font-sans text-[11px] tracking-widest uppercase text-accent">
                {s.etiket}
              </dt>
            ) : (
              <div key={i} className={cn("flex justify-between gap-6 py-3 border-b border-border last:border-0", s.vurgu && "font-medium")}>
                <dt className="font-sans text-sm opacity-80">
                  {s.etiket}
                  {s.aciklama && <span className="block text-xs opacity-60 mt-0.5">{s.aciklama}</span>}
                </dt>
                <dd className={cn("font-sans text-sm text-right tabular-nums shrink-0", s.vurgu && "text-accent")}>{s.deger}</dd>
              </div>
            ),
          )}
        </dl>
      )}

      {notlar.length > 0 && (
        <div className="px-8 md:px-10 pb-8 flex flex-col gap-3">
          {notlar.map((n) => (
            <Uyari key={n}>{n}</Uyari>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export function Uyari({ children, tur = "bilgi" }: { children: React.ReactNode; tur?: "bilgi" | "dikkat" }) {
  const Icon = tur === "dikkat" ? AlertTriangle : Info;
  return (
    <div className={cn("flex gap-3 p-4 font-sans text-sm leading-relaxed", tur === "dikkat" ? "bg-accent/10" : "bg-surface")}>
      <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="opacity-85">{children}</div>
    </div>
  );
}

/** Formdaki sayısal alanları doğrular; hatalı alanların mesajlarını döndürür. */
export function tutarDogrula(deger: string, { zorunlu = true, min = 0 }: { zorunlu?: boolean; min?: number } = {}) {
  const n = parseTutar(deger);
  if (n === null) return { n: null, hata: zorunlu ? "Geçerli bir tutar giriniz." : undefined };
  if (n < min) return { n: null, hata: `En az ${formatSayi(min)} olmalıdır.` };
  return { n, hata: undefined };
}
