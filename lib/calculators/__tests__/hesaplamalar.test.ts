import { describe, expect, it } from "vitest";
import { VARSAYILAN_PARAMETRELER as P } from "../params";
import { dilimliHesap, parseTutar, yuvarla } from "../core/money";
import { parseTarih, takvimFarki } from "../core/dates";
import { bruttenNete, nettenBrute } from "../core/payroll";
import { ihbarSuresiHafta, kidemIhbarHesapla, yillikIzinGunu, fazlaMesaiHesapla, ubgtHesapla } from "../is-hukuku";
import { arabuluculukUcretiHesapla, harcVeGiderHesapla, islahHarciHesapla, vekaletUcretiHesapla } from "../yargilama";
import { kiraArtisHesapla } from "../kira";
import { infazHesapla } from "../infaz";
import { bakiyeOmur, tazminatHesapla } from "../tazminat";

const t = (iso: string) => parseTarih(iso)!;

describe("yardımcılar", () => {
  it("Türkçe tutar biçimlerini çözer", () => {
    expect(parseTutar("33.030,50")).toBe(33030.5);
    expect(parseTutar("33.030")).toBe(33030);
    expect(parseTutar("33030.5")).toBe(33030.5);
    expect(parseTutar("1.250.000")).toBe(1250000);
    expect(parseTutar("₺ 2.500,75")).toBe(2500.75);
    expect(parseTutar("abc")).toBeNull();
  });

  it("takvim farkını yıl/ay/gün olarak hesaplar", () => {
    expect(takvimFarki(t("2020-01-15"), t("2025-04-10"))).toMatchObject({ yil: 5, ay: 2, gun: 26 });
    expect(takvimFarki(t("2024-02-29"), t("2025-02-28"))).toMatchObject({ yil: 0, ay: 11, gun: 30 });
  });

  it("dilimli hesap her dilime kendi oranını uygular", () => {
    const { toplam } = dilimliHesap(1_000_000, [
      { genislik: 600_000, oran: 16 },
      { genislik: 600_000, oran: 15 },
      { genislik: null, oran: 14 },
    ]);
    expect(toplam).toBe(96_000 + 60_000);
  });
});

describe("bordro", () => {
  it("2026 asgari ücretinde net 28.075,50 TL çıkar (istisnalar tam)", () => {
    const b = bruttenNete(P.asgariUcret.brut, 1, P);
    expect(yuvarla(b.net)).toBe(28075.5);
    expect(b.gelirVergisi).toBeCloseTo(0, 6);
    expect(b.damga).toBeCloseTo(0, 6);
  });

  it("netten brüte, brütten nete ile tutarlıdır", () => {
    for (const ay of [1, 6, 12]) {
      const b = nettenBrute(75_000, ay, P);
      expect(yuvarla(bruttenNete(b.brut, ay, P).net)).toBeCloseTo(75_000, 1);
    }
  });

  it("yüksek ücrette ilerleyen aylarda vergi dilimi nedeniyle net azalır", () => {
    expect(bruttenNete(150_000, 12, P).net).toBeLessThan(bruttenNete(150_000, 1, P).net);
  });
});

describe("kıdem ve ihbar", () => {
  it("Kadim örneği: 33.030 TL × 5 yıl 3 ay 26 gün", () => {
    // 01.01.2020 – 27.04.2025 arası 5 yıl 3 ay 26 gün
    const s = kidemIhbarHesapla({ giris: t("2020-01-01"), cikis: t("2025-04-27"), brutUcret: 33030, gvOraniYuzde: 15 }, P);
    expect(s.sure).toMatchObject({ yil: 5, ay: 3, gun: 26 });
    expect(yuvarla(s.kidem.brut)).toBe(175760.32);
    expect(yuvarla(s.kidem.damga)).toBe(1334.02);
    expect(yuvarla(s.kidem.net)).toBe(174426.3);
  });

  it("çıkış tarihindeki tavanı uygular", () => {
    const s = kidemIhbarHesapla({ giris: t("2016-01-01"), cikis: t("2026-08-01"), brutUcret: 150_000, gvOraniYuzde: 15 }, P);
    expect(s.tavanUygulandi).toBe(true);
    expect(s.esasUcret).toBe(73729.87);
  });

  it("bir yılı doldurmayan işçiye kıdem ödenmez", () => {
    const s = kidemIhbarHesapla({ giris: t("2026-01-01"), cikis: t("2026-10-01"), brutUcret: 50_000, gvOraniYuzde: 15 }, P);
    expect(s.kidem.brut).toBe(0);
    expect(s.ihbar.hafta).toBe(4);
  });

  it("ihbar süreleri kanundaki eşiklere uyar", () => {
    expect(ihbarSuresiHafta(5)).toBe(2);
    expect(ihbarSuresiHafta(6)).toBe(4);
    expect(ihbarSuresiHafta(18)).toBe(6);
    expect(ihbarSuresiHafta(36)).toBe(8);
  });
});

