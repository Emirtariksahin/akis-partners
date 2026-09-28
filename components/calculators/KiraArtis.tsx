"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { ayEtiketi, kiraArtisHesapla, kiraAylari } from "@/lib/calculators/kira";
import { formatTL, formatYuzde } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, Secim, SonucPaneli, TutarInput, tutarDogrula } from "./ui";

export function KiraArtis({ p }: { p: HesaplamaParametreleri }) {
  const aylar = kiraAylari(p);
  const [kira, setKira] = useState("");
  const [ay, setAy] = useState(aylar[0]?.ay ?? "");
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<ReturnType<typeof kiraArtisHesapla>>(null);

  const hesapla = () => {
    const k = tutarDogrula(kira, { min: 1 });
    setHata(k.hata);
    setSonuc(k.n === null ? null : kiraArtisHesapla(k.n, ay, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <TutarInput etiket="Mevcut aylık kira bedeli" deger={kira} onChange={setKira} hata={hata} />
        <Secim
          etiket="Kira artışının yapılacağı ay"
          deger={ay}
          onChange={setAy}
          secenekler={aylar.map((a) => ({ value: a.ay, label: `${ayEtiketi(a.ay)} — ${formatYuzde(a.oran)}` }))}
          ipucu="Kira sözleşmenizin yenilendiği ay."
        />
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {sonuc && (
        <SonucPaneli
          anaEtiket="Yeni aylık kira bedeli (azami)"
          anaDeger={formatTL(sonuc.yeniKira)}
          satirlar={[
            { etiket: "Uygulanabilecek en yüksek artış oranı", deger: formatYuzde(sonuc.oran), aciklama: `${ayEtiketi(ay)} için TÜFE 12 aylık ortalama değişim oranı` },
            { etiket: "Aylık artış tutarı", deger: formatTL(sonuc.artis) },
            { etiket: "Yıllık ek maliyet", deger: formatTL(sonuc.yillikFark) },
          ]}
          notlar={[
            "Konut ve çatılı işyeri kiralarında yenilenen dönemlerdeki artış, bir önceki kira yılının TÜFE on iki aylık ortalamalara göre değişim oranını geçemez (TBK m.344). Taraflar daha düşük bir oran kararlaştırabilir.",
            "Beş yıldan uzun süren kira ilişkilerinde ve yenilenen her beş yıllık dönemde, kira bedeli hâkim tarafından emsal kira bedelleri de dikkate alınarak yeniden belirlenebilir.",
          ]}
        />
      )}

      <div className="mt-12 overflow-x-auto border border-border">
        <table className="w-full font-sans text-sm tabular-nums">
          <caption className="text-left p-4 font-sans text-xs tracking-widest uppercase text-accent">Aylara göre kira artış oranları</caption>
          <thead className="bg-surface">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium text-xs tracking-wide">Kira artış ayı</th>
              <th className="px-4 py-3 font-medium text-xs tracking-wide text-right">Azami artış oranı</th>
            </tr>
          </thead>
          <tbody>
            {aylar.map((a) => (
              <tr key={a.ay} className="border-t border-border">
                <td className="px-4 py-2.5">{ayEtiketi(a.ay)}</td>
                <td className="px-4 py-2.5 text-right">{formatYuzde(a.oran)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
