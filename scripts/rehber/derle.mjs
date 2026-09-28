// Adliye ve cezaevi telefon rehberini resmî Adalet Bakanlığı sitelerinden derler.
//  - Cezaevleri: Ceza ve Tevkifevleri Genel Müdürlüğü kurum listesi (cte.adalet.gov.tr/Home/haritaliste)
//    ve her kurumun kendi *.adalet.gov.tr sitesinin alt bilgisindeki adres/telefon.
//  - Adliyeler: il ve ilçe adliyelerinin *.adalet.gov.tr sitelerinin başlık ve alt bilgileri.
// Çıktı: content/rehber/adliyeler.json, content/rehber/cezaevleri.json
// Çalıştırma: node scripts/rehber/derle.mjs   (birkaç dakika sürer)

import fs from "node:fs";
import path from "node:path";

// Bazı kamu sitelerinin sertifika zinciri eksik olduğundan yalnızca bu betik için doğrulama kapatılır.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const IL_ADLARI = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir",
  "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay",
  "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kırıkkale",
  "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde",
  "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon",
  "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
];

// Büyükşehirlerdeki ek adliyeler ve Ankara çevresi ilçe adliyeleri (alt alan adı tahmini; bulunamayanlar atlanır).
const EK_ADLIYE_ADAYLARI = [
  "ankarabati", "polatli", "beypazari", "cubuk", "elmadag", "golbasi", "haymana", "kahramankazan", "kalecik", "kizilcahamam",
  "nallihan", "sereflikochisar", "bala", "ayas", "gudul", "camlidere", "evren",
  "bakirkoy", "anadolu", "istanbulanadolu", "kucukcekmece", "buyukcekmece", "gaziosmanpasa", "kartal", "silivri", "catalca", "sile",
  "karsiyaka", "bergama", "odemis", "torbali", "menemen", "bornova", "tire", "cesme", "aliaga",
  "nilufer", "inegol", "gemlik", "mustafakemalpasa", "gebze", "izmit", "alanya", "manavgat", "kemer", "serik",
  "tarsus", "erdemli", "silifke", "iskenderun", "antakya", "dortyol", "kozan", "ceyhan", "eregli", "aksehir", "beysehir",
  "bafra", "carsamba", "corlu", "cerkezkoy", "fethiye", "bodrum", "marmaris", "milas", "nazilli", "soke", "kusadasi",
  "edremit", "bandirma", "ayvalik", "turgutlu", "akhisar", "salihli", "sandikli", "siverek", "viransehir", "nizip", "islahiye",
  "elbistan", "kiziltepe", "midyat", "patnos", "dogubayazit", "ercis", "cizre", "silopi",
];

const tr = (s) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]/g, "");

function entityCoz(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&raquo;/g, "»").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function baslikDuzelt(s) {
  return s
    .toLocaleLowerCase("tr")
    .split(/(\s+|\/|-)/)
    .map((p) => (p.length > 1 ? p[0].toLocaleUpperCase("tr") + p.slice(1) : p))
    .join("")
    .replace(/\bVe\b/g, "ve")
    .replace(/\bNolu\b/g, "Nolu")
    .replace(/\b(T\.c\.)/gi, "T.C.");
}

async function getir(url, deneme = 2) {
  for (let i = 0; i < deneme; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "Mozilla/5.0 (rehber derleme)" } });
      if (!r.ok) return null;
      return await r.text();
    } catch {
      /* tekrar dene */
    }
  }
  return null;
}

function metneCevir(html) {
  return entityCoz(
    html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, "\n"),
  )
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

const TEL = /(?:\+?90[\s-]*)?\(?0?\s*[2-5]\d{2}\)?[\s-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/g;

function telefonNormalize(t) {
  const rakam = t.replace(/\D/g, "").replace(/^90/, "").replace(/^0/, "");
  if (rakam.length !== 10) return null;
  return `0 (${rakam.slice(0, 3)}) ${rakam.slice(3, 6)} ${rakam.slice(6, 8)} ${rakam.slice(8, 10)}`;
}

/** Adalet Bakanlığı site şablonundaki alt bilgiden adres, telefon ve faksı çıkarır. */
function altBilgiCoz(html) {
  const satirlar = metneCevir(html);
  const a = satirlar.lastIndexOf("Adres");
  if (a < 0) return null;
  const adres = satirlar[a + 1] ?? "";
  const t = satirlar.indexOf("Telefon", a);
  const bitis = satirlar.findIndex((l, i) => i > a && /^E-?Posta$/i.test(l));
  const blok = satirlar.slice(t >= 0 ? t + 1 : a + 2, bitis > 0 ? bitis : a + 6);
  const telefonlar = [];
  const fakslar = [];
  for (const satir of blok) {
    const faksMi = /faks|fax/i.test(satir);
    const [telKismi, faksKismi] = faksMi && !/^faks|^fax/i.test(satir) ? satir.split(/faks|fax/i) : faksMi ? ["", satir] : [satir, ""];
    for (const m of telKismi.match(TEL) ?? []) {
      const n = telefonNormalize(m);
      if (n && !telefonlar.includes(n)) telefonlar.push(n);
    }
    for (const m of faksKismi.match(TEL) ?? []) {
      const n = telefonNormalize(m);
      if (n && !fakslar.includes(n)) fakslar.push(n);
    }
  }
  return { adres: adres.replace(/\s+/g, " "), telefonlar, faks: fakslar[0] ?? null };
}

function ilBul(adres, varsayilan) {
  const son = adres.split(/[/,-]/).map((p) => p.trim()).filter(Boolean).pop() ?? "";
  const eslesen = IL_ADLARI.find((il) => tr(il) === tr(son) || tr(son).endsWith(tr(il)));
  return eslesen ?? varsayilan ?? null;
}

async function havuz(isler, esZamanli, fn) {
  const sonuc = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: esZamanli }, async () => {
      while (i < isler.length) {
        const is = isler[i++];
        sonuc.push(await fn(is));
      }
    }),
  );
  return sonuc;
}

