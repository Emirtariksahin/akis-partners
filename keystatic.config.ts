import { config, collection, fields, singleton } from "@keystatic/core";
import { FAALIYET_KATEGORILERI, KTK_GRUPLARI, TUM_ARACLAR_SECENEKLERI } from "./lib/taxonomy";
import { hesaplamaParametreleriSchema } from "./lib/calculators/params-schema";

// Üretimde içerik GitHub reposuna commit edilir; repo tanımlı değilse yerel dosya sistemi kullanılır.
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

// Sayfa adresleri (slug) Türkçe karakter ve boşluk içermemeli; aksi hâlde sayfa ve görsel yolları bozulur.
export function turkceSlug(metin: string) {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ADRES_KALIBI = {
  regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  message: "Adres yalnızca küçük harf (Türkçe karakter olmadan), rakam ve tire içerebilir. Örn: yagiz-mete",
};

const adres = (generate: (ad: string) => string = turkceSlug) => ({
  label: "Adres (sayfa bağlantısı)",
  description: "Addan otomatik üretilir; elle değiştirmeniz gerekmez.",
  generate,
  validation: { pattern: ADRES_KALIBI },
});

const kaynakListesi = fields.array(
  fields.object({
    ad: fields.text({ label: "Kaynak adı" }),
    url: fields.url({ label: "Bağlantı" }),
  }),
  { label: "Kaynaklar", itemLabel: (p) => p.fields.ad.value || "Kaynak" },
);

export default config({
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: {
    brand: { name: "Akış Partners" },
    navigation: {
      "İçerik": ["makaleler", "faaliyetAlanlari", "ekip"],
      "Hukuki Araçlar": ["ktkMaddeleri", "hesaplamaParametreleri"],
      "Site": ["siteAyarlari", "yasalSayfalar"],
    },
  },
  collections: {
    makaleler: collection({
      label: "Makaleler",
      path: "content/makaleler/*",
      slugField: "baslik",
      format: { contentField: "icerik" },
      entryLayout: "content",
      columns: ["baslik", "tarih"],
      schema: {
        baslik: fields.slug({ name: { label: "Başlık", validation: { isRequired: true } }, slug: adres() }),
        tarih: fields.date({ label: "Yayın tarihi", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        yayinda: fields.checkbox({ label: "Yayında", description: "İşaretli değilse makale sitede görünmez.", defaultValue: true }),
        ozet: fields.text({ label: "Özet", multiline: true, validation: { isRequired: true, length: { max: 320 } } }),
        kapak: fields.image({ label: "Kapak görseli", directory: "public/images/makaleler", publicPath: "/images/makaleler/" }),
        yazar: fields.relationship({ label: "Yazar", collection: "ekip" }),
        faaliyetAlani: fields.relationship({ label: "Faaliyet alanı", collection: "faaliyetAlanlari" }),
        icerik: fields.markdoc({
          label: "İçerik",
          options: { image: { directory: "public/images/makaleler", publicPath: "/images/makaleler/" } },
        }),
      },
    }),

    faaliyetAlanlari: collection({
      label: "Faaliyet Alanları",
      path: "content/faaliyet-alanlari/*",
      slugField: "baslik",
      format: { contentField: "icerik" },
      columns: ["baslik", "kategori"],
      schema: {
        baslik: fields.slug({ name: { label: "Başlık", validation: { isRequired: true } }, slug: adres() }),
        kategori: fields.select({
          label: "Kategori",
          options: FAALIYET_KATEGORILERI.map((k) => ({ label: k.label, value: k.value })),
          defaultValue: "kurumsal-ticari",
        }),
        sira: fields.integer({ label: "Kategori içindeki sıra", defaultValue: 0 }),
        ozet: fields.text({ label: "Kısa özet", multiline: true, validation: { isRequired: true, length: { max: 280 } } }),
        altBasliklar: fields.array(
          fields.object({
            baslik: fields.text({ label: "Alt başlık" }),
            metin: fields.text({ label: "Açıklama", multiline: true }),
          }),
          { label: "Alt başlıklar", itemLabel: (p) => p.fields.baslik.value || "Alt başlık" },
        ),
        ilgiliAraclar: fields.multiselect({ label: "İlgili hukuki araçlar", options: TUM_ARACLAR_SECENEKLERI }),
        icerik: fields.markdoc({ label: "Ayrıntılı içerik" }),
      },
    }),

    ekip: collection({
      label: "Ekibimiz",
      path: "content/ekip/*",
      slugField: "ad",
      format: { contentField: "ozgecmis" },
      columns: ["ad", "unvan"],
      schema: {
        ad: fields.slug({ name: { label: "Ad Soyad (\"Av.\" olmadan)", validation: { isRequired: true } }, slug: adres() }),
        unvan: fields.text({ label: "Unvan", defaultValue: "Avukat" }),
        sira: fields.integer({ label: "Sıra", defaultValue: 0 }),
        foto: fields.image({ label: "Fotoğraf", directory: "public/images/ekip", publicPath: "/images/ekip/" }),
        baro: fields.text({ label: "Kayıtlı olduğu baro", defaultValue: "Ankara Barosu" }),
        sicilNo: fields.text({ label: "Baro sicil no" }),
        eposta: fields.text({ label: "E-posta" }),
        linkedin: fields.url({ label: "LinkedIn" }),
        kisaTanitim: fields.text({ label: "Kısa tanıtım", multiline: true }),
        egitim: fields.array(fields.text({ label: "Eğitim" }), { label: "Eğitim", itemLabel: (p) => p.value }),
        diller: fields.array(fields.text({ label: "Dil" }), { label: "Yabancı diller", itemLabel: (p) => p.value }),
        faaliyetAlanlari: fields.multiRelationship({ label: "Çalıştığı faaliyet alanları", collection: "faaliyetAlanlari" }),
        ozgecmis: fields.markdoc({ label: "Özgeçmiş" }),
      },
    }),

    ktkMaddeleri: collection({
      label: "KTK Maddeleri",
      path: "content/ktk/*",
      slugField: "madde",
      format: { contentField: "aciklama" },
      columns: ["madde", "baslik"],
      schema: {
        madde: fields.slug({
          name: { label: "Madde (örn. 47/1-d)", validation: { isRequired: true } },
          slug: adres((name) => "ktk-" + turkceSlug(name)),
        }),
        baslik: fields.text({ label: "Kısa başlık", validation: { isRequired: true } }),
        grup: fields.select({
          label: "Konu grubu",
          options: KTK_GRUPLARI.map((g) => ({ label: g.label, value: g.value })),
          defaultValue: "diger",
        }),
        kanunMetni: fields.text({ label: "Kanun metni", multiline: true }),
        ozet: fields.text({ label: "Sade anlatım", multiline: true }),
        kusurTuru: fields.select({
          label: "Kusur niteliği",
          description: "KTK m.84'te sayılan hâller asli kusurdur.",
          options: [
            { label: "Asli kusur", value: "asli" },
            { label: "Tali kusur", value: "tali" },
          ],
          defaultValue: "tali",
        }),
        cezaTutari: fields.number({ label: "İdari para cezası (TL)", step: 0.01 }),
        cezaPuani: fields.integer({ label: "Ceza puanı" }),
        ehliyetElKoyma: fields.text({ label: "Sürücü belgesine el koyma" }),
        aracMen: fields.text({ label: "Aracın trafikten men edilmesi" }),
        ekYaptirim: fields.text({ label: "Diğer yaptırımlar", multiline: true }),
        kaynaklar: kaynakListesi,
        guncelleme: fields.date({ label: "Son kontrol tarihi" }),
        aciklama: fields.markdoc({ label: "Ayrıntılı açıklama" }),
      },
    }),

    yasalSayfalar: collection({
      label: "Yasal Metinler",
      path: "content/yasal/*",
      slugField: "baslik",
      format: { contentField: "icerik" },
      schema: {
        baslik: fields.slug({ name: { label: "Başlık", validation: { isRequired: true } }, slug: adres() }),
        sonGuncelleme: fields.date({ label: "Son güncelleme" }),
        icerik: fields.markdoc({ label: "Metin" }),
      },
    }),
  },

  singletons: {
    siteAyarlari: singleton({
      label: "Site Ayarları",
      path: "content/ayarlar/site",
      schema: {
        unvan: fields.text({ label: "Büro unvanı", defaultValue: "Akış Partners Hukuk & Danışmanlık" }),
        telefon: fields.text({ label: "Telefon (görünen)" }),
        telefonLink: fields.text({ label: "Telefon (arama linki, +90 ile)" }),
        whatsapp: fields.text({ label: "WhatsApp numarası (yalnızca rakam, 90 ile)" }),
        eposta: fields.text({ label: "Genel e-posta" }),
        adres: fields.text({ label: "Açık adres", multiline: true }),
        adresKisa: fields.text({ label: "Kısa adres (ilçe, il)" }),
        haritaSorgusu: fields.text({
          label: "Harita arama ifadesi",
          description: "Google Haritalar'da büroyu bulan ifade veya \"enlem,boylam\".",
        }),
        calismaSaatleri: fields.text({ label: "Çalışma saatleri", multiline: true }),
        sosyal: fields.object(
          {
            linkedin: fields.url({ label: "LinkedIn" }),
            instagram: fields.url({ label: "Instagram" }),
            x: fields.url({ label: "X (Twitter)" }),
          },
          { label: "Sosyal medya" },
        ),
        duyuru: fields.object(
          {
            aktif: fields.checkbox({ label: "Duyuru çubuğu gösterilsin", defaultValue: true }),
            metin: fields.text({ label: "Duyuru metni" }),
          },
          { label: "Duyuru çubuğu" },
        ),
      },
    }),
    hesaplamaParametreleri: singleton({
      label: "Hesaplama Parametreleri",
      path: "content/ayarlar/hesaplama-parametreleri",
      schema: hesaplamaParametreleriSchema,
    }),
  },
});