describe("yıllık izin, fazla mesai, UBGT", () => {
  it("izin günleri İş Kanunu m.53'e uyar", () => {
    expect(yillikIzinGunu("isci", 0, 30)).toBe(0);
    expect(yillikIzinGunu("isci", 1, 30)).toBe(14);
    expect(yillikIzinGunu("isci", 5, 30)).toBe(14);
    expect(yillikIzinGunu("isci", 6, 30)).toBe(20);
    expect(yillikIzinGunu("isci", 15, 30)).toBe(26);
    expect(yillikIzinGunu("isci", 2, 17)).toBe(20);
    expect(yillikIzinGunu("isci", 2, 52)).toBe(20);
    expect(yillikIzinGunu("memur", 10, 40)).toBe(20);
    expect(yillikIzinGunu("memur", 11, 40)).toBe(30);
  });

  it("fazla mesai saat ücretinin %50 fazlasıdır", () => {
    const s = fazlaMesaiHesapla({ brutUcret: 45_000, saat: 10, zamYuzde: 50, gvOraniYuzde: 15 }, P);
    expect(s.brut).toBeCloseTo((45_000 / 225) * 1.5 * 10, 6);
  });

  it("UBGT tam gün çalışmada günlük brüt kadardır", () => {
    const s = ubgtHesapla({ brutUcret: 30_000, gun: 2, gunlukSaat: 7.5, normalSaat: 7.5, gvOraniYuzde: 15 }, P);
    expect(s.brut).toBeCloseTo(2000, 6);
  });
});

describe("yargılama giderleri", () => {
  it("peşin nispi harç dörtte birdir ve maktu harçtan az olamaz", () => {
    const buyuk = harcVeGiderHesapla({ mahkeme: "asliye", tur: "nispi", davaDegeri: 1_000_000, tarafSayisi: 2, tanikSayisi: 0, bilirkisiSayisi: 0, kesif: false, vekil: false }, P);
    expect(buyuk.kalemler.find((k) => k.ad.startsWith("Peşin"))?.tutar).toBeCloseTo(17077.5, 2);
    const kucuk = harcVeGiderHesapla({ mahkeme: "asliye", tur: "nispi", davaDegeri: 10_000, tarafSayisi: 2, tanikSayisi: 0, bilirkisiSayisi: 0, kesif: false, vekil: false }, P);
    expect(kucuk.kalemler.find((k) => k.ad.startsWith("Peşin"))?.tutar).toBe(732);
  });

  it("gider avansı: 530 TL + taraf sayısı × 5 tebligat", () => {
    const s = harcVeGiderHesapla({ mahkeme: "asliye", tur: "maktu", davaDegeri: 0, tarafSayisi: 2, tanikSayisi: 0, bilirkisiSayisi: 0, kesif: false, vekil: false }, P);
    expect(s.avansToplam).toBe(530 + 2 * 5 * 265);
  });

  it("ıslah harcı artırılan miktarın binde 68,31'inin dörtte biridir", () => {
    expect(islahHarciHesapla(100_000, P).pesinHarc).toBeCloseTo(1707.75, 2);
  });

  it("AAÜT dilimleri ve maktu alt sınır", () => {
    const n = vekaletUcretiHesapla({ tur: "nispi", yargiYeri: "asliye", tutar: 1_200_000 }, P);
    expect(n.ucret).toBe(96_000 + 90_000);
    const alt = vekaletUcretiHesapla({ tur: "nispi", yargiYeri: "asliye", tutar: 100_000 }, P);
    expect(alt.ucret).toBe(45_000);
    expect(alt.kural).toBe("maktu-alt-sinir");
    const ust = vekaletUcretiHesapla({ tur: "nispi", yargiYeri: "asliye", tutar: 20_000 }, P);
    expect(ust.ucret).toBe(20_000);
  });

  it("arabuluculuk: anlaşmada nispi ve asgari ücret, anlaşamamada saatlik", () => {
    const nispi = arabuluculukUcretiHesapla({ sonuc: "anlasma", parasal: true, tur: "diger", tarafSayisi: 2, arabulucuSayisi: 1, saat: 2, tutar: 1_000_000 }, P);
    expect(nispi.ucret).toBe(36_000 + 20_000);
    const asgari = arabuluculukUcretiHesapla({ sonuc: "anlasma", parasal: true, tur: "ticari", tarafSayisi: 2, arabulucuSayisi: 1, saat: 2, tutar: 50_000 }, P);
    expect(asgari.ucret).toBe(13_000);
    const saatlik = arabuluculukUcretiHesapla({ sonuc: "anlasamama", parasal: true, tur: "is", tarafSayisi: 2, arabulucuSayisi: 1, saat: 1, tutar: 0 }, P);
    expect(saatlik.ucret).toBe(1130 * 2 * 2);
  });
});

