"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { tazminatHesapla } from "@/lib/calculators/tazminat";
import { bugunIso, parseTarih } from "@/lib/calculators/core/dates";
import { formatSayi, formatTL } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, SayiInput, Secim, Segment, SonucPaneli, TarihInput, TutarInput, Uyari, tutarDogrula } from "./ui";

const KUSURLAR = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90].map((k) => ({ value: String(k), label: `%${k}` }));

export function Tazminat({ p, tur }: { p: HesaplamaParametreleri; tur: "trafik" | "is" }) {
  const [kazaTarihi, setKazaTarihi] = useState("");
  const [dogumTarihi, setDogumTarihi] = useState("");
  const [cinsiyet, setCinsiyet] = useState<"erkek" | "kadin">("erkek");
  const [gelir, setGelir] = useState("");
  const [maluliyet, setMaluliyet] = useState("");
  const [kusur, setKusur] = useState("0");
  const [aktifYas, setAktifYas] = useState("65");
  const [psd, setPsd] = useState("");
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof tazminatHesapla>>(null);

  const hesapla = () => {
    const g = tutarDogrula(gelir, { min: 1 });
    const m = Number(maluliyet.replace(",", "."));
    const ps = tur === "is" ? tutarDogrula(psd, { zorunlu: false }) : { n: 0, hata: undefined };
    const kaza = parseTarih(kazaTarihi);
    const h = {
      kaza: !kaza ? "Kaza tarihini seçiniz." : kazaTarihi > bugunIso() ? "Kaza tarihi bugünden sonra olamaz." : undefined,
      dogum: parseTarih(dogumTarihi) ? undefined : "Doğum tarihini seçiniz.",
      gelir: g.hata,
      maluliyet: !maluliyet || Number.isNaN(m) || m <= 0 || m > 100 ? "0 ile 100 arasında bir oran giriniz." : undefined,
      psd: ps.hata,
    };
    setHatalar(h);
    if (Object.values(h).some(Boolean) || g.n === null) return setSonuc(null);
    setSonuc(
      tazminatHesapla(
        {
          kazaTarihi,
          hesapTarihi: bugunIso(),
          dogumTarihi,
          cinsiyet,
          netGelir: g.n,
          maluliyetYuzde: m,
          kusurYuzde: Number(kusur),
          aktifYasSiniri: Number(aktifYas),
          sgkPsd: ps.n ?? 0,
        },
        p,
      ),
    );
  };

  return (
    <>
      <Uyari tur="dikkat">
        Tazminat, mahkemece alınan aktüerya bilirkişi raporuyla; kazanç belgeleri, maluliyet raporu ve kusur raporu esas alınarak
        belirlenir. Bu araç yalnızca yaklaşık bir büyüklük vermek amacıyla sadeleştirilmiş bir yöntem kullanır.
      </Uyari>
      <div className="h-8" />
      <FormIzgara onSubmit={hesapla}>
        <TarihInput etiket="Kaza tarihi" deger={kazaTarihi} onChange={setKazaTarihi} hata={hatalar.kaza} />
        <TarihInput etiket="Zarar görenin doğum tarihi" deger={dogumTarihi} onChange={setDogumTarihi} hata={hatalar.dogum} />
        <Segment
          etiket="Cinsiyet"
          deger={cinsiyet}
          onChange={setCinsiyet}
          secenekler={[
            { value: "erkek", label: "Erkek" },
            { value: "kadin", label: "Kadın" },
          ]}
        />
        <TutarInput
          etiket="Aylık net gelir"
          deger={gelir}
          onChange={setGelir}
          hata={hatalar.gelir}
          ipucu={`Geliri belgelenemeyenler için net asgari ücret (${formatTL(p.asgariUcret.net)}) esas alınır.`}
        />
        <SayiInput
          etiket="Sürekli maluliyet (iş göremezlik) oranı"
          birim="%"
          deger={maluliyet}
          onChange={setMaluliyet}
          min={0}
          max={100}
          step={0.1}
          hata={hatalar.maluliyet}
        />
        <Secim
          etiket={tur === "is" ? "İşçinin kusur oranı" : "Zarar görenin kusur oranı"}
          deger={kusur}
          onChange={setKusur}
          secenekler={KUSURLAR}
        />
        <Secim
          etiket="Aktif çalışma yaşı sınırı"
          deger={aktifYas}
          onChange={setAktifYas}
          secenekler={[
            { value: "60", label: "60 yaş" },
            { value: "65", label: "65 yaş" },
          ]}
        />
        {tur === "is" && (
          <TutarInput
            etiket="SGK gelirinin peşin sermaye değeri (varsa)"
            deger={psd}
            onChange={setPsd}
            hata={hatalar.psd}
            ipucu="SGK tarafından bağlanan sürekli iş göremezlik gelirinin ilk peşin sermaye değeri tazminattan düşülür."
          />
        )}
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {sonuc && (
        <SonucPaneli
          tahmini
          anaEtiket="Tahmini maddi tazminat (sürekli iş göremezlik)"
          anaDeger={formatTL(sonuc.net)}
          satirlar={[
            { etiket: "Kaza tarihindeki yaş", deger: `${sonuc.kazaYasi}` },
            { etiket: "Bakiye ömür (TRH-2010)", deger: `${formatSayi(sonuc.omur)} yıl` },
            { etiket: "Uygulanan oran", deger: `%${formatSayi(sonuc.oran * 100)}`, aciklama: "Maluliyet oranı × (1 − kusur oranı)" },
            { etiket: "Dönemler", deger: "", ayrac: true },
            ...sonuc.donemler.map((d) => ({
              etiket: d.ad,
              deger: formatTL(d.tutar),
              aciklama: `${formatSayi(d.gun)} gün × ${formatTL(d.gelir)} / 30`,
            })),
            { etiket: "Toplam", deger: formatTL(sonuc.toplam) },
            ...(sonuc.psd > 0 ? [{ etiket: "SGK peşin sermaye değeri mahsubu", deger: `− ${formatTL(sonuc.psd)}` }] : []),
            { etiket: "Tahmini tazminat", deger: formatTL(sonuc.net), vurgu: true },
          ]}
          notlar={[
            "Progresif rant yönteminde gelir artışı ile iskonto oranı eşit (%10) kabul edildiğinden, gelecek dönem tutarları bugünkü değerle gösterilmiştir.",
            "Geçici iş göremezlik, bakıcı gideri, tedavi giderleri ve manevi tazminat bu hesaba dahil değildir.",
            ...(tur === "trafik"
              ? ["Trafik kazalarında sigorta şirketinin sorumluluğu, kaza tarihindeki zorunlu mali sorumluluk sigortası teminat limitiyle sınırlıdır."]
              : ["İş kazalarında bazı Yargıtay dairelerinin farklı yaşam tabloları (PMF-1931) kullanabildiğini dikkate alınız."]),
          ]}
        />
      )}
    </>
  );
}
