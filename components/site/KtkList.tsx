"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { KTK_GRUPLARI } from "@/lib/taxonomy";
import { formatTL } from "@/lib/calculators/core/money";
import { cn } from "@/lib/utils";

export type KtkKarti = {
  slug: string;
  madde: string;
  baslik: string;
  grup: string;
  kusurTuru: string;
  cezaTutari: number | null;
  cezaPuani: number | null;
};

const normalize = (s: string) => s.toLocaleLowerCase("tr").normalize("NFC");

export function KtkList({ maddeler, tabanYol }: { maddeler: KtkKarti[]; tabanYol: string }) {
  const [arama, setArama] = useState("");
  const [kusur, setKusur] = useState<"" | "asli" | "tali">("");
  const [grup, setGrup] = useState("");

  const sonuc = useMemo(() => {
    const q = normalize(arama.trim());
    return maddeler.filter(
      (m) =>
        (!kusur || m.kusurTuru === kusur) &&
        (!grup || m.grup === grup) &&
        (!q || normalize(`${m.madde} ${m.baslik}`).includes(q)),
    );
  }, [arama, kusur, grup, maddeler]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <label className="relative flex-1">
          <span className="sr-only">Madde veya ihlal ara</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="search"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Madde numarası veya ihlal ara (ör. 56/1-a, kırmızı ışık)"
            className="w-full bg-background border border-border pl-11 pr-4 py-3 font-sans outline-none focus:border-accent transition-colors"
          />
        </label>
        <div role="radiogroup" aria-label="Kusur niteliği" className="flex border border-border shrink-0">
          {[
            { v: "", l: "Tümü" },
            { v: "asli", l: "Asli kusur" },
            { v: "tali", l: "Tali kusur" },
          ].map((s) => (
            <button
              key={s.v}
              type="button"
              role="radio"
              aria-checked={kusur === s.v}
              onClick={() => setKusur(s.v as typeof kusur)}
              className={cn("px-4 py-3 font-sans text-sm transition-colors", kusur === s.v ? "bg-foreground text-background" : "hover:bg-surface")}
            >
              {s.l}
            </button>
          ))}
        </div>
        <select
          value={grup}
          onChange={(e) => setGrup(e.target.value)}
          aria-label="Konu grubu"
          className="bg-background border border-border px-4 py-3 font-sans outline-none focus:border-accent cursor-pointer"
        >
          <option value="">Tüm konular</option>
          {KTK_GRUPLARI.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <p className="font-sans text-xs tracking-widest uppercase opacity-60 mb-4" aria-live="polite">
        {sonuc.length} madde
      </p>

      <div className="border border-border overflow-x-auto">
        <table className="w-full font-sans text-sm min-w-[640px]">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-4 py-3 text-xs tracking-wide font-medium w-28">Madde</th>
              <th className="px-4 py-3 text-xs tracking-wide font-medium">İhlal</th>
              <th className="px-4 py-3 text-xs tracking-wide font-medium w-32">Kusur</th>
              <th className="px-4 py-3 text-xs tracking-wide font-medium w-36 text-right">Ceza (2026)</th>
              <th className="px-4 py-3 text-xs tracking-wide font-medium w-20 text-right">Puan</th>
            </tr>
          </thead>
          <tbody>
            {sonuc.map((m) => (
              <tr key={m.slug} className="border-t border-border hover:bg-surface/60 transition-colors">
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  <Link href={`${tabanYol}/${m.slug}`} className="hover:text-accent">
                    KTK {m.madde}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`${tabanYol}/${m.slug}`} className="hover:text-accent">
                    {m.baslik}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 text-[11px] tracking-wide uppercase",
                      m.kusurTuru === "asli" ? "bg-accent text-background" : "border border-border",
                    )}
                  >
                    {m.kusurTuru === "asli" ? "Asli" : "Tali"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">{m.cezaTutari ? formatTL(m.cezaTutari) : "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums">{m.cezaPuani ?? "—"}</td>
              </tr>
            ))}
            {sonuc.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center opacity-60">
                  Aramanıza uygun madde bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
