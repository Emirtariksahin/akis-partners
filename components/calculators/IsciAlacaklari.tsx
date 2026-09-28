"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { fazlaMesaiHesapla, ubgtHesapla, yillikIzinHesapla, YILLIK_FAZLA_MESAI_SINIRI } from "@/lib/calculators/is-hukuku";
import { formatTL, formatSayi } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, Secim, Segment, SayiInput, SonucPaneli, TutarInput, tutarDogrula, type SonucSatiri } from "./ui";

const GV_ORANLARI = [15, 20, 27, 35, 40].map((o) => ({ value: String(o), label: `%${o}` }));

function kesintiSatirlari(s: { sgk: number; issizlik: number; gelirVergisi: number; damga: number; net: number }, gv: string): SonucSatiri[] {
  return [
    { etiket: "SGK işçi payı (%14)", deger: `− ${formatTL(s.sgk)}` },
    { etiket: "İşsizlik sigortası (%1)", deger: `− ${formatTL(s.issizlik)}` },
    { etiket: `Gelir vergisi (%${gv})`, deger: `− ${formatTL(s.gelirVergisi)}` },
    { etiket: "Damga vergisi", deger: `− ${formatTL(s.damga)}` },
    { etiket: "Net tutar", deger: formatTL(s.net), vurgu: true },
  ];
}

// ── Yıllık izin ──────────────────────────────────────────────────────
export function YillikIzin({ p }: { p: HesaplamaParametreleri }) {
  const [calisan, setCalisan] = useState<"isci" | "memur">("isci");
  const [yil, setYil] = useState("");
  const [yas, setYas] = useState("");
  const [ucret, setUcret] = useState("");
  const [kullanilmayan, setKullanilmayan] = useState("");
  const [gv, setGv] = useState("15");
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof yillikIzinHesapla> | null>(null);

  const hesapla = () => {
    const y = Number(yil);
    const a = Number(yas);
    const u = tutarDogrula(ucret, { min: 1 });
    const k = kullanilmayan.trim() === "" ? null : Number(kullanilmayan);
    const h = {
      yil: yil === "" || y < 0 ? "Hizmet süresini giriniz." : undefined,
      yas: yas === "" || a < 14 || a > 100 ? "Geçerli bir yaş giriniz." : undefined,
      ucret: u.hata,
      kullanilmayan: k !== null && (Number.isNaN(k) || k < 0) ? "Geçerli bir gün sayısı giriniz." : undefined,
    };
    setHatalar(h);
    if (Object.values(h).some(Boolean) || u.n === null) return setSonuc(null);
    setSonuc(yillikIzinHesapla({ calisan, hizmetYili: Math.floor(y), yas: a, brutUcret: u.n, kullanilmayanGun: k, gvOraniYuzde: Number(gv) }, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <Segment etiket="Çalışan türü" deger={calisan} onChange={setCalisan} secenekler={[{ value: "isci", label: "İşçi (4857)" }, { value: "memur", label: "Memur (657)" }]} />
        <SayiInput etiket="Hizmet süresi" birim="yıl" deger={yil} onChange={setYil} min={0} hata={hatalar.yil} ipucu="Deneme süresi dahil, tamamlanan yıl sayısı." />
        <SayiInput etiket="Yaş" deger={yas} onChange={setYas} min={14} hata={hatalar.yas} />
        <TutarInput etiket="Aylık brüt ücret" deger={ucret} onChange={setUcret} hata={hatalar.ucret} />
        <SayiInput
          etiket="Kullanılmayan izin günü (isteğe bağlı)"
          birim="gün"
          deger={kullanilmayan}
          onChange={setKullanilmayan}
          min={0}
          hata={hatalar.kullanilmayan}
          ipucu="Boş bırakılırsa bir yıllık izin hakkı kadar ücret hesaplanır."
        />
        <Secim etiket="Gelir vergisi dilimi" deger={gv} onChange={setGv} secenekler={GV_ORANLARI} />
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Yıllık izin hakkı"
          anaDeger={`${sonuc.hakGun} gün`}
          satirlar={[
            { etiket: "Günlük brüt ücret", deger: formatTL(sonuc.gunluk) },
            { etiket: `İzin ücreti (${sonuc.ucretGun} gün, brüt)`, deger: formatTL(sonuc.brut) },
            ...kesintiSatirlari(sonuc, gv),
          ]}
          notlar={[
            "Kullanılmayan yıllık izin ücreti, iş sözleşmesinin sona ermesi hâlinde son ücret üzerinden ödenir (İK m.59).",
            calisan === "isci" ? "18 yaş ve altı ile 50 yaş ve üstü işçilere verilecek izin 20 günden az olamaz." : "Memurlar için izin ücreti ödemesi yerine izin hakkı kullanılır; ücret hesabı bilgi amaçlıdır.",
          ]}
        />
      )}
    </>
  );
}

