import { gunEkle, parseTarih, yasHesapla } from "./core/dates";

// 5275 s. Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun m.105/A, 107, 108 ve geçici maddeleri esas alınmıştır.
// ÖNEMLİ: Kurallar sadeleştirilmiştir; sonuç tahminidir ve avukat tarafından kontrol edilmelidir.
// Süre hesabında yıl 365, ay 30 gün kabul edilmiştir.

export type SucGrubu = "yarim" | "ucteIki" | "dorteUc" | "muebbet" | "agirMuebbet";

export const SUC_TURLERI: { value: string; label: string; grup: SucGrubu; dsIstisna: boolean }[] = [
  { value: "genel", label: "Diğer suçlar (genel hüküm)", grup: "yarim", dsIstisna: false },
  { value: "hirsizlik", label: "Hırsızlık (TCK 141-142)", grup: "yarim", dsIstisna: false },
  { value: "dolandiricilik", label: "Dolandırıcılık (TCK 157-158)", grup: "yarim", dsIstisna: false },
  { value: "yaralama", label: "Kasten yaralama (TCK 86-87)", grup: "yarim", dsIstisna: false },
  { value: "tehdit", label: "Tehdit, hakaret, mala zarar verme", grup: "yarim", dsIstisna: false },
  { value: "uyusturucu-kullanma", label: "Uyuşturucu kullanma (TCK 191)", grup: "yarim", dsIstisna: false },
  { value: "kasten-oldurme", label: "Kasten öldürme (TCK 81-83)", grup: "ucteIki", dsIstisna: true },
  { value: "ese-yaralama", label: "Eşe karşı kasten yaralama (TCK 86/3-a)", grup: "ucteIki", dsIstisna: true },
  { value: "iskence", label: "İşkence ve eziyet (TCK 94-96)", grup: "ucteIki", dsIstisna: true },
  { value: "cinsel-saldiri", label: "Cinsel saldırı – temel hâl (TCK 102/1)", grup: "ucteIki", dsIstisna: true },
  { value: "ozel-hayat", label: "Özel hayata ve hayatın gizli alanına karşı suçlar (TCK 132-138)", grup: "ucteIki", dsIstisna: true },
  { value: "orgut", label: "Suç işlemek amacıyla örgüt kurma (TCK 220)", grup: "ucteIki", dsIstisna: true },
  { value: "devlet", label: "Devletin güvenliğine karşı suçlar (TCK 302-339)", grup: "ucteIki", dsIstisna: true },
  { value: "teror", label: "Terör suçları (3713 s. Kanun)", grup: "dorteUc", dsIstisna: true },
  { value: "uyusturucu-ticaret", label: "Uyuşturucu imal ve ticareti (TCK 188)", grup: "dorteUc", dsIstisna: true },
  { value: "nitelikli-cinsel", label: "Nitelikli cinsel saldırı (TCK 102/2)", grup: "dorteUc", dsIstisna: true },
  { value: "cocuk-istismar", label: "Çocuğun cinsel istismarı (TCK 103)", grup: "dorteUc", dsIstisna: true },
  { value: "muebbet", label: "Müebbet hapis cezası", grup: "muebbet", dsIstisna: true },
  { value: "agir-muebbet", label: "Ağırlaştırılmış müebbet hapis cezası", grup: "agirMuebbet", dsIstisna: true },
];

const ORAN: Record<"yarim" | "ucteIki" | "dorteUc", number> = { yarim: 1 / 2, ucteIki: 2 / 3, dorteUc: 3 / 4 };
const ORAN_METNI: Record<string, string> = { yarim: "1/2", ucteIki: "2/3", dorteUc: "3/4" };

export type InfazGirdi = {
  sucTuru: string;
  cezaYil: number;
  cezaAy: number;
  cezaGun: number;
  sucTarihi: string;
  dogumTarihi: string;
  girisTarihi: string;
  mahsupGun: number;
  mukerrir: boolean;
  ikinciTekerrur: boolean;
  kadinCocuklu: boolean;
  agirHasta: boolean;
};

const YIL = 365;