async function cezaevleri() {
  const html = await getir("https://cte.adalet.gov.tr/Home/haritaliste");
  if (!html) throw new Error("CTE kurum listesi alınamadı");
  const kurumlar = [];
  const re = /data-href='([^']+)'>\s*<td>\s*([^<]+?)\s*<\/td>\s*<td>\s*([^<]+?)\s*<\/td>/g;
  let m;
  while ((m = re.exec(html))) {
    const ad = entityCoz(m[3]).replace(/\s+/g, " ").trim();
    if (!kurumlar.some((k) => k.ad === ad)) kurumlar.push({ web: m[1].replace(/\/$/, ""), il: baslikDuzelt(entityCoz(m[2]).trim()), ad });
  }
  console.log(`CTE listesinde ${kurumlar.length} kurum bulundu, siteler taranıyor...`);
  const liste = await havuz(kurumlar, 8, async (k) => {
    const sayfa = await getir(k.web + "/");
    const bilgi = sayfa ? altBilgiCoz(sayfa) : null;
    return { ...k, adres: bilgi?.adres ?? "", telefonlar: bilgi?.telefonlar ?? [], faks: bilgi?.faks ?? null };
  });
  return liste
    .filter((k) => k.telefonlar.length > 0)
    .map((k) => ({ id: tr(k.ad).slice(0, 60), tur: "cezaevi", il: IL_ADLARI.find((il) => tr(il) === tr(k.il)) ?? k.il, ad: k.ad, adres: k.adres, telefonlar: k.telefonlar, faks: k.faks, web: k.web }))
    .sort((a, b) => a.il.localeCompare(b.il, "tr") || a.ad.localeCompare(b.ad, "tr"));
}

async function adliyeler(cezaeviIlceleri) {
  const adaylar = new Map();
  for (const il of IL_ADLARI) adaylar.set(tr(il), il);
  for (const s of [...EK_ADLIYE_ADAYLARI, ...cezaeviIlceleri]) if (!adaylar.has(s)) adaylar.set(s, null);
  console.log(`${adaylar.size} adliye adresi deneniyor...`);

  const liste = await havuz([...adaylar.entries()], 8, async ([slug, il]) => {
    const web = `https://${slug}.adalet.gov.tr`;
    const sayfa = await getir(web + "/");
    if (!sayfa) return null;
    const baslik = entityCoz((sayfa.match(/<title>([^<]*)/) ?? [])[1] ?? "").trim();
    if (!/ADLİYE|ADLIYE/i.test(baslik)) return null;
    const bilgi = altBilgiCoz(sayfa);
    if (!bilgi || !bilgi.telefonlar.length) return null;
    return {
      id: slug,
      tur: "adliye",
      il: ilBul(bilgi.adres, il),
      ad: baslikDuzelt(baslik),
      adres: bilgi.adres,
      telefonlar: bilgi.telefonlar,
      faks: bilgi.faks,
      web,
    };
  });
  const tekil = new Map();
  for (const a of liste.filter(Boolean)) if (a.il && !tekil.has(a.ad)) tekil.set(a.ad, a);
  return [...tekil.values()].sort((a, b) => a.il.localeCompare(b.il, "tr") || a.ad.localeCompare(b.ad, "tr"));
}

const hedef = path.join(process.cwd(), "content", "rehber");
fs.mkdirSync(hedef, { recursive: true });

const c = await cezaevleri();
const ilceler = [...new Set(c.map((k) => tr(k.ad.split(/\s/)[0])))];
const a = await adliyeler(ilceler);

const bugun = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(hedef, "cezaevleri.json"), JSON.stringify({ guncelleme: bugun, kaynak: "cte.adalet.gov.tr ve kurumların resmî siteleri", kayitlar: c }, null, 2) + "\n");
fs.writeFileSync(path.join(hedef, "adliyeler.json"), JSON.stringify({ guncelleme: bugun, kaynak: "Adliyelerin resmî *.adalet.gov.tr siteleri", kayitlar: a }, null, 2) + "\n");
console.log(`Tamamlandı: ${a.length} adliye, ${c.length} cezaevi.`);