// ── Fazla mesai ──────────────────────────────────────────────────────
export function FazlaMesai({ p }: { p: HesaplamaParametreleri }) {
  const [ucret, setUcret] = useState("");
  const [saat, setSaat] = useState("");
  const [zam, setZam] = useState<"50" | "25">("50");
  const [gv, setGv] = useState("15");
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof fazlaMesaiHesapla> | null>(null);

  const hesapla = () => {
    const u = tutarDogrula(ucret, { min: 1 });
    const s = Number(saat.replace(",", "."));
    const h = { ucret: u.hata, saat: !saat || Number.isNaN(s) || s <= 0 ? "Fazla çalışma saatini giriniz." : undefined };
    setHatalar(h);
    if (h.ucret || h.saat || u.n === null) return setSonuc(null);
    setSonuc(fazlaMesaiHesapla({ brutUcret: u.n, saat: s, zamYuzde: zam === "50" ? 50 : 25, gvOraniYuzde: Number(gv) }, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <TutarInput etiket="Aylık brüt ücret" deger={ucret} onChange={setUcret} hata={hatalar.ucret} />
        <SayiInput etiket="Fazla çalışma süresi" birim="saat" deger={saat} onChange={setSaat} min={0} step={0.5} hata={hatalar.saat} />
        <Segment
          etiket="Çalışma türü"
          deger={zam}
          onChange={setZam}
          secenekler={[
            { value: "50", label: "Fazla çalışma (%50)" },
            { value: "25", label: "Fazla sürelerle (%25)" },
          ]}
        />
        <Secim etiket="Gelir vergisi dilimi" deger={gv} onChange={setGv} secenekler={GV_ORANLARI} />
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Net fazla mesai ücreti"
          anaDeger={formatTL(sonuc.net)}
          satirlar={[
            { etiket: "Saatlik brüt ücret (brüt / 225)", deger: formatTL(sonuc.saatlik) },
            { etiket: `Zamlı saat ücreti (%${zam})`, deger: formatTL(sonuc.zamliSaatlik) },
            { etiket: `Brüt fazla mesai (${formatSayi(Number(saat.replace(",", ".")))} saat)`, deger: formatTL(sonuc.brut) },
            ...kesintiSatirlari(sonuc, gv),
          ]}
          notlar={[
            "Haftalık 45 saati aşan çalışmalar fazla çalışmadır (%50 zamlı). Sözleşmede haftalık süre 45 saatin altında belirlenmişse, bu süreyi aşıp 45 saate kadar yapılan çalışmalar fazla sürelerle çalışmadır (%25 zamlı).",
            ...(sonuc.sinirAsildi ? [`Fazla çalışma süresi yılda ${YILLIK_FAZLA_MESAI_SINIRI} saatten fazla olamaz (İK m.41).`] : []),
          ]}
        />
      )}
    </>
  );
}

// ── UBGT ─────────────────────────────────────────────────────────────
export function Ubgt({ p }: { p: HesaplamaParametreleri }) {
  const [ucret, setUcret] = useState("");
  const [gun, setGun] = useState("");
  const [saat, setSaat] = useState("7.5");
  const [gv, setGv] = useState("15");
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof ubgtHesapla> | null>(null);

  const hesapla = () => {
    const u = tutarDogrula(ucret, { min: 1 });
    const g = Number(gun.replace(",", "."));
    const s = Number(saat.replace(",", "."));
    const h = {
      ucret: u.hata,
      gun: !gun || Number.isNaN(g) || g <= 0 ? "Çalışılan tatil günü sayısını giriniz." : undefined,
      saat: Number.isNaN(s) || s <= 0 ? "Günlük çalışma saatini giriniz." : undefined,
    };
    setHatalar(h);
    if (Object.values(h).some(Boolean) || u.n === null) return setSonuc(null);
    setSonuc(ubgtHesapla({ brutUcret: u.n, gun: g, gunlukSaat: s, normalSaat: 7.5, gvOraniYuzde: Number(gv) }, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <TutarInput etiket="Aylık brüt ücret" deger={ucret} onChange={setUcret} hata={hatalar.ucret} />
        <SayiInput etiket="Çalışılan UBGT günü" birim="gün" deger={gun} onChange={setGun} min={0} step={0.5} hata={hatalar.gun} />
        <SayiInput
          etiket="Tatil gününde çalışılan saat"
          birim="saat"
          deger={saat}
          onChange={setSaat}
          min={0}
          step={0.5}
          hata={hatalar.saat}
          ipucu="Tam gün (7,5 saat) altında çalışmada ücret orantılı hesaplanır."
        />
        <Secim etiket="Gelir vergisi dilimi" deger={gv} onChange={setGv} secenekler={GV_ORANLARI} />
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Net UBGT ücreti"
          anaDeger={formatTL(sonuc.net)}
          satirlar={[
            { etiket: "Günlük brüt ücret (brüt / 30)", deger: formatTL(sonuc.gunluk) },
            { etiket: "Brüt UBGT ücreti", deger: formatTL(sonuc.brut) },
            ...kesintiSatirlari(sonuc, gv),
          ]}
          notlar={[
            "Ulusal bayram ve genel tatil günlerinde çalışılmasa da tam ücret ödenir; çalışılan her tatil günü için ayrıca bir günlük ücret ödenir (İK m.47). Hesaplanan tutar bu ilave ücrettir.",
          ]}
        />
      )}
    </>
  );
}
