"use client";

import { useState } from "react";
import type { HesaplamaParametreleri } from "@/lib/calculators/params";
import { arabuluculukUcretiHesapla, harcVeGiderHesapla, islahHarciHesapla, vekaletUcretiHesapla } from "@/lib/calculators/yargilama";
import { formatSayi, formatTL } from "@/lib/calculators/core/money";
import { FormIzgara, HesaplaButonu, Onay, SayiInput, Secim, Segment, SonucPaneli, TutarInput, tutarDogrula } from "./ui";

// ── Mahkeme harç ve gider ────────────────────────────────────────────
export function HarcGider({ p }: { p: HesaplamaParametreleri }) {
  const [mahkeme, setMahkeme] = useState<"asliye" | "sulh">("asliye");
  const [tur, setTur] = useState<"nispi" | "maktu">("nispi");
  const [deger, setDeger] = useState("");
  const [taraf, setTaraf] = useState("2");
  const [tanik, setTanik] = useState("0");
  const [bilirkisi, setBilirkisi] = useState("0");
  const [kesif, setKesif] = useState(false);
  const [vekil, setVekil] = useState(true);
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<ReturnType<typeof harcVeGiderHesapla> | null>(null);

  const hesapla = () => {
    const d = tur === "nispi" ? tutarDogrula(deger, { min: 1 }) : { n: 0, hata: undefined };
    setHata(d.hata);
    if (d.n === null) return setSonuc(null);
    setSonuc(
      harcVeGiderHesapla(
        {
          mahkeme,
          tur,
          davaDegeri: d.n,
          tarafSayisi: Math.max(2, Number(taraf) || 2),
          tanikSayisi: Math.max(0, Number(tanik) || 0),
          bilirkisiSayisi: Math.max(0, Number(bilirkisi) || 0),
          kesif,
          vekil,
        },
        p,
      ),
    );
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <Segment
          etiket="Mahkeme"
          deger={mahkeme}
          onChange={setMahkeme}
          secenekler={[
            { value: "asliye", label: "Asliye / Aile / İş / Tüketici" },
            { value: "sulh", label: "Sulh hukuk" },
          ]}
        />
        <Segment
          etiket="Harç türü"
          deger={tur}
          onChange={setTur}
          secenekler={[
            { value: "nispi", label: "Nispi (para)" },
            { value: "maktu", label: "Maktu" },
          ]}
        />
        {tur === "nispi" && <TutarInput etiket="Dava değeri" deger={deger} onChange={setDeger} hata={hata} />}
        <SayiInput etiket="Toplam taraf sayısı" deger={taraf} onChange={setTaraf} min={2} ipucu="Davacı ve davalıların toplamı." />
        <SayiInput etiket="Tanık sayısı" deger={tanik} onChange={setTanik} min={0} />
        <SayiInput etiket="Bilirkişi sayısı" deger={bilirkisi} onChange={setBilirkisi} min={0} />
        <div className="flex flex-col gap-4 md:col-span-2">
          <Onay etiket="Keşif yapılacak" deger={kesif} onChange={setKesif} />
          <Onay etiket="Dava vekil (avukat) ile açılacak" deger={vekil} onChange={setVekil} ipucu="Vekalet suret harcı ve vekalet pulu eklenir." />
        </div>
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {sonuc && (
        <SonucPaneli
          anaEtiket="Dava açılışında yatırılacak tahmini toplam"
          anaDeger={formatTL(sonuc.toplam)}
          satirlar={[
            { etiket: "Harçlar", deger: "", ayrac: true },
            ...sonuc.kalemler.filter((k) => k.grup === "harc").map((k) => ({ etiket: k.ad, deger: formatTL(k.tutar) })),
            { etiket: "Harçlar toplamı", deger: formatTL(sonuc.harcToplam), vurgu: true },
            { etiket: "Gider avansı", deger: "", ayrac: true },
            ...sonuc.kalemler.filter((k) => k.grup === "avans").map((k) => ({ etiket: k.ad, deger: formatTL(k.tutar) })),
            { etiket: "Gider avansı toplamı", deger: formatTL(sonuc.avansToplam), vurgu: true },
            ...(sonuc.tamNispiHarc !== null
              ? [{ etiket: "Bilgi: toplam nispi karar ve ilam harcı", deger: formatTL(sonuc.tamNispiHarc), aciklama: "Kalan 3/4, dava kabul edilirse karar aşamasında alınır." }]
              : []),
          ]}
          notlar={[
            "Tanık ve bilirkişi giderleri mahkemece yargılama sırasında ayrıca istenebilir; tutarlar tahminidir.",
            "Kanunda öngörülen bazı davalarda ve adli yardım kararı verilmesi hâlinde harç ödenmeyebilir.",
          ]}
        />
      )}
    </>
  );
}

