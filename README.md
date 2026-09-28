# Akış Partners Hukuk & Danışmanlık — Web Sitesi

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · Keystatic (içerik yönetimi)

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev                  # http://localhost:3000
```

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Üretim derlemesi ve sunucusu |
| `npm run lint` | ESLint |
| `npm test` | Hesaplama araçlarının birim testleri (vitest) |
| `node scripts/rehber/derle.mjs` | Adliye/cezaevi telefon rehberini resmî sitelerden yeniden derler |

## Yayın

- Repo: `Emirtariksahin/akis-partners` — `main` dalına yapılan her push Vercel'de production yayını başlatır;
  diğer dallar önizleme (preview) yayını alır.
- Vercel ortam değişkenleri: `APP_URL`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`
  ve Keystatic GitHub App değerleri (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`,
  `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`). Açıklamalar `.env.example` içinde.

## İçerik yönetimi (Keystatic)

Yönetim paneli: **`/keystatic`**. Geliştirme ortamında içerik doğrudan `content/` klasörüne yazılır.
Üretimde `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` tanımlanırsa panel, değişiklikleri GitHub reposuna commit eder ve
Vercel siteyi yeniden derler (panel ilk açılışta GitHub App kurulumunu yönlendirir).

| Panel bölümü | Dosyalar | Kullanıldığı yer |
| --- | --- | --- |
| Makaleler | `content/makaleler/*.mdoc` | `/makaleler`, ana sayfa |
| Faaliyet Alanları | `content/faaliyet-alanlari/*.mdoc` | `/faaliyet-alanlari`, menü, footer |
| Ekibimiz | `content/ekip/*.mdoc` + `public/images/ekip/` | `/ekibimiz`, `/kurumsal` |
| KTK Maddeleri | `content/ktk/*.mdoc` | Trafik Kusur ve Ceza Rehberi |
| Yasal Metinler | `content/yasal/*.mdoc` | Yasal uyarı, KVKK, gizlilik, çerez sayfaları |
| Site Ayarları | `content/ayarlar/site.yaml` | Telefon, adres, harita, sosyal medya, duyuru çubuğu |
| Hesaplama Parametreleri | `content/ayarlar/hesaplama-parametreleri.yaml` | Tüm hesaplama araçları |

### Yıllık güncelleme kontrol listesi (Hesaplama Parametreleri)

- **Ocak:** asgari ücret, gelir vergisi dilimleri, harçlar (başvurma/karar-ilam/vekalet pulu), gider avansı, arabuluculuk tarifesi, kıdem tavanı (I. dönem)
- **Temmuz:** kıdem tavanı (II. dönem)
- **Kasım:** Avukatlık Asgari Ücret Tarifesi
- **Her ay (3'ünde TÜİK bülteni sonrası):** kira artış oranı (TÜFE 12 aylık ortalama)
- **Trafik cezaları:** yeniden değerleme veya kanun değişikliğinde KTK maddeleri

Parametre yapısı `lib/calculators/params.ts` (tip ve test varsayılanları) ile `lib/calculators/params-schema.ts`
(panel alanları) dosyalarında birebir aynı tutulmalıdır.

## Proje yapısı

```
app/(site)/             Site sayfaları (kendi root layout'u)
app/keystatic/          İçerik yönetim paneli (ayrı root layout)
app/api/keystatic/      Panel API'si
components/site/        Ortak site bileşenleri (çerez onayı, kopyalama kaynağı, harita, rehberler)
components/calculators/ Hesaplayıcı arayüzleri
lib/calculators/        Hesaplama mantığı (saf fonksiyonlar + testler)
lib/content.ts          Keystatic okuyucu
lib/taxonomy.ts         Faaliyet kategorileri, araç listesi
content/                İçerik dosyaları
scripts/                İçerik kurulum ve derleme betikleri
```

## Uyum notları

- TBB Reklam Yasağı Yönetmeliği gereği müvekkil görüşleri, başarı istatistikleri ve "uzmanlık" iddiası kullanılmaz;
  URL'ler anahtar kelime odaklı değildir.
- Google Haritalar yalnızca çerez onayıyla yüklenir; hesaplama girdileri tarayıcıda işlenir, sunucuya gönderilmez.
- 40 karakterden uzun kopyalamalara sayfa adresi "Kaynak" olarak eklenir (`components/site/CopyAttribution.tsx`).
