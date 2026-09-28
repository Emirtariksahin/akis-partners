import { fields } from "@keystatic/core";

// lib/calculators/params.ts içindeki HesaplamaParametreleri tipinin Keystatic karşılığı.
// Alan adları iki dosyada birebir aynı tutulmalıdır.

const tutar = (label: string, description?: string) =>
  fields.number({ label, description, step: 0.01, validation: { isRequired: true } });

const dilimGenisligi = fields.number({
  label: "Dilim genişliği (TL)",
  description: "Son dilimde boş bırakın (sınırsız).",
  step: 0.01,
});

export const hesaplamaParametreleriSchema = {
  guncelleme: fields.date({ label: "Son güncelleme", validation: { isRequired: true } }),
  asgariUcret: fields.object(
    { brut: tutar("Brüt asgari ücret"), net: tutar("Net asgari ücret") },
    { label: "Asgari ücret" },
  ),
  kidemTavanlari: fields.array(
    fields.object({
      baslangic: fields.date({ label: "Başlangıç", validation: { isRequired: true } }),
      bitis: fields.date({ label: "Bitiş", validation: { isRequired: true } }),
      tutar: tutar("Tavan tutarı"),
    }),
    { label: "Kıdem tazminatı tavanları", itemLabel: (p) => `${p.fields.baslangic.value ?? ""} → ${p.fields.tutar.value ?? ""}` },
  ),
  kesintiler: fields.object(
    {
      sgkIsciYuzde: tutar("SGK işçi payı (%)"),
      issizlikIsciYuzde: tutar("İşsizlik sigortası işçi payı (%)"),
      damgaBinde: tutar("Damga vergisi (binde)"),
      sgkTavanKati: tutar("SGK prim tavanı (asgari ücretin katı)"),
    },
    { label: "Yasal kesintiler" },
  ),
  gelirVergisiDilimleri: fields.array(
    fields.object({ genislik: dilimGenisligi, oranYuzde: tutar("Oran (%)") }),
    { label: "Gelir vergisi dilimleri (ücret)", itemLabel: (p) => `%${p.fields.oranYuzde.value ?? ""}` },
  ),
  harc: fields.object(
    {
      basvurmaAsliye: tutar("Başvurma harcı – asliye/idare"),
      basvurmaSulh: tutar("Başvurma harcı – sulh/icra hukuk"),
      maktuKararIlam: tutar("Maktu karar ve ilam harcı"),
      nispiBinde: tutar("Nispi karar ve ilam harcı (binde)"),
      vekaletSuretHarci: tutar("Vekalet suret harcı"),
      baroPulu: tutar("Vekalet pulu"),
      kesifHarci: tutar("Keşif harcı"),
      istinafBasvurma: tutar("İstinaf başvurma harcı"),
      temyizBasvurma: tutar("Temyiz başvurma harcı"),
    },
    { label: "Yargı harçları" },
  ),
  giderAvansi: fields.object(
    {
      sabitTutar: tutar("Sabit gider avansı"),
      tebligatUcreti: tutar("Tebligat ücreti"),
      tarafBasinaTebligat: tutar("Taraf başına tebligat adedi"),
      tanikBasi: tutar("Tanık başına tahmini gider"),
      bilirkisiBasi: tutar("Bilirkişi başına tahmini ücret"),
    },
    { label: "Gider avansı" },
  ),
  aaut: fields.object(
    {
      nispiDilimler: fields.array(
        fields.object({ genislik: dilimGenisligi, oranYuzde: tutar("Oran (%)") }),
        { label: "Nispi dilimler", itemLabel: (p) => `%${p.fields.oranYuzde.value ?? ""}` },
      ),
      maktu: fields.array(
        fields.object({
          kod: fields.text({ label: "Kod", validation: { isRequired: true } }),
          ad: fields.text({ label: "Yargı yeri / iş", validation: { isRequired: true } }),
          tutar: tutar("Ücret"),
        }),
        { label: "Maktu ücretler", itemLabel: (p) => p.fields.ad.value },
      ),
    },
    { label: "Avukatlık Asgari Ücret Tarifesi" },
  ),
  arabuluculuk: fields.object(
    {
      saatlik: fields.array(
        fields.object({
          tur: fields.text({ label: "Kod", validation: { isRequired: true } }),
          ad: fields.text({ label: "Uyuşmazlık türü", validation: { isRequired: true } }),
          ikiTarafKisiBasi: tutar("2 taraf – kişi başı saat ücreti"),
          ucBesTaraf: tutar("3-5 taraf – saat ücreti"),
          altiOnTaraf: tutar("6-10 taraf – saat ücreti"),
          onbirUstuTaraf: tutar("11+ taraf – saat ücreti"),
        }),
        { label: "Saatlik ücretler", itemLabel: (p) => p.fields.ad.value },
      ),
      nispiDilimler: fields.array(
        fields.object({
          genislik: dilimGenisligi,
          tekYuzde: tutar("Tek arabulucu (%)"),
          cokYuzde: tutar("Birden fazla arabulucu (%)"),
        }),
        { label: "Nispi dilimler", itemLabel: (p) => `%${p.fields.tekYuzde.value ?? ""}` },
      ),
      asgariAnlasma: tutar("Anlaşmada asgari ücret"),
      asgariTicariAnlasma: tutar("Ticari / ortaklığın giderilmesi anlaşmada asgari ücret"),
      asgariSaat: tutar("Asgari saat"),
    },
    { label: "Arabuluculuk tarifesi" },
  ),
  kiraTufe: fields.array(
    fields.object({
      ay: fields.text({ label: "Kira artış ayı (YYYY-AA)", validation: { isRequired: true } }),
      oran: tutar("TÜFE 12 aylık ortalama (%)"),
    }),
    { label: "Kira artış oranları", itemLabel: (p) => `${p.fields.ay.value}: %${p.fields.oran.value ?? ""}` },
  ),
  kaynaklar: fields.array(
    fields.object({ ad: fields.text({ label: "Kaynak" }), url: fields.url({ label: "Bağlantı" }) }),
    { label: "Kaynaklar", itemLabel: (p) => p.fields.ad.value },
  ),
};