// ── Islah harcı ──────────────────────────────────────────────────────
export function IslahHarci({ p }: { p: HesaplamaParametreleri }) {
  const [tutar, setTutar] = useState("");
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<ReturnType<typeof islahHarciHesapla> | null>(null);

  const hesapla = () => {
    const t = tutarDogrula(tutar, { min: 1 });
    setHata(t.hata);
    setSonuc(t.n === null ? null : islahHarciHesapla(t.n, p));
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <TutarInput etiket="Islahla artırılan miktar" deger={tutar} onChange={setTutar} hata={hata} ipucu="Islah sonrası talep ile önceki talep arasındaki fark." />
        <div className="md:self-end">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Peşin ödenecek ıslah harcı"
          anaDeger={formatTL(sonuc.pesinHarc)}
          satirlar={[
            { etiket: `Nispi karar ve ilam harcı (binde ${formatSayi(p.harc.nispiBinde)})`, deger: formatTL(sonuc.tamHarc) },
            { etiket: "Peşin alınan kısım (1/4)", deger: formatTL(sonuc.pesinHarc), vurgu: true },
            { etiket: "Karar aşamasında alınabilecek kalan (3/4)", deger: formatTL(sonuc.kalanHarc) },
          ]}
          notlar={["Islah dilekçesinin verildiği gün harç yatırılmalıdır; aksi hâlde ıslah yapılmamış sayılabilir."]}
        />
      )}
    </>
  );
}

// ── Vekalet ücreti ───────────────────────────────────────────────────
export function VekaletUcreti({ p }: { p: HesaplamaParametreleri }) {
  const [tur, setTur] = useState<"nispi" | "maktu">("nispi");
  const [yer, setYer] = useState(p.aaut.maktu.find((m) => m.kod === "asliye")?.kod ?? p.aaut.maktu[0].kod);
  const [tutar, setTutar] = useState("");
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<ReturnType<typeof vekaletUcretiHesapla> | null>(null);

  const hesapla = () => {
    const t = tur === "nispi" ? tutarDogrula(tutar, { min: 1 }) : { n: 0, hata: undefined };
    setHata(t.hata);
    setSonuc(t.n === null ? null : vekaletUcretiHesapla({ tur, yargiYeri: yer, tutar: t.n }, p));
  };

  const kuralAciklamasi = {
    nispi: undefined,
    maktu: undefined,
    "maktu-alt-sinir": "Nispi ücret, yargı yeri için belirlenen maktu ücretin altında kaldığından maktu ücret uygulanmıştır.",
    "tutar-ust-sinir": "Hüküm altına alınan miktar maktu ücretin altında olduğundan ücret bu miktarla sınırlandırılmıştır.",
  } as const;

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <Segment
          etiket="Dava türü"
          deger={tur}
          onChange={setTur}
          secenekler={[
            { value: "nispi", label: "Konusu para olan (nispi)" },
            { value: "maktu", label: "Konusu para olmayan (maktu)" },
          ]}
        />
        <Secim etiket="Yargı yeri" deger={yer} onChange={setYer} secenekler={p.aaut.maktu.map((m) => ({ value: m.kod, label: m.ad }))} />
        {tur === "nispi" && (
          <TutarInput etiket="Kabul veya ret edilen miktar" deger={tutar} onChange={setTutar} hata={hata} ipucu="Hüküm altına alınan veya reddedilen tutar." />
        )}
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Avukatlık Asgari Ücret Tarifesine göre vekalet ücreti"
          anaDeger={formatTL(sonuc.ucret)}
          satirlar={[
            { etiket: "Yargı yeri maktu ücreti", deger: formatTL(sonuc.maktu.tutar), aciklama: sonuc.maktu.ad },
            ...(sonuc.nispi !== null
              ? [
                  { etiket: "Nispi hesap", deger: "", ayrac: true },
                  ...sonuc.detay.map((d) => ({ etiket: `${formatTL(d.tutar)} × %${formatSayi(d.oran)}`, deger: formatTL(d.sonuc) })),
                  { etiket: "Nispi ücret toplamı", deger: formatTL(sonuc.nispi) },
                ]
              : []),
            { etiket: "Uygulanan vekalet ücreti", deger: formatTL(sonuc.ucret), vurgu: true, aciklama: kuralAciklamasi[sonuc.kural] },
          ]}
          notlar={[
            "Bu tutar, yargılama sonunda karşı tarafa yükletilen asgari vekalet ücretidir. Avukat ile müvekkil arasındaki ücret sözleşmesi bu tarifenin altında olamaz.",
          ]}
        />
      )}
    </>
  );
}

