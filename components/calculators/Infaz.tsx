"use client";

import { useState } from "react";
import { SUC_TURLERI, infazHesapla } from "@/lib/calculators/infaz";
import { formatSure, formatTarihKisa, gunuSureyeCevir, parseTarih } from "@/lib/calculators/core/dates";
import { FormIzgara, HesaplaButonu, Onay, SayiInput, Secim, SonucPaneli, TarihInput, Uyari } from "./ui";

export function Infaz() {
  const [sucTuru, setSucTuru] = useState("genel");
  const [yil, setYil] = useState("");
  const [ay, setAy] = useState("0");
  const [gun, setGun] = useState("0");
  const [sucTarihi, setSucTarihi] = useState("");
  const [dogumTarihi, setDogumTarihi] = useState("");
  const [girisTarihi, setGirisTarihi] = useState("");
  const [mahsup, setMahsup] = useState("0");
  const [mukerrir, setMukerrir] = useState(false);
  const [ikinciTekerrur, setIkinciTekerrur] = useState(false);
  const [kadinCocuklu, setKadinCocuklu] = useState(false);
  const [agirHasta, setAgirHasta] = useState(false);
  const [hatalar, setHatalar] = useState<Record<string, string | undefined>>({});
  const [sonuc, setSonuc] = useState<ReturnType<typeof infazHesapla>>(null);

  const muebbet = SUC_TURLERI.find((s) => s.value === sucTuru)?.grup.includes("uebbet");

  const hesapla = () => {
    const y = Number(yil || 0);
    const a = Number(ay || 0);
    const g = Number(gun || 0);
    const h = {
      ceza: !muebbet && y * 365 + a * 30 + g <= 0 ? "Hapis cezası süresini giriniz." : undefined,
      sucTarihi: parseTarih(sucTarihi) ? undefined : "Suç tarihini seçiniz.",
      dogumTarihi: parseTarih(dogumTarihi) ? undefined : "Doğum tarihini seçiniz.",
      girisTarihi: parseTarih(girisTarihi) ? undefined : "Cezaevine giriş tarihini seçiniz.",
    };
    setHatalar(h);
    if (Object.values(h).some(Boolean)) return setSonuc(null);
    setSonuc(
      infazHesapla({
        sucTuru,
        cezaYil: y,
        cezaAy: a,
        cezaGun: g,
        sucTarihi,
        dogumTarihi,
        girisTarihi,
        mahsupGun: Math.max(0, Number(mahsup) || 0),
        mukerrir,
        ikinciTekerrur,
        kadinCocuklu,
        agirHasta,
      }),
    );
  };

  return (
    <>
      <Uyari tur="dikkat">
        İnfaz hesabı; suç türü, suç tarihi, tekerrür durumu ve kanun değişikliklerine bağlı olarak kişiye özgü sonuçlar doğurur. Bu araç
        genel kuralları sadeleştirerek uygular ve yalnızca ön bilgi amaçlıdır.
      </Uyari>
      <div className="h-8" />
      <FormIzgara onSubmit={hesapla}>
        <Secim etiket="Suç türü" deger={sucTuru} onChange={setSucTuru} secenekler={SUC_TURLERI} />
        {!muebbet && (
          <div className="grid grid-cols-3 gap-3">
            <SayiInput etiket="Yıl" deger={yil} onChange={setYil} min={0} hata={hatalar.ceza} />
            <SayiInput etiket="Ay" deger={ay} onChange={setAy} min={0} max={11} />
            <SayiInput etiket="Gün" deger={gun} onChange={setGun} min={0} max={29} />
          </div>
        )}
        <TarihInput etiket="Suç tarihi" deger={sucTarihi} onChange={setSucTarihi} hata={hatalar.sucTarihi} />
        <TarihInput etiket="Doğum tarihi" deger={dogumTarihi} onChange={setDogumTarihi} hata={hatalar.dogumTarihi} />
        <TarihInput
          etiket="Cezaevine giriş tarihi"
          deger={girisTarihi}
          onChange={setGirisTarihi}
          hata={hatalar.girisTarihi}
          ipucu="Tutuklama ile başlayıp kesintisiz devam ediyorsa tutuklama tarihi."
        />
        <SayiInput
          etiket="Mahsup edilecek süre"
          birim="gün"
          deger={mahsup}
          onChange={setMahsup}
          min={0}
          ipucu="Giriş tarihinden önce gözaltı veya tutuklulukta geçen, kesintili süreler."
        />
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Onay etiket="Tekerrür hükümleri uygulandı (TCK 58)" deger={mukerrir} onChange={setMukerrir} />
          <Onay etiket="İkinci kez tekerrür" deger={ikinciTekerrur} onChange={setIkinciTekerrur} />
          <Onay etiket="0-6 yaş arası çocuğu olan kadın hükümlü" deger={kadinCocuklu} onChange={setKadinCocuklu} />
          <Onay etiket="Ağır hastalık veya engellilik" deger={agirHasta} onChange={setAgirHasta} />
        </div>
        <div className="md:col-span-2">
          <HesaplaButonu />
        </div>
      </FormIzgara>

      {sonuc && (
        <SonucPaneli
          tahmini
          anaEtiket="Tahmini tahliye (denetimli serbestliğe ayrılma) tarihi"
          anaDeger={formatTarihKisa(sonuc.tarihler.dsBaslangic)}
          satirlar={[
            { etiket: "Suç türü", deger: sonuc.tur.label },
            { etiket: "Koşullu salıverme oranı", deger: sonuc.oranMetni },
            ...(Number.isFinite(sonuc.cezaGunu) && !muebbet ? [{ etiket: "Toplam ceza", deger: formatSure(gunuSureyeCevir(sonuc.cezaGunu)) }] : []),
            { etiket: "Koşullu salıvermeye kadar", deger: formatSure(gunuSureyeCevir(sonuc.ksGunu)) },
            { etiket: "Denetimli serbestlik süresi", deger: formatSure(gunuSureyeCevir(sonuc.ds.gun)), aciklama: sonuc.ds.aciklama },
            ...(sonuc.mahsup > 0 ? [{ etiket: "Mahsup", deger: `${sonuc.mahsup} gün` }] : []),
            { etiket: "Cezaevinde kalınacak süre", deger: formatSure(gunuSureyeCevir(sonuc.cezaevindeGun)), vurgu: true },
            { etiket: "Tarihler", deger: "", ayrac: true },
            { etiket: "Cezaevine giriş", deger: formatTarihKisa(sonuc.tarihler.giris) },
            { etiket: "Açık cezaevine ayrılma (en erken, tahmini)", deger: formatTarihKisa(sonuc.tarihler.acikGecis) },
            { etiket: "Denetimli serbestlik başlangıcı", deger: formatTarihKisa(sonuc.tarihler.dsBaslangic), vurgu: true },
            { etiket: "Koşullu salıverme tarihi", deger: formatTarihKisa(sonuc.tarihler.ksTarihi) },
            ...(sonuc.tarihler.bihakkinTarihi ? [{ etiket: "Hak ederek tahliye (bihakkın)", deger: formatTarihKisa(sonuc.tarihler.bihakkinTarihi) }] : []),
          ]}
          notlar={[
            ...sonuc.uyarilar,
            "Denetimli serbestlik ve açık cezaevine ayrılma, iyi hâl ve diğer yasal koşulların varlığına bağlıdır; infaz savcılığının hesaplaması esastır.",
          ]}
        />
      )}
    </>
  );
}