describe("kira artışı", () => {
  it("Eylül 2026 için %31,79 uygulanır", () => {
    const s = kiraArtisHesapla(20_000, "2026-09", P)!;
    expect(s.oran).toBe(31.79);
    expect(s.yeniKira).toBeCloseTo(26_358, 2);
  });
});

describe("infaz", () => {
  it("genel suçta 1/2 oranı ve 1 yıl denetimli serbestlik", () => {
    const s = infazHesapla({
      sucTuru: "hirsizlik", cezaYil: 4, cezaAy: 0, cezaGun: 0, sucTarihi: "2024-05-01", dogumTarihi: "1990-01-01",
      girisTarihi: "2025-01-01", mahsupGun: 0, mukerrir: false, ikinciTekerrur: false, kadinCocuklu: false, agirHasta: false,
    })!;
    expect(s.ksGunu).toBe(730);
    expect(s.ds.gun).toBe(365);
    expect(s.cezaevindeGun).toBe(365);
  });

  it("müebbette 24 yıl, tekerrürde 33 yıl", () => {
    const temel = { cezaYil: 0, cezaAy: 0, cezaGun: 0, sucTarihi: "2024-05-01", dogumTarihi: "1990-01-01", girisTarihi: "2025-01-01", mahsupGun: 0, ikinciTekerrur: false, kadinCocuklu: false, agirHasta: false };
    expect(infazHesapla({ ...temel, sucTuru: "muebbet", mukerrir: false })!.ksGunu).toBe(24 * 365);
    expect(infazHesapla({ ...temel, sucTuru: "muebbet", mukerrir: true })!.ksGunu).toBe(33 * 365);
  });

  it("18 yaş altı için uyarı üretir", () => {
    const s = infazHesapla({
      sucTuru: "genel", cezaYil: 2, cezaAy: 0, cezaGun: 0, sucTarihi: "2024-05-01", dogumTarihi: "2008-01-01",
      girisTarihi: "2025-01-01", mahsupGun: 0, mukerrir: false, ikinciTekerrur: false, kadinCocuklu: false, agirHasta: false,
    })!;
    expect(s.cocuk).toBe(true);
    expect(s.uyarilar.length).toBeGreaterThan(0);
  });
});

describe("tazminat", () => {
  it("TRH-2010 bakiye ömrü okunur", () => {
    expect(bakiyeOmur(23, "erkek")).toBe(51.14);
    expect(bakiyeOmur(30, "kadin")).toBe(49);
  });

  it("kusur ve maluliyet oranı tazminatı orantılı düşürür", () => {
    const temel = { kazaTarihi: "2025-01-01", hesapTarihi: "2026-01-01", dogumTarihi: "1990-01-01", cinsiyet: "erkek" as const, netGelir: 40_000, aktifYasSiniri: 65 };
    const tam = tazminatHesapla({ ...temel, maluliyetYuzde: 20, kusurYuzde: 0 }, P)!;
    const yarim = tazminatHesapla({ ...temel, maluliyetYuzde: 20, kusurYuzde: 50 }, P)!;
    expect(yarim.toplam).toBeCloseTo(tam.toplam / 2, 2);
    expect(tam.donemler[0].gun).toBe(365);
  });
});