/** Denetimli serbestlik süresi (gün). */
function dsSuresi(g: InfazGirdi, dsIstisna: boolean, yas: number) {
  if (dsIstisna) return { gun: 1 * YIL, aciklama: "İstisna suçlarda denetimli serbestlik süresi 1 yıldır." };
  if (g.agirHasta) return { gun: 3 * YIL, aciklama: "Ağır hastalık veya engellilik durumunda 3 yıl (m.105/A)." };
  if (g.kadinCocuklu || yas >= 70) {
    return { gun: 4 * YIL, aciklama: "0-6 yaş çocuğu olan kadın ve 70 yaş üzeri hükümlüler için artırılmış süre uygulanmıştır." };
  }
  if (g.sucTarihi < "2020-03-30") {
    return { gun: 6 * YIL, aciklama: "30.03.2020 öncesi suçlarda geçici madde hükümleriyle 3+3 yıl uygulanmıştır." };
  }
  if (g.sucTarihi <= "2023-07-31") {
    return { gun: 4 * YIL, aciklama: "30.03.2020 – 31.07.2023 arası suçlarda 1+3 yıl uygulanmıştır." };
  }
  return { gun: 1 * YIL, aciklama: "31.07.2023 sonrası suçlarda denetimli serbestlik süresi 1 yıldır (m.105/A)." };
}

export function infazHesapla(g: InfazGirdi) {
  const giris = parseTarih(g.girisTarihi);
  const suc = parseTarih(g.sucTarihi);
  const dogum = parseTarih(g.dogumTarihi);
  if (!giris || !suc || !dogum) return null;

  const tur = SUC_TURLERI.find((s) => s.value === g.sucTuru) ?? SUC_TURLERI[0];
  const sucYasi = yasHesapla(dogum, suc);
  const bugunYasi = yasHesapla(dogum, giris);
  const cocuk = sucYasi < 18;
  const uyarilar: string[] = [];

  const cezaGunu = g.cezaYil * YIL + g.cezaAy * 30 + g.cezaGun;
  let ksGunu: number;
  let oranMetni: string;
  let bihakkinGunu = cezaGunu;

  if (tur.grup === "muebbet" || tur.grup === "agirMuebbet") {
    const agir = tur.grup === "agirMuebbet";
    const yil = g.mukerrir ? (agir ? 39 : 33) : agir ? 30 : 24;
    ksGunu = yil * YIL;
    bihakkinGunu = Infinity;
    oranMetni = `${yil} yıl`;
  } else {
    let oran = ORAN[tur.grup];
    oranMetni = ORAN_METNI[tur.grup];
    if (g.mukerrir && oran < 3 / 4) {
      oran = 3 / 4;
      oranMetni = "3/4 (tekerrür, m.108)";
    }
    ksGunu = Math.round(cezaGunu * oran);
  }

  if (g.ikinciTekerrur) {
    ksGunu = bihakkinGunu;
    oranMetni = "Koşullu salıverme uygulanmaz (ikinci kez tekerrür)";
    uyarilar.push("İkinci kez tekerrür hükümleri uygulanan hükümlü koşullu salıverilmez; mükerrirlere özgü infaz rejimi ayrıca değerlendirilmelidir.");
  }

  if (cocuk) {
    uyarilar.push(
      "Suç tarihinde 18 yaşından küçük olanlar için Kanun'da özel koşullu salıverme ve gün hesabı hükümleri bulunmaktadır. Bu hesaplama yetişkin kurallarıyla yapılmıştır; sonucu mutlaka bir avukata kontrol ettiriniz.",
    );
  }

  const ds = g.ikinciTekerrur ? { gun: 0, aciklama: "Denetimli serbestlik uygulanmamıştır." } : dsSuresi(g, tur.dsIstisna, bugunYasi);
  const mahsup = Math.max(0, g.mahsupGun);

  // Denetimli serbestlik, koşullu salıverme tarihinden geriye doğru sayılır.
  const cezaevindeGun = Math.max(0, ksGunu - ds.gun - mahsup);
  const dsBaslangic = gunEkle(giris, cezaevindeGun);
  const ksTarihi = gunEkle(giris, Math.max(0, ksGunu - mahsup));
  const bihakkinTarihi = Number.isFinite(bihakkinGunu) ? gunEkle(giris, Math.max(0, bihakkinGunu - mahsup)) : null;

  // Açık cezaevine ayrılma (tahmini): koşullu salıverilmeye genel suçlarda 7 yıl, istisna suçlarda 3 yıl kala.
  const acikaKalanGun = (tur.dsIstisna ? 3 : 7) * YIL;
  const acikGecis = gunEkle(giris, Math.max(0, ksGunu - mahsup - acikaKalanGun));

  if (ksGunu - ds.gun - mahsup < 0) {
    uyarilar.push("Mahsup ve denetimli serbestlik süresi, koşullu salıverme süresini aşmaktadır; hükümlü doğrudan denetimli serbestlikten yararlanabilir.");
  }

  return {
    tur,
    sucYasi,
    cocuk,
    cezaGunu,
    ksGunu,
    oranMetni,
    ds,
    mahsup,
    cezaevindeGun,
    tarihler: { giris, acikGecis, dsBaslangic, ksTarihi, bihakkinTarihi },
    uyarilar,
  };
}
