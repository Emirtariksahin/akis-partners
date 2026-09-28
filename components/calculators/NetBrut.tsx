"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { bruttenNete, nettenBrute, type BordroSonucu } from "@/lib/calculators/core/payroll";
import { formatTL } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, Secim, Segment, SonucPaneli, TutarInput, tutarDogrula } from "./ui";

const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function NetBrut({ p }: { p: HesaplamaParametreleri }) {
  const [yon, setYon] = useState<"brut" | "net">("brut");
  const [tutar, setTutar] = useState("");
  const [ay, setAy] = useState("1");
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<{ secili: BordroSonucu; yillik: BordroSonucu[] } | null>(null);

  const hesapla = () => {
    const t = tutarDogrula(tutar, { min: 1 });
    setHata(t.hata);
    if (t.n === null) return setSonuc(null);
    const hesap = (a: number) => (yon === "brut" ? bruttenNete(t.n!, a, p) : nettenBrute(t.n!, a, p));
    const yillik = AYLAR.map((_, i) => hesap(i + 1));
    setSonuc({ secili: yillik[Number(ay) - 1], yillik });
  };

  const s = sonuc?.secili;

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <Segment
          etiket="Hesaplama yönü"
          deger={yon}
          onChange={setYon}
          secenekler={[
            { value: "brut", label: "Brütten nete" },
            { value: "net", label: "Netten brüte" },
          ]}
        />
        <TutarInput etiket={yon === "brut" ? "Aylık brüt ücret" : "Aylık net ücret"} deger={tutar} onChange={setTutar} hata={hata} />
        <Secim
          etiket="Hesaplanacak ay"
          deger={ay}
          onChange={setAy}
          secenekler={AYLAR.map((a, i) => ({ value: String(i + 1), label: a }))}
          ipucu="Gelir vergisi yıl içinde kümülatif hesaplandığından sonuç aya göre değişir."
        />
        <div className="md:self-end">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {s && sonuc && (
        <>
          <SonucPaneli
            anaEtiket={`${AYLAR[Number(ay) - 1]} ayı ${yon === "brut" ? "net ücret" : "brüt ücret"}`}
            anaDeger={formatTL(yon === "brut" ? s.net : s.brut)}
            satirlar={[
              { etiket: "Brüt ücret", deger: formatTL(s.brut) },
              { etiket: `SGK işçi payı (%${p.kesintiler.sgkIsciYuzde})`, deger: `− ${formatTL(s.sgk)}` },
              { etiket: `İşsizlik sigortası (%${p.kesintiler.issizlikIsciYuzde})`, deger: `− ${formatTL(s.issizlik)}` },
              { etiket: "Gelir vergisi matrahı", deger: formatTL(s.gvMatrahi) },
              { etiket: "Gelir vergisi", deger: `− ${formatTL(s.gelirVergisi)}`, aciklama: `Asgari ücret istisnası ${formatTL(s.gvIstisnasi)} düşülmüştür.` },
              { etiket: "Damga vergisi", deger: `− ${formatTL(s.damga)}`, aciklama: `Asgari ücret istisnası ${formatTL(s.damgaIstisnasi)} düşülmüştür.` },
              { etiket: "Net ücret", deger: formatTL(s.net), vurgu: true },
            ]}
            notlar={[
              "Yılbaşından itibaren her ay aynı ücretin ödendiği, ek ödeme ve engellilik indirimi olmadığı varsayılmıştır.",
              `SGK primleri, prim tavanı (${formatTL(p.asgariUcret.brut * p.kesintiler.sgkTavanKati)}) ile sınırlıdır.`,
            ]}
          />

          <div className="mt-10 overflow-x-auto border border-border">
            <table className="w-full font-sans text-sm tabular-nums min-w-[640px]">
              <caption className="text-left p-4 font-sans text-xs tracking-widest uppercase text-accent">Yıllık döküm</caption>
              <thead className="bg-surface">
                <tr className="text-left">
                  {["Ay", "Brüt", "SGK + İşsizlik", "Gelir vergisi", "Damga", "Net"].map((b) => (
                    <th key={b} className="px-4 py-3 font-medium text-xs tracking-wide">{b}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sonuc.yillik.map((r, i) => (
                  <tr key={i} className={i === Number(ay) - 1 ? "bg-accent/10" : "border-t border-border"}>
                    <td className="px-4 py-2.5">{AYLAR[i]}</td>
                    <td className="px-4 py-2.5">{formatTL(r.brut)}</td>
                    <td className="px-4 py-2.5">{formatTL(r.sgk + r.issizlik)}</td>
                    <td className="px-4 py-2.5">{formatTL(r.gelirVergisi)}</td>
                    <td className="px-4 py-2.5">{formatTL(r.damga)}</td>
                    <td className="px-4 py-2.5 font-medium">{formatTL(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