// ── Arabuluculuk ücreti ──────────────────────────────────────────────
export function ArabuluculukUcreti({ p }: { p: HesaplamaParametreleri }) {
  const [sonucTur, setSonucTur] = useState<"anlasma" | "anlasamama">("anlasma");
  const [parasal, setParasal] = useState<"evet" | "hayir">("evet");
  const [tur, setTur] = useState(p.arabuluculuk.saatlik[0]?.tur ?? "diger");
  const [taraf, setTaraf] = useState("2");
  const [arabulucu, setArabulucu] = useState("1");
  const [saat, setSaat] = useState("2");
  const [tutar, setTutar] = useState("");
  const [hata, setHata] = useState<string>();
  const [sonuc, setSonuc] = useState<ReturnType<typeof arabuluculukUcretiHesapla> | null>(null);

  const nispiMi = sonucTur === "anlasma" && parasal === "evet";

  const hesapla = () => {
    const t = nispiMi ? tutarDogrula(tutar, { min: 1 }) : { n: 0, hata: undefined };
    setHata(t.hata);
    if (t.n === null) return setSonuc(null);
    setSonuc(
      arabuluculukUcretiHesapla(
        {
          sonuc: sonucTur,
          parasal: parasal === "evet",
          tur,
          tarafSayisi: Math.max(2, Number(taraf) || 2),
          arabulucuSayisi: Math.max(1, Number(arabulucu) || 1),
          saat: Math.max(0, Number(saat.replace(",", ".")) || 0),
          tutar: t.n,
        },
        p,
      ),
    );
  };

  return (
    <>
      <FormIzgara onSubmit={hesapla}>
        <Segment
          etiket="Arabuluculuk sonucu"
          deger={sonucTur}
          onChange={setSonucTur}
          secenekler={[
            { value: "anlasma", label: "Anlaşma" },
            { value: "anlasamama", label: "Anlaşamama" },
          ]}
        />
        <Segment
          etiket="Uyuşmazlık konusu para mı?"
          deger={parasal}
          onChange={setParasal}
          secenekler={[
            { value: "evet", label: "Evet" },
            { value: "hayir", label: "Hayır" },
          ]}
        />
        <Secim etiket="Uyuşmazlık türü" deger={tur} onChange={setTur} secenekler={p.arabuluculuk.saatlik.map((s) => ({ value: s.tur, label: s.ad }))} />
        <SayiInput etiket="Taraf sayısı" deger={taraf} onChange={setTaraf} min={2} />
        <SayiInput etiket="Arabulucu sayısı" deger={arabulucu} onChange={setArabulucu} min={1} />
        {nispiMi ? (
          <TutarInput etiket="Anlaşma bedeli" deger={tutar} onChange={setTutar} hata={hata} />
        ) : (
          <SayiInput
            etiket="Görüşme süresi"
            birim="saat"
            deger={saat}
            onChange={setSaat}
            min={0}
            step={0.5}
            ipucu={`${formatSayi(p.arabuluculuk.asgariSaat)} saatten az süreler ${formatSayi(p.arabuluculuk.asgariSaat)} saat sayılır.`}
          />
        )}
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>
      {sonuc && (
        <SonucPaneli
          anaEtiket="Toplam arabuluculuk ücreti"
          anaDeger={formatTL(sonuc.ucret)}
          satirlar={
            sonuc.yontem === "nispi"
              ? [
                  ...sonuc.detay.map((d) => ({ etiket: `${formatTL(d.tutar)} × %${formatSayi(d.oran)}`, deger: formatTL(d.sonuc) })),
                  { etiket: "Nispi ücret", deger: formatTL(sonuc.nispi ?? 0) },
                  ...(sonuc.asgariUygulandi ? [{ etiket: "Asgari ücret uygulandı", deger: formatTL(sonuc.asgari ?? 0) }] : []),
                  { etiket: "Arabulucu başına", deger: formatTL(sonuc.arabulucuBasi) },
                  { etiket: "Taraf başına (eşit ödeme)", deger: formatTL(sonuc.tarafBasi), vurgu: true },
                ]
              : [
                  { etiket: "Saat ücreti", deger: formatTL(sonuc.saatUcreti), aciklama: sonuc.tarife.ad },
                  { etiket: "Ücretlendirilen süre", deger: `${formatSayi(sonuc.saat)} saat` },
                  { etiket: "Arabulucu başına", deger: formatTL(sonuc.arabulucuBasi) },
                  { etiket: "Taraf başına (eşit ödeme)", deger: formatTL(sonuc.tarafBasi), vurgu: true },
                ]
          }
          notlar={[
            "Aksi kararlaştırılmadıkça arabuluculuk ücreti taraflarca eşit ödenir.",
            "Dava şartı arabuluculukta taraflar anlaşamazsa, iki saatlik ücret Adalet Bakanlığı bütçesinden ödenir ve yargılama giderine eklenir.",
            "Kira tespiti ve tahliye uyuşmazlıklarında anlaşma hâlinde ücret, tarifenin 7/5 maddesindeki özel esasa göre belirlenir.",
          ]}
        />
      )}
    </>
  );
}
