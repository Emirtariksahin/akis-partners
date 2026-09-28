"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { kidemIhbarHesapla } from "@/lib/calculators/is-hukuku";
import { formatSure, formatTarihKisa, parseTarih } from "@/lib/calculators/core/dates";
import { formatTL, formatSayi } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, Secim, SonucPaneli, TarihInput, TutarInput, tutarDogrula } from "./ui";

const GV_ORANLARI = [15, 20, 27, 35, 40].map((o) => ({ value: String(o), label: `%${o}` }));

export function KidemIhbar({ p }: { p: HesaplamaParametreleri }) {
  const [giris, setGiris] = useState("");
  const [cikis, setCikis] = useState("");
  const [ucret, setUcret] = useState("");
  const [gv, setGv] = useState("15");
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof kidemIhbarHesapla> | null>(null);

  const hesapla = () => {
    const g = parseTarih(giris);
    const c = parseTarih(cikis);
    const u = tutarDogrula(ucret, { min: 1 });
    const h = {
      giris: g ? undefined : "İşe giriş tarihini seçiniz.",
      cikis: !c ? "İşten çıkış tarihini seçiniz." : g && c <= g ? "Çıkış tarihi girişten sonra olmalıdır." : undefined,
      ucret: u.hata,
    };
    setHatalar(h);
    if (h.giris || h.cikis || h.ucret || !g || !c || u.n === null) return setSonuc(null);
    setSonuc(kidemIhbarHesapla({ giris: g, cikis: c, brutUcret: u.n, gvOraniYuzde: Number(gv) }, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <TarihInput etiket="İşe giriş tarihi" deger={giris} onChange={setGiris} hata={hatalar.giris} />
        <TarihInput etiket="İşten çıkış tarihi" deger={cikis} onChange={setCikis} hata={hatalar.cikis} />
        <TutarInput
          etiket="Giydirilmiş brüt ücret (aylık)"
          deger={ucret}
          onChange={setUcret}
          hata={hatalar.ucret}
          ipucu="Çıplak brüt ücrete düzenli ödenen yol, yemek, ikramiye gibi ödemelerin aylık karşılığı eklenir."
        />
        <Secim etiket="İhbar için gelir vergisi dilimi" deger={gv} onChange={setGv} secenekler={GV_ORANLARI} />
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {sonuc && (
        <SonucPaneli
          anaEtiket="Kıdem + ihbar tazminatı (net toplam)"
          anaDeger={formatTL(sonuc.toplamNet)}
          satirlar={[
            { etiket: "Çalışma süresi", deger: formatSure(sonuc.sure) },
            {
              etiket: "Kıdem tavanı",
              deger: formatTL(sonuc.tavan.tutar),
              aciklama: sonuc.tavan.donem
                ? `${formatTarihKisa(parseTarih(sonuc.tavan.donem.baslangic)!)} – ${formatTarihKisa(parseTarih(sonuc.tavan.donem.bitis)!)} dönemi${sonuc.tavan.tahmini ? " (en güncel tavan)" : ""}`
                : undefined,
            },
            { etiket: "Kıdeme esas ücret", deger: formatTL(sonuc.esasUcret), aciklama: sonuc.tavanUygulandi ? "Ücret tavanı aştığı için tavan esas alındı." : undefined },
            { etiket: "Kıdem tazminatı", deger: "", ayrac: true },
            ...(sonuc.kidem.hakVar
              ? [
                  { etiket: `${sonuc.sure.yil} yıl için`, deger: formatTL(sonuc.kidem.yilTutari) },
                  { etiket: `${sonuc.sure.ay} ay için`, deger: formatTL(sonuc.kidem.ayTutari) },
                  { etiket: `${sonuc.sure.gun} gün için`, deger: formatTL(sonuc.kidem.gunTutari) },
                  { etiket: "Brüt kıdem tazminatı", deger: formatTL(sonuc.kidem.brut) },
                  { etiket: `Damga vergisi (binde ${formatSayi(p.kesintiler.damgaBinde)})`, deger: `− ${formatTL(sonuc.kidem.damga)}` },
                  { etiket: "Net kıdem tazminatı", deger: formatTL(sonuc.kidem.net), vurgu: true },
                ]
              : [{ etiket: "Kıdem tazminatı", deger: formatTL(0), aciklama: "Kıdem tazminatı için en az 1 yıl çalışma şartı aranır." }]),
            { etiket: "İhbar tazminatı", deger: "", ayrac: true },
            { etiket: "İhbar süresi", deger: `${sonuc.ihbar.hafta} hafta (${sonuc.ihbar.gun} gün)` },
            { etiket: "Brüt ihbar tazminatı", deger: formatTL(sonuc.ihbar.brut) },
            { etiket: `Gelir vergisi (%${gv})`, deger: `− ${formatTL(sonuc.ihbar.gelirVergisi)}` },
            { etiket: "Damga vergisi", deger: `− ${formatTL(sonuc.ihbar.damga)}` },
            { etiket: "Net ihbar tazminatı", deger: formatTL(sonuc.ihbar.net), vurgu: true },
          ]}
          notlar={[
            "İhbar tazminatı yalnızca bildirim süresine uyulmadan yapılan fesihlerde doğar; kıdem tazminatı hakkı ise fesih sebebine göre değişir.",
            "Kıdem tazminatından gelir vergisi kesilmez; yalnızca damga vergisi kesilir (GVK m.25/7).",
          ]}
        />
      )}
    </>
  );
}
