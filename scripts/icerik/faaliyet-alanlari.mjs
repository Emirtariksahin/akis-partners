// Faaliyet alanı taslak içeriklerini Keystatic formatında (content/faaliyet-alanlari/*.mdoc) üretir.
// Tek seferlik kurulum betiğidir; içerik oluşturulduktan sonra düzenlemeler Keystatic panelinden yapılır.
// Çalıştırma: node scripts/icerik/faaliyet-alanlari.mjs [--uzerine-yaz]

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ALANLAR = [
  // ── Kurumsal & Ticari ──────────────────────────────────────────────
  {
    slug: "sirketler-hukuku-ve-yonetim",
    baslik: "Şirketler Hukuku ve Yönetim",
    kategori: "kurumsal-ticari",
    ozet: "Şirket kuruluşundan genel kurul ve yönetim kurulu süreçlerine, pay devirlerinden ortaklar arası uyuşmazlıklara kadar şirketlerin kurumsal hayatına ilişkin hukuki destek.",
    altBasliklar: [
      ["Kuruluş ve esas sözleşme", "Anonim ve limited şirketlerin kuruluşu, esas sözleşmenin hazırlanması ve tadili, sermaye artırımı ve azaltımı işlemleri."],
      ["Kurumsal yönetim", "Genel kurul ve yönetim kurulu toplantılarının hazırlanması, kararların yazımı, iç yönergeler ve imza yetkilerinin düzenlenmesi."],
      ["Pay devirleri ve ortaklık yapısı", "Pay devri sözleşmeleri, pay sahipleri sözleşmeleri, ön alım ve birlikte satış hakları gibi ortaklık düzenlemeleri."],
      ["Ortaklar arası uyuşmazlıklar", "Genel kurul kararlarının iptali, ortaklıktan çıkma ve çıkarılma, yönetim kurulu üyelerinin sorumluluğuna ilişkin davalar."],
    ],
    araclar: ["arabuluculuk-ucreti-hesaplama", "vekalet-ucreti-hesaplama"],
    icerik: `Şirketler hukuku, bir ticari işletmenin kuruluşundan tasfiyesine kadar geçen süreçte ortaklar, yöneticiler ve şirket arasındaki ilişkileri düzenler. 6102 sayılı Türk Ticaret Kanunu başta olmak üzere ilgili mevzuat, şirket organlarının yetki ve sorumluluklarını ayrıntılı biçimde belirler.

Büromuz; şirketlerin günlük işleyişinde karşılaştığı kurumsal işlemlerde, organ kararlarının mevzuata uygun şekilde alınmasında ve ortaklık yapısında yapılacak değişikliklerde müvekkillerine hukuki destek sunar. Uyuşmazlık doğması hâlinde ise dava ve tahkim süreçlerini takip eder.

## Bu alanda sunulan hizmetler

- Şirket kuruluşu, tür değişikliği, birleşme ve bölünme işlemlerinin hazırlanması
- Genel kurul ve yönetim kurulu kararlarının hazırlanması ve tescil süreçleri
- Pay devri ve pay sahipleri sözleşmelerinin müzakeresi ve yazımı
- Şirket içi yönetmelik, imza sirküleri ve yetki düzenlemeleri
- Ortaklar arası uyuşmazlıklarda dava ve arabuluculuk süreçleri`,
  },
  {
    slug: "ticaret-hukuku",
    baslik: "Ticaret Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Tacirler arasındaki ticari ilişkilerden kıymetli evraka, cari hesap ve ticari alacaklardan haksız rekabete uzanan konularda danışmanlık ve dava takibi.",
    altBasliklar: [
      ["Ticari sözleşmeler", "Satış, distribütörlük, bayilik, acentelik ve franchise gibi ticari sözleşmelerin hazırlanması ve incelenmesi."],
      ["Kıymetli evrak", "Çek, bono ve poliçeye dayalı alacakların takibi; menfi tespit ve istirdat davaları."],
      ["Ticari alacaklar", "Cari hesap ve fatura alacaklarının tahsili, dava şartı arabuluculuk ve icra takipleri."],
      ["Haksız rekabet", "Ticari itibarı zedeleyen ve dürüstlük kuralına aykırı davranışlara karşı tespit, men ve tazminat talepleri."],
    ],
    araclar: ["arabuluculuk-ucreti-hesaplama", "mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Ticaret hukuku, tacirlerin birbirleriyle ve üçüncü kişilerle kurdukları ilişkilerde uygulanan özel kuralları kapsar. Ticari işlerde basiretli iş adamı gibi davranma yükümlülüğü, ticari faiz ve ispat kuralları gibi düzenlemeler bu ilişkileri genel hükümlerden ayırır.

Konusu bir miktar paranın ödenmesi olan ticari davalarda dava açılmadan önce arabulucuya başvurulması zorunludur. Büromuz; sözleşme aşamasındaki risklerin belirlenmesinden, uyuşmazlık hâlinde arabuluculuk, dava ve icra süreçlerinin yürütülmesine kadar ticari ilişkinin her aşamasında hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Ticari sözleşmelerin hazırlanması, müzakeresi ve risk analizi
- Kıymetli evraka dayalı takip ve davalar
- Dava şartı arabuluculuk süreçlerinde temsil
- Ticari alacakların dava ve icra yoluyla takibi
- Haksız rekabet ve ticari itibar ihlallerine ilişkin davalar`,
  },
  {
    slug: "sozlesme-hukuku",
    baslik: "Sözleşme Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Sözleşmelerin hazırlanması, müzakeresi ve denetiminden ifa edilmemesi, fesih ve tazminat uyuşmazlıklarına kadar sözleşme ilişkisinin tüm aşamaları.",
    altBasliklar: [
      ["Hazırlık ve müzakere", "Tarafların beklentilerine uygun, açık ve uygulanabilir sözleşme metinlerinin hazırlanması."],
      ["Sözleşme denetimi", "Mevcut sözleşmelerin hukuki risk, cezai şart ve sorumluluk hükümleri bakımından incelenmesi."],
      ["İfa ve fesih", "Temerrüt, ayıplı ifa, aşırı ifa güçlüğü ve fesih bildirimlerinin hazırlanması."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama", "vekalet-ucreti-hesaplama"],
    icerik: `Sözleşmeler, tarafların hak ve yükümlülüklerini belirleyen temel hukuki araçlardır. 6098 sayılı Türk Borçlar Kanunu sözleşme serbestisini tanımakla birlikte, emredici hükümler, genel işlem koşulları ve dürüstlük kuralı bu serbestinin sınırlarını çizer.

İyi hazırlanmış bir sözleşme, ileride doğabilecek uyuşmazlıkların önemli bir kısmını baştan önler. Büromuz sözleşme metinlerini hazırlarken ve incelerken ifa koşulları, cezai şart, sorumluluğun sınırlandırılması, uyuşmazlık çözüm yolu ve yetkili yargı yeri gibi hükümleri müvekkilin durumuna göre değerlendirir.

## Bu alanda sunulan hizmetler

- Her türlü sözleşmenin hazırlanması ve müzakeresi
- Genel işlem koşullarının mevzuata uygunluk incelemesi
- İhtarname, fesih ve temerrüt bildirimlerinin hazırlanması
- Sözleşmeden doğan alacak, tazminat ve cezai şart davaları`,
  },
  {
    slug: "fikri-mulkiyet-hukuku",
    baslik: "Fikri Mülkiyet Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Marka, patent, tasarım ve telif haklarının tescili, korunması ve ihlallere karşı hukuki yolların kullanılması.",
    altBasliklar: [
      ["Marka ve tasarım", "Marka ve endüstriyel tasarım başvuruları, itirazlar ve Türk Patent ve Marka Kurumu nezdindeki süreçler."],
      ["Telif hakları", "Fikir ve sanat eserlerinden doğan hakların korunması, lisans ve devir sözleşmeleri."],
      ["İhlal davaları", "Tecavüzün tespiti, men'i ve tazminat talepli davalar ile ihtiyati tedbir süreçleri."],
    ],
    araclar: ["vekalet-ucreti-hesaplama"],
    icerik: `Fikri mülkiyet hakları; markalar, patentler, faydalı modeller, tasarımlar ve fikir ve sanat eserleri üzerindeki hakları kapsar. 6769 sayılı Sınai Mülkiyet Kanunu ile 5846 sayılı Fikir ve Sanat Eserleri Kanunu bu hakların kazanılması ve korunmasına ilişkin temel düzenlemelerdir.

Ticari değeri yüksek bu hakların zamanında tescil ettirilmesi ve izinsiz kullanımlara karşı etkin biçimde korunması önem taşır. Büromuz başvuru ve itiraz süreçlerinde, lisans sözleşmelerinin hazırlanmasında ve ihlal hâlinde fikri ve sınai haklar mahkemelerindeki davalarda müvekkillerini temsil eder.

## Bu alanda sunulan hizmetler

- Marka, patent ve tasarım başvuru ve itiraz süreçleri
- Lisans, devir ve gizlilik sözleşmeleri
- Tecavüzün tespiti, men'i ve tazminat davaları
- Alan adı uyuşmazlıkları ve internet ortamındaki ihlaller`,
  },
  {
    slug: "rekabet-hukuku",
    baslik: "Rekabet Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Rekabeti kısıtlayıcı anlaşmalar, hâkim durumun kötüye kullanılması ve birleşme-devralma bildirimleri bakımından uyum ve temsil hizmetleri.",
    altBasliklar: [
      ["Uyum programları", "Şirket içi rekabet uyum politikalarının hazırlanması ve çalışanlara yönelik bilgilendirme."],
      ["Rekabet Kurumu süreçleri", "Önaraştırma, soruşturma ve yerinde incelemelerde müvekkilin temsili."],
      ["İzin başvuruları", "Birleşme ve devralmaların Rekabet Kurulu iznine sunulması ve muafiyet değerlendirmeleri."],
    ],
    araclar: [],
    icerik: `4054 sayılı Rekabetin Korunması Hakkında Kanun, piyasada rekabeti engelleyen, bozan veya kısıtlayan anlaşma ve uygulamaları yasaklar; belirli eşikleri aşan birleşme ve devralmaları Rekabet Kurulunun iznine bağlar. Kanuna aykırılığın yaptırımı, teşebbüsün cirosu üzerinden hesaplanan idari para cezalarıdır.

Büromuz, müvekkillerinin ticari faaliyetlerini rekabet hukuku bakımından değerlendirir; dağıtım sözleşmeleri, fiyatlama politikaları ve rakiplerle bilgi paylaşımı gibi riskli alanlarda uyum çalışmaları yürütür. Rekabet Kurumu nezdindeki süreçlerde ve Kurul kararlarına karşı açılan idari davalarda temsil hizmeti sunar.

## Bu alanda sunulan hizmetler

- Rekabet hukuku uyum incelemesi ve eğitimleri
- Birleşme ve devralma izin başvuruları
- Soruşturma ve yerinde inceleme süreçlerinde temsil
- Kurul kararlarına karşı idari dava süreçleri`,
  },
  {
    slug: "uluslararasi-ticaret-hukuku",
    baslik: "Uluslararası Ticaret Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Yabancı unsurlu ticari ilişkilerde sözleşme, teslim ve ödeme koşulları, uygulanacak hukuk ve uyuşmazlık çözüm yollarına ilişkin danışmanlık.",
    altBasliklar: [
      ["Uluslararası satım", "Viyana Satım Sözleşmesi (CISG) kapsamındaki satış ilişkileri ve teslim şekilleri (Incoterms)."],
      ["Yabancı unsurlu sözleşmeler", "Uygulanacak hukuk, yetkili mahkeme ve tahkim şartlarının belirlenmesi."],
      ["Yabancı kararlar", "Yabancı mahkeme ve hakem kararlarının Türkiye'de tanınması ve tenfizi."],
    ],
    araclar: [],
    icerik: `Uluslararası ticari ilişkilerde taraflar farklı hukuk düzenlerine tabidir; bu nedenle sözleşmede uygulanacak hukukun, yetkili yargı yerinin ve uyuşmazlık çözüm yönteminin açıkça belirlenmesi büyük önem taşır. 5718 sayılı Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanun ve Türkiye'nin taraf olduğu uluslararası sözleşmeler bu alandaki temel kaynaklardır.

Büromuz ithalat ve ihracat yapan şirketlere sözleşme hazırlığı, teslim ve ödeme koşulları, akreditif ve teminat yapıları konusunda destek sağlar; uyuşmazlık hâlinde yurt içi yargı ve tahkim süreçlerini takip eder.

## Bu alanda sunulan hizmetler

- Uluslararası satış, distribütörlük ve acentelik sözleşmeleri
- Uygulanacak hukuk ve tahkim şartlarının hazırlanması
- Yabancı unsurlu ticari uyuşmazlıklarda dava ve tahkim takibi
- Yabancı kararların tanınması ve tenfizi`,
  },
  {
    slug: "vergi-hukuku",
    baslik: "Vergi Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Vergi incelemeleri, tarhiyat ve ceza ihbarnameleri, uzlaşma süreçleri ve vergi mahkemelerindeki davalarda hukuki destek.",
    altBasliklar: [
      ["Vergi incelemeleri", "İnceleme süreçlerinde mükellef haklarının korunması ve tutanakların değerlendirilmesi."],
      ["Uzlaşma", "Tarhiyat öncesi ve sonrası uzlaşma görüşmelerinin hazırlanması ve yürütülmesi."],
      ["Vergi davaları", "Vergi ve ceza ihbarnamelerine karşı vergi mahkemelerinde iptal davaları."],
    ],
    araclar: ["vekalet-ucreti-hesaplama"],
    icerik: `Vergi hukuku, devletin vergi alacağı ile mükelleflerin hak ve yükümlülüklerini düzenler. 213 sayılı Vergi Usul Kanunu ve 2577 sayılı İdari Yargılama Usulü Kanunu, vergi incelemesinden dava aşamasına kadar izlenecek usulü ve sürelere ilişkin kuralları içerir.

Vergi uyuşmazlıklarında süreler kısa ve hak düşürücü niteliktedir. Büromuz, vergi incelemesi aşamasından başlayarak uzlaşma, idari başvuru ve dava yollarının müvekkilin durumuna göre değerlendirilmesinde ve takibinde destek sağlar.

## Bu alanda sunulan hizmetler

- Vergi incelemesi süreçlerinde danışmanlık
- Uzlaşma ve pişmanlık başvurularının hazırlanması
- Vergi ve ceza ihbarnamelerine karşı dava açılması
- Ödeme emrine ve haciz işlemlerine karşı başvurular`,
  },
  {
    slug: "birlesmeler-ve-devralmalar",
    baslik: "Birleşmeler ve Devralmalar",
    kategori: "kurumsal-ticari",
    ozet: "Şirket satın alma, birleşme ve ortaklık yapılandırmalarında hukuki inceleme, sözleşme müzakeresi ve kapanış süreçleri.",
    altBasliklar: [
      ["Hukuki inceleme (due diligence)", "Hedef şirketin sözleşmeleri, davaları, izinleri ve iş ilişkilerinin incelenerek risklerin raporlanması."],
      ["İşlem belgeleri", "Niyet mektubu, pay alım sözleşmesi, pay sahipleri sözleşmesi ve teminat düzenlemeleri."],
      ["Kapanış ve sonrası", "Rekabet Kurulu izni, tescil işlemleri ve işlem sonrası entegrasyon süreçleri."],
    ],
    araclar: [],
    icerik: `Birleşme ve devralma işlemleri; hedef şirketin hukuki durumunun ayrıntılı biçimde incelenmesini, işlem yapısının belirlenmesini ve tarafların risklerini dengeleyen sözleşmelerin hazırlanmasını gerektirir. Türk Ticaret Kanunu, Rekabet Kanunu ve sektörel düzenlemeler işlemin her aşamasında dikkate alınmalıdır.

Büromuz alıcı veya satıcı tarafında; hukuki inceleme, işlem belgelerinin hazırlanması ve müzakeresi, izin başvuruları ve kapanış işlemlerinde müvekkillerine destek sağlar.

## Bu alanda sunulan hizmetler

- Hukuki inceleme (due diligence) ve raporlama
- Pay ve varlık alım sözleşmelerinin hazırlanması ve müzakeresi
- Ortak girişim (joint venture) yapılandırmaları
- Rekabet Kurulu izin başvuruları ve kapanış işlemleri`,
  },
  {
    slug: "hukuki-danismanlik",
    baslik: "Hukuki Danışmanlık",
    kategori: "kurumsal-ticari",
    ozet: "Gerçek ve tüzel kişilere, karar almadan önce hukuki risklerin değerlendirilmesi amacıyla sürekli veya dosya bazlı danışmanlık.",
    altBasliklar: [
      ["Sürekli danışmanlık", "Şirketlerin günlük hukuki ihtiyaçları için sözleşmeli, düzenli danışmanlık hizmeti."],
      ["Görüş ve mütalaa", "Belirli bir hukuki soruya ilişkin yazılı değerlendirme ve öneriler."],
      ["Önleyici hukuk", "Uyuşmazlık doğmadan önce süreçlerin ve belgelerin mevzuata uygunluğunun sağlanması."],
    ],
    araclar: ["vekalet-ucreti-hesaplama"],
    icerik: `Hukuki danışmanlık, bir işlem yapılmadan veya bir karar alınmadan önce ilgili hukuki çerçevenin ve olası risklerin ortaya konmasını amaçlar. Zamanında alınan hukuki destek, çoğu zaman uzun ve maliyetli uyuşmazlıkların önüne geçer.

Büromuz, bireysel müvekkillere belirli konularda görüş sunmanın yanı sıra şirketlere sözleşmeli olarak sürekli danışmanlık hizmeti verir. Danışmanlık ücretleri, Türkiye Barolar Birliği tarafından belirlenen Avukatlık Asgari Ücret Tarifesi esas alınarak kararlaştırılır.

## Bu alanda sunulan hizmetler

- Sözleşmeli sürekli hukuki danışmanlık
- Yazılı hukuki görüş hazırlanması
- Mevzuat değişikliklerinin şirket süreçlerine etkisinin değerlendirilmesi
- Toplantı ve müzakerelere hukuki destek`,
  },
  {
    slug: "tahkim-hukuku",
    baslik: "Tahkim Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Ulusal ve uluslararası tahkim süreçlerinde tahkim şartının hazırlanmasından hakem kararının icrasına kadar temsil.",
    altBasliklar: [
      ["Tahkim şartı", "Sözleşmelere uygulanabilir ve kapsamı açık tahkim şartlarının yazılması."],
      ["Tahkim yargılaması", "İSTAC, ICC ve benzeri kurumlar ile ad hoc tahkim süreçlerinde temsil."],
      ["Hakem kararları", "Hakem kararlarına karşı iptal davası ile yabancı hakem kararlarının tanınması ve tenfizi."],
    ],
    araclar: [],
    icerik: `Tahkim, tarafların uyuşmazlıklarını devlet mahkemeleri yerine seçtikleri hakemler aracılığıyla çözdükleri bir yoldur. Gizlilik, uzmanlaşmış hakem seçimi ve kararların uluslararası alanda tanınabilirliği, tahkimi özellikle ticari uyuşmazlıklarda tercih edilen bir yöntem hâline getirir.

Tahkim sürecinin sağlıklı işlemesi, büyük ölçüde sözleşmedeki tahkim şartının doğru yazılmasına bağlıdır. Büromuz tahkim şartlarının hazırlanmasından yargılama sürecinin yürütülmesine ve kararın icrasına kadar müvekkillerine destek sağlar.

## Bu alanda sunulan hizmetler

- Tahkim şartı ve tahkim sözleşmesi hazırlanması
- Kurumsal ve ad hoc tahkim yargılamalarında temsil
- Hakem kararlarına karşı iptal davaları
- Yabancı hakem kararlarının tanınması ve tenfizi`,
  },
  {
    slug: "insaat-ve-altyapi-hukuku",
    baslik: "İnşaat ve Altyapı Hukuku",
    kategori: "kurumsal-ticari",
    ozet: "Eser ve yapım sözleşmeleri, kat karşılığı inşaat, kamu ihaleleri ve inşaat projelerinden doğan uyuşmazlıklarda danışmanlık ve temsil.",
    altBasliklar: [
      ["Yapım sözleşmeleri", "Eser sözleşmeleri, alt yüklenici ve FIDIC tipi sözleşmelerin hazırlanması ve incelenmesi."],
      ["Kat karşılığı inşaat", "Arsa payı karşılığı inşaat sözleşmeleri ve bu sözleşmelerden doğan uyuşmazlıklar."],
      ["Kamu ihaleleri", "İhale süreçleri, itirazen şikâyet başvuruları ve idari davalar."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `İnşaat ve altyapı projeleri; uzun süreli, çok taraflı ve yüksek maliyetli yapıları nedeniyle ayrıntılı sözleşme düzenlemeleri gerektirir. İş programı, hakediş, süre uzatımı, ayıplı iş ve gecikme cezaları bu alandaki uyuşmazlıkların başlıca konularıdır.

Büromuz yükleniciler, iş sahipleri ve arsa sahiplerine sözleşme hazırlığından proje teslimine kadar olan süreçte hukuki destek verir; uyuşmazlık hâlinde dava, tahkim ve kamu ihale süreçlerini takip eder.

## Bu alanda sunulan hizmetler

- Yapım ve kat karşılığı inşaat sözleşmelerinin hazırlanması
- Hakediş, süre uzatımı ve ayıp uyuşmazlıkları
- Kamu ihale mevzuatı kapsamında başvuru ve davalar
- Kentsel dönüşüm süreçlerinde danışmanlık`,
  },

  // ── Uyuşmazlık & Dava ──────────────────────────────────────────────
  {
    slug: "uyusmazlik-cozumu",
    baslik: "Uyuşmazlık Çözümü",
    kategori: "uyusmazlik-dava",
    ozet: "Uyuşmazlıkların müzakere, arabuluculuk, uzlaştırma, tahkim veya dava yoluyla çözümünde müvekkilin durumuna uygun yolun belirlenmesi ve yürütülmesi.",
    altBasliklar: [
      ["Müzakere ve sulh", "Taraflar arasında dava dışı çözüm arayışında müzakerelerin yürütülmesi ve sulh sözleşmelerinin hazırlanması."],
      ["Arabuluculuk", "Dava şartı ve ihtiyari arabuluculuk görüşmelerinde temsil."],
      ["Dava ve tahkim", "Anlaşma sağlanamayan uyuşmazlıkların yargı veya tahkim yoluyla çözümü."],
    ],
    araclar: ["arabuluculuk-ucreti-hesaplama", "mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Her uyuşmazlık için en uygun çözüm yolu aynı değildir. Uyuşmazlığın niteliği, tarafların ilişkisinin sürekliliği, ispat durumu, maliyet ve süre gibi etkenler; müzakere, arabuluculuk, tahkim veya dava yollarından hangisinin tercih edileceğini belirler.

İş, ticaret, tüketici ve kira uyuşmazlıklarının önemli bir kısmında dava açılmadan önce arabulucuya başvurulması zorunludur. Büromuz uyuşmazlığı öncelikle bütün yönleriyle değerlendirir ve müvekkiline seçenekleri, olası sonuçları ve maliyetleriyle birlikte sunar.

## Bu alanda sunulan hizmetler

- Uyuşmazlık analizi ve strateji belirlenmesi
- Arabuluculuk ve uzlaştırma süreçlerinde temsil
- Sulh ve ibra sözleşmelerinin hazırlanması
- Dava ve tahkim süreçlerinin yürütülmesi`,
  },
  {
    slug: "dava-takibi",
    baslik: "Dava Takibi",
    kategori: "uyusmazlik-dava",
    ozet: "Adli ve idari yargı mercilerinde, ilk derece yargılamasından istinaf ve temyiz aşamalarına kadar davaların takibi.",
    altBasliklar: [
      ["İlk derece yargılaması", "Dilekçelerin hazırlanması, delillerin sunulması, duruşma ve keşiflere katılım."],
      ["Kanun yolları", "İstinaf ve temyiz başvurularının hazırlanması ve takibi."],
      ["Dosya takibi", "UYAP üzerinden süreli işlemlerin izlenmesi ve müvekkilin düzenli bilgilendirilmesi."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama", "islah-harci-hesaplama", "vekalet-ucreti-hesaplama"],
    icerik: `Yargılama süreci; dava dilekçesinin hazırlanmasıyla başlayıp kararın kesinleşmesine kadar süren, süreli ve şekli kurallara bağlı bir süreçtir. Hak düşürücü sürelerin kaçırılması veya delillerin zamanında sunulmaması telafisi güç sonuçlar doğurabilir.

Büromuz üstlendiği davaları UYAP üzerinden düzenli olarak takip eder, duruşma ve keşiflere katılır, müvekkilini sürecin her aşamasında bilgilendirir. Yargılama giderleri ve vekalet ücreti hakkında ön bilgi için hukuki araçlar bölümümüzdeki hesaplayıcılardan yararlanılabilir.

## Bu alanda sunulan hizmetler

- Hukuk, ceza ve idari yargıda dava takibi
- İstinaf ve temyiz başvuruları
- Delil tespiti, ihtiyati tedbir ve ihtiyati haciz talepleri
- Kararların icrası ve kesinleştirme işlemleri`,
  },
  {
    slug: "icra-ve-iflas-hukuku",
    baslik: "İcra ve İflas Hukuku",
    kategori: "uyusmazlik-dava",
    ozet: "Alacakların icra takibi yoluyla tahsili, borçlu tarafında itiraz ve şikâyet süreçleri, iflas ve konkordato işlemleri.",
    altBasliklar: [
      ["Alacak takibi", "İlamlı ve ilamsız takipler, kambiyo senetlerine dayalı takipler ve haciz işlemleri."],
      ["Borçlu hakları", "Ödeme emrine itiraz, şikâyet, menfi tespit ve istirdat davaları."],
      ["İflas ve konkordato", "İflas takipleri, konkordato başvuruları ve alacak kayıt süreçleri."],
    ],
    araclar: ["vekalet-ucreti-hesaplama", "mahkeme-harc-ve-gider-hesaplama"],
    icerik: `2004 sayılı İcra ve İflas Kanunu, para ve teminat alacaklarının devlet gücüyle tahsilini düzenler. Takip yolunun doğru seçilmesi, sürelerin takibi ve borçlunun malvarlığının zamanında tespit edilmesi tahsil sürecinin başarısını doğrudan etkiler.

Büromuz alacaklı tarafında takiplerin başlatılması ve yürütülmesi, borçlu tarafında ise itiraz, şikâyet ve dava yollarının kullanılması konusunda hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- İlamlı, ilamsız ve kambiyo senetlerine dayalı icra takipleri
- İtirazın iptali ve itirazın kaldırılması davaları
- Haciz, satış ve paraya çevirme işlemleri
- Konkordato ve iflas süreçleri`,
  },
  {
    slug: "tanima-ve-tenfiz-davalari",
    baslik: "Tanıma ve Tenfiz Davaları",
    kategori: "uyusmazlik-dava",
    ozet: "Yabancı mahkeme ve hakem kararlarının, özellikle yurt dışında verilen boşanma kararlarının Türkiye'de hüküm doğurması için açılan davalar.",
    altBasliklar: [
      ["Yabancı boşanma kararları", "Yurt dışında boşanan Türk vatandaşlarının kararlarının Türkiye'de tanınması ve nüfus kayıtlarına işlenmesi."],
      ["Ticari kararlar", "Yabancı mahkeme ve hakem kararlarının tenfizi ve icraya konulması."],
      ["Gerekli belgeler", "Apostil, onaylı tercüme ve kesinleşme şerhi gibi belgelerin temini konusunda yönlendirme."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Yabancı bir mahkemenin veya hakem heyetinin verdiği karar, Türkiye'de kendiliğinden hüküm doğurmaz. Kararın kesin hüküm veya kesin delil etkisi için tanıma, icra edilebilmesi için ise tenfiz kararı alınması gerekir. Şartlar 5718 sayılı Milletlerarası Özel Hukuk ve Usul Hukuku Hakkında Kanun'da düzenlenmiştir.

Uygulamada en sık karşılaşılan örnek, yurt dışında verilen boşanma kararlarının Türkiye'de tanınmasıdır. Belirli şartları taşıyan yabancı boşanma kararları, nüfus müdürlükleri aracılığıyla idari yoldan da kayda geçirilebilir. Büromuz, somut durumda hangi yolun uygun olduğunu değerlendirir ve süreci takip eder.

## Bu alanda sunulan hizmetler

- Yabancı boşanma kararlarının tanınması
- Yabancı mahkeme ve hakem kararlarının tenfizi
- Belge temini ve tercüme süreçlerinde yönlendirme
- Tanınan kararların nüfus ve tapu kayıtlarına işlenmesi`,
  },
  {
    slug: "idare-hukuku",
    baslik: "İdare Hukuku",
    kategori: "uyusmazlik-dava",
    ozet: "İdari işlem ve eylemlere karşı iptal ve tam yargı davaları, kamu görevlileri, imar, ihale ve disiplin uyuşmazlıkları.",
    altBasliklar: [
      ["İptal davaları", "Hukuka aykırı idari işlemlerin iptali ve yürütmenin durdurulması talepleri."],
      ["Tam yargı davaları", "İdarenin eylem ve işlemlerinden doğan zararların tazmini."],
      ["Kamu personeli", "Atama, disiplin, sınav ve özlük haklarına ilişkin uyuşmazlıklar."],
      ["İmar ve ruhsat", "İmar planları, yapı ruhsatı, yıkım ve idari para cezalarına karşı başvurular."],
    ],
    araclar: ["vekalet-ucreti-hesaplama", "mahkeme-harc-ve-gider-hesaplama"],
    icerik: `İdare hukuku, idarenin kuruluşunu, işleyişini ve bireylerle ilişkilerini düzenler. İdari işlemlere karşı açılacak davalar 2577 sayılı İdari Yargılama Usulü Kanunu'na tabidir ve dava açma süreleri, kural olarak işlemin tebliğinden itibaren altmış gündür.

Büromuz; kamu görevlileri, şirketler ve bireyler adına idari başvuruların hazırlanması, iptal ve tam yargı davalarının açılması ve takibi konularında hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- İptal ve tam yargı davaları
- Yürütmenin durdurulması talepleri
- Kamu personeli uyuşmazlıkları ve disiplin soruşturmaları
- İmar, ruhsat ve idari para cezası uyuşmazlıkları`,
  },
  {
    slug: "kamulastirma-hukuku",
    baslik: "Kamulaştırma",
    kategori: "uyusmazlik-dava",
    ozet: "Kamulaştırma bedelinin tespiti ve tescili davaları, kamulaştırmasız el atma ve bedel artırım uyuşmazlıkları.",
    altBasliklar: [
      ["Bedel tespiti ve tescil", "İdare tarafından açılan davalarda taşınmaz malikinin temsili ve gerçek değerin tespiti."],
      ["Kamulaştırmasız el atma", "Usulüne uygun kamulaştırma yapılmadan el konulan taşınmazlar için tazminat davaları."],
      ["İdari yargı yolu", "Kamulaştırma kararına ve kamu yararı kararına karşı iptal davaları."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Kamulaştırma, kamu yararının gerektirdiği hâllerde özel mülkiyetteki taşınmazların bedeli ödenerek idare tarafından edinilmesidir. Anayasa'nın 46. maddesi ve 2942 sayılı Kamulaştırma Kanunu, bedelin gerçek karşılığa uygun olarak ve peşin ödenmesini öngörür.

Bedelin belirlenmesinde taşınmazın niteliği, emsal satışlar ve bilirkişi raporları belirleyicidir. Büromuz taşınmaz maliklerini uzlaşma görüşmelerinde, bedel tespiti ve tescil davalarında ve kamulaştırmasız el atma uyuşmazlıklarında temsil eder.

## Bu alanda sunulan hizmetler

- Uzlaşma görüşmelerinde danışmanlık
- Bedel tespiti ve tescil davalarında temsil
- Kamulaştırmasız el atma tazminatı davaları
- Kamulaştırma işlemlerine karşı idari davalar`,
  },

  // ── Bireysel Hukuk ─────────────────────────────────────────────────
  {
    slug: "aile-hukuku",
    baslik: "Aile Hukuku",
    kategori: "bireysel",
    ozet: "Boşanma, nafaka, velayet ve mal rejiminin tasfiyesi gibi aile ilişkilerinden doğan uyuşmazlıklarda gizlilik ilkesine özen gösterilerek sunulan hukuki destek.",
    altBasliklar: [
      ["Boşanma", "Anlaşmalı boşanmada protokolün hazırlanması; çekişmeli boşanmada evlilik birliğinin temelden sarsılması, zina, hayata kast ve pek kötü muamele, terk gibi sebeplere dayalı davaların takibi. Anlaşmalı boşanma için evliliğin en az bir yıl sürmüş olması gerekir."],
      ["Nafaka", "Boşanma davası sürecinde hükmedilen tedbir nafakası; boşanma sonrası yoksulluğa düşecek eş için yoksulluk nafakası; çocuğun bakım ve eğitim giderleri için iştirak nafakası. Tarafların mali durumu değiştiğinde nafakanın artırılması veya azaltılması talep edilebilir."],
      ["Velayet ve kişisel ilişki", "Çocuğun üstün yararı gözetilerek velayetin belirlenmesi, velayetin değiştirilmesi ve çocukla kişisel ilişki düzenlenmesi."],
      ["Mal rejiminin tasfiyesi", "Edinilmiş mallara katılma rejiminde katılma alacağı, değer artış payı ve katkı payı alacakları."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Aile hukuku uyuşmazlıkları, tarafların özel hayatlarını ve çoğu zaman çocuklarını doğrudan etkiler. Bu nedenle hukuki sürecin, gizlilik ve özen ilkeleri gözetilerek, mümkün olduğunca tarafların ve özellikle çocukların yararını koruyacak biçimde yürütülmesi önemlidir.

4721 sayılı Türk Medeni Kanunu; boşanma sebeplerini, boşanmanın mali sonuçlarını, velayet ve mal rejimine ilişkin kuralları düzenler. Aile mahkemelerinde görülen bu davalarda, ileri sürülen iddiaların delillerle desteklenmesi ve taleplerin eksiksiz biçimde dile getirilmesi sonucu doğrudan etkiler.

## Bu alanda sunulan hizmetler

- Anlaşmalı boşanma protokolünün hazırlanması ve dava takibi
- Çekişmeli boşanma, tazminat ve nafaka davaları
- Velayet, kişisel ilişki ve nafaka değişikliği davaları
- Mal rejiminin tasfiyesi ve katkı payı davaları
- 6284 sayılı Kanun kapsamında koruyucu ve önleyici tedbir talepleri`,
  },
  {
    slug: "miras-hukuku",
    baslik: "Miras Hukuku",
    kategori: "bireysel",
    ozet: "Mirasçılık belgesi, vasiyetname, miras paylaşımı, tenkis ve muris muvazaası davaları ile mirasın reddi işlemleri.",
    altBasliklar: [
      ["Mirasçılık ve paylaşım", "Mirasçılık belgesi alınması, tereke tespiti, ortaklığın giderilmesi ve miras paylaşım sözleşmeleri."],
      ["Ölüme bağlı tasarruflar", "Vasiyetname ve miras sözleşmelerinin hazırlanması, açılması ve iptali."],
      ["Saklı pay davaları", "Saklı payı zedelenen mirasçıların tenkis davaları ve muris muvazaası nedeniyle tapu iptal davaları."],
      ["Mirasın reddi", "Borca batık terekelerde mirasın reddi ve hükmen ret süreçleri."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Miras hukuku, bir kişinin ölümüyle birlikte malvarlığının kimlere ve hangi oranda geçeceğini düzenler. Türk Medeni Kanunu yasal mirasçıları ve saklı pay oranlarını belirlerken, kişiye vasiyetname veya miras sözleşmesi ile belirli sınırlar içinde tasarruf imkânı tanır.

Mirasın reddi gibi bazı haklar kısa sürelere bağlıdır; mirasın reddi, kural olarak ölümün öğrenilmesinden itibaren üç ay içinde yapılmalıdır. Büromuz mirasçıların haklarının belirlenmesi, paylaşımın yapılması ve miras kaynaklı uyuşmazlıkların çözümünde hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Mirasçılık belgesi ve tereke tespiti işlemleri
- Vasiyetname hazırlanması ve vasiyetnamenin iptali davaları
- Tenkis ve muris muvazaası davaları
- Ortaklığın giderilmesi (izale-i şuyu) davaları
- Mirasın reddi işlemleri`,
  },
  {
    slug: "kira-hukuku",
    baslik: "Kira Hukuku",
    kategori: "bireysel",
    ozet: "Konut ve çatılı işyeri kiralarında kira artışı, kira bedelinin tespiti, tahliye ve kira alacağına ilişkin uyuşmazlıklar.",
    altBasliklar: [
      ["Kira artışı ve tespit", "Yenilenen dönemlerde TÜFE sınırı, beş yıllık süre sonunda kira bedelinin tespiti davaları."],
      ["Tahliye", "İhtiyaç, yeniden inşa, tahliye taahhüdü ve temerrüt nedeniyle tahliye davaları ve icra takipleri."],
      ["Kira sözleşmeleri", "Kira sözleşmelerinin hazırlanması, depozito ve teslim tutanakları."],
    ],
    araclar: ["kira-artis-orani-hesaplama", "arabuluculuk-ucreti-hesaplama"],
    icerik: `Konut ve çatılı işyeri kiraları, Türk Borçlar Kanunu'nun 339 ve devamı maddelerinde kiracıyı koruyan özel hükümlerle düzenlenmiştir. Yenilenen kira dönemlerinde uygulanacak artış oranı, bir önceki kira yılındaki tüketici fiyat endeksinin on iki aylık ortalamalara göre değişimini geçemez.

1 Eylül 2023'ten itibaren kira ilişkisinden doğan uyuşmazlıklarda dava açılmadan önce arabulucuya başvurulması zorunludur. Büromuz kiraya veren ve kiracılara sözleşme aşamasından tahliyeye kadar hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Kira sözleşmelerinin hazırlanması ve incelenmesi
- Kira bedelinin tespiti ve uyarlama davaları
- Tahliye davaları ve tahliye takipleri
- Kira alacağının tahsili ve arabuluculuk süreçleri`,
  },
  {
    slug: "gayrimenkul-hukuku",
    baslik: "Gayrimenkul Davaları",
    kategori: "bireysel",
    ozet: "Tapu iptali ve tescil, ortaklığın giderilmesi, el atmanın önlenmesi, ecrimisil ve kat mülkiyeti uyuşmazlıkları.",
    altBasliklar: [
      ["Tapu iptali ve tescil", "Muvazaa, vekâletin kötüye kullanılması, hata ve hile gibi sebeplere dayanan tapu iptal davaları."],
      ["Ortaklığın giderilmesi", "Paylı veya elbirliği mülkiyetindeki taşınmazların aynen taksimi ya da satış yoluyla paylaştırılması."],
      ["Zilyetlik ve el atma", "Müdahalenin men'i, ecrimisil ve kal davaları."],
      ["Kat mülkiyeti", "Yönetim, aidat, ortak alanların kullanımı ve kat malikleri kurulu kararlarına ilişkin uyuşmazlıklar."],
    ],
    araclar: ["mahkeme-harc-ve-gider-hesaplama"],
    icerik: `Taşınmazlar üzerindeki haklar tapu siciline dayanır; ancak sicil kaydının gerçek hukuki durumu yansıtmadığı hâllerde çeşitli dava yolları öngörülmüştür. Bu davalarda taşınmazın değeri, harç ve yargılama giderlerini de doğrudan etkiler.

Büromuz taşınmaz alım satımı öncesinde hukuki inceleme yapılmasından tapu iptali, ortaklığın giderilmesi ve kat mülkiyeti uyuşmazlıklarına kadar gayrimenkul kaynaklı süreçlerde hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Taşınmaz alımı öncesi tapu ve imar incelemesi
- Tapu iptali ve tescil davaları
- Ortaklığın giderilmesi davaları
- Müdahalenin men'i, ecrimisil ve kal davaları
- Kat mülkiyeti uyuşmazlıkları`,
  },
  {
    slug: "tuketici-hukuku",
    baslik: "Tüketici Hukuku",
    kategori: "bireysel",
    ozet: "Ayıplı mal ve hizmet, mesafeli satış, kredi ve konut satışları gibi tüketici işlemlerinden doğan uyuşmazlıklar.",
    altBasliklar: [
      ["Ayıplı mal ve hizmet", "Sözleşmeden dönme, bedel indirimi, ücretsiz onarım ve değişim talepleri."],
      ["Tüketici hakem heyetleri", "Parasal sınırın altındaki uyuşmazlıklarda hakem heyeti başvuruları."],
      ["Bankacılık ve konut", "Kredi sözleşmeleri, dosya masrafları ve ön ödemeli konut satışlarından doğan uyuşmazlıklar."],
    ],
    araclar: ["arabuluculuk-ucreti-hesaplama", "mahkeme-harc-ve-gider-hesaplama"],
    icerik: `6502 sayılı Tüketicinin Korunması Hakkında Kanun, tüketiciye ayıplı mal ve hizmet karşısında seçimlik haklar tanır ve belirli sözleşme türleri için özel koruma hükümleri öngörür. Belirli parasal sınırın altındaki uyuşmazlıklar için tüketici hakem heyetlerine başvuru zorunludur; bu sınırın üzerindeki uyuşmazlıklarda ise kural olarak dava öncesinde arabuluculuğa başvurulması gerekir.

Büromuz tüketicilere ve satıcı-sağlayıcı konumundaki işletmelere, tüketici işlemlerinden doğan uyuşmazlıklarda başvuru yollarının belirlenmesi ve takibi konusunda destek sağlar.

## Bu alanda sunulan hizmetler

- Tüketici hakem heyeti başvuruları
- Tüketici mahkemelerinde dava takibi
- Ayıplı araç ve konut uyuşmazlıkları
- İşletmeler için tüketici mevzuatına uyum incelemesi`,
  },
  {
    slug: "is-ve-sosyal-guvenlik-hukuku",
    baslik: "İş ve Sosyal Güvenlik Hukuku",
    kategori: "bireysel",
    ozet: "İşçi ve işverenler arasındaki kıdem, ihbar, fazla mesai ve işe iade uyuşmazlıkları ile SGK kaynaklı hizmet tespiti ve iş kazası davaları.",
    altBasliklar: [
      ["İşçilik alacakları", "Kıdem ve ihbar tazminatı, fazla mesai, yıllık izin, ulusal bayram ve genel tatil ücreti alacakları."],
      ["İşe iade", "Geçerli veya haklı neden olmaksızın yapılan fesihlere karşı işe iade davaları."],
      ["Sosyal güvenlik", "Hizmet tespiti, prim ve emeklilik uyuşmazlıkları, SGK işlemlerine karşı davalar."],
      ["İş kazası ve meslek hastalığı", "İş kazasından doğan maddi ve manevi tazminat ile rücu davaları."],
    ],
    araclar: [
      "kidem-ve-ihbar-tazminati-hesaplama",
      "fazla-mesai-ucreti-hesaplama",
      "yillik-izin-ucreti-hesaplama",
      "ubgt-ucreti-hesaplama",
      "netten-brute-brutten-nete-hesaplama",
      "is-kazasi-tazminati-hesaplama",
    ],
    icerik: `4857 sayılı İş Kanunu ve 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu, işçi ile işveren arasındaki ilişkinin ve sosyal güvenlik haklarının temelini oluşturur. İşçilik alacaklarına ilişkin davalarda ve işe iade taleplerinde, dava açılmadan önce arabulucuya başvurulması zorunludur.

İşe iade davası için fesih bildiriminin tebliğinden itibaren bir ay içinde arabulucuya başvurulmalıdır. Büromuz işçi ve işverenlere fesih sürecinin planlanmasından arabuluculuk ve dava aşamalarına kadar hukuki destek sağlar. İşçilik alacakları hakkında ön bilgi edinmek için hukuki araçlar bölümümüzdeki hesaplayıcılardan yararlanılabilir.

## Bu alanda sunulan hizmetler

- Kıdem, ihbar ve diğer işçilik alacağı davaları
- İşe iade ve arabuluculuk süreçleri
- İş sözleşmeleri ve iç yönetmeliklerin hazırlanması
- Hizmet tespiti ve SGK uyuşmazlıkları
- İş kazası ve meslek hastalığı tazminat davaları`,
  },
  {
    slug: "yabancilar-ve-vatandaslik-hukuku",
    baslik: "Yabancılar ve Vatandaşlık Hukuku",
    kategori: "bireysel",
    ozet: "Oturma ve çalışma izinleri, Türk vatandaşlığının kazanılması, sınır dışı etme ve giriş yasağı kararlarına karşı başvurular.",
    altBasliklar: [
      ["İkamet ve çalışma izni", "Kısa dönem, aile ve öğrenci ikamet izinleri ile çalışma izni başvuruları."],
      ["Vatandaşlık", "Evlilik, yatırım ve genel hükümler yoluyla Türk vatandaşlığının kazanılması."],
      ["Sınır dışı ve giriş yasağı", "Sınır dışı etme ve idari gözetim kararları ile giriş yasaklarına karşı yargı yolları."],
    ],
    araclar: [],
    icerik: `6458 sayılı Yabancılar ve Uluslararası Koruma Kanunu ile 5901 sayılı Türk Vatandaşlığı Kanunu, yabancıların Türkiye'ye girişi, ikameti, çalışması ve vatandaşlık kazanmasına ilişkin kuralları belirler. Bu alandaki idari kararlara karşı başvuru süreleri oldukça kısadır.

Büromuz yabancı gerçek kişilere ve yabancı personel istihdam eden şirketlere ikamet, çalışma izni ve vatandaşlık süreçlerinde danışmanlık verir; sınır dışı etme ve giriş yasağı kararlarına karşı yargı yollarını takip eder.

## Bu alanda sunulan hizmetler

- İkamet ve çalışma izni başvuruları
- Türk vatandaşlığı başvuruları
- Sınır dışı etme ve idari gözetim kararlarına karşı davalar
- Giriş yasağı kodlarının kaldırılmasına ilişkin başvurular`,
  },

  // ── Tazminat & Sigorta ─────────────────────────────────────────────
  {
    slug: "trafik-kazasi-hukuku",
    baslik: "Trafik Kazası Hukuku",
    kategori: "tazminat-sigorta",
    ozet: "Trafik kazalarından doğan maddi ve manevi tazminat, sürekli iş göremezlik, destekten yoksun kalma ve araç hasarı talepleri.",
    altBasliklar: [
      ["Kusur tespiti", "Kaza tespit tutanağı ve bilirkişi raporlarıyla sürücü kusurlarının belirlenmesi; itiraz süreçleri."],
      ["Yaralanmalı kazalar", "Sürekli ve geçici iş göremezlik, tedavi giderleri ve manevi tazminat talepleri."],
      ["Ölümlü kazalar", "Destekten yoksun kalma tazminatı ve cenaze giderleri."],
      ["Araç hasarı", "Değer kaybı, onarım bedeli ve araç mahrumiyeti talepleri."],
    ],
    araclar: ["trafik-kazasi-tazminati-hesaplama", "trafik-kusur-ve-ceza-rehberi"],
    icerik: `2918 sayılı Karayolları Trafik Kanunu, motorlu araç işletenlerinin ve sürücülerin kusur esasına dayanmayan sorumluluğunu ve zorunlu mali sorumluluk (trafik) sigortasını düzenler. Zarar gören kişi, tazminat talebini sigorta şirketine, Sigorta Tahkim Komisyonuna veya mahkemeye yöneltebilir; sigorta şirketine dava öncesinde yazılı başvuru yapılması gerekir.

Tazminatın hesaplanmasında kusur oranları, maluliyet oranı, kazanç kaybı ve yaşam tabloları gibi unsurlar belirleyicidir. Büromuz kaza sonrası delillerin toplanmasından sigorta başvurusuna ve dava sürecine kadar zarar görenlere hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Kaza tespit tutanağındaki kusura itiraz
- Sigorta şirketine başvuru ve Sigorta Tahkim Komisyonu süreçleri
- Maluliyet ve destekten yoksun kalma tazminatı davaları
- Araç değer kaybı ve hasar talepleri
- Trafik kazası kaynaklı ceza yargılamalarında katılan vekilliği`,
  },
  {
    slug: "malpraktis",
    baslik: "Malpraktis (Tıbbi Uygulama Hatası)",
    kategori: "tazminat-sigorta",
    ozet: "Hekim ve sağlık kuruluşlarının hatalı tıbbi uygulamalarından doğan maddi ve manevi tazminat talepleri ile ilgili ceza ve idari süreçler.",
    altBasliklar: [
      ["Özel sağlık kuruluşları", "Özel hastane ve hekimlere karşı tüketici mahkemelerinde açılan tazminat davaları."],
      ["Kamu hastaneleri", "Kamu sağlık kuruluşlarındaki uygulamalar nedeniyle idari yargıda tam yargı davaları."],
      ["Aydınlatılmış onam", "Hastanın yeterince bilgilendirilmeden yapılan müdahalelerden doğan sorumluluk."],
    ],
    araclar: [],
    icerik: `Tıbbi müdahalede hekimin, tıp biliminin kabul ettiği özen yükümlülüğüne uygun davranması ve hastayı olası riskler konusunda aydınlatması gerekir. Bu yükümlülüklere aykırılık sonucu oluşan zararlar tazminat sorumluluğuna yol açabilir.

Malpraktis uyuşmazlıklarında dava yolu, müdahalenin yapıldığı kuruluşun özel veya kamu niteliğine göre değişir; tıbbi kayıtların temini ve bilirkişi incelemesi sürecin merkezindedir. Büromuz tıbbi belgelerin değerlendirilmesinden dava sürecine kadar hastalara ve yakınlarına hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Tıbbi kayıtların temini ve ön değerlendirme
- Özel sağlık kuruluşlarına karşı tazminat davaları
- Kamu hastanelerine karşı tam yargı davaları
- Ceza soruşturmalarında şikâyetçi vekilliği`,
  },
  {
    slug: "sigorta-hukuku",
    baslik: "Sigorta Hukuku",
    kategori: "tazminat-sigorta",
    ozet: "Trafik, kasko, konut, sağlık ve hayat sigortalarından doğan tazminat talepleri ile sigorta şirketleriyle yaşanan uyuşmazlıklar.",
    altBasliklar: [
      ["Hasar ve tazminat", "Sigorta şirketine başvuru, eksik ödeme ve ret kararlarına itiraz."],
      ["Sigorta Tahkim Komisyonu", "Uyuşmazlıkların Sigorta Tahkim Komisyonu nezdinde çözümü."],
      ["Rücu davaları", "Sigorta şirketlerinin sigortalıya veya üçüncü kişilere yönelttiği rücu talepleri."],
    ],
    araclar: ["trafik-kazasi-tazminati-hesaplama", "trafik-kusur-ve-ceza-rehberi"],
    icerik: `Sigorta sözleşmeleri Türk Ticaret Kanunu'nun sigorta hukukuna ilişkin hükümleri ve 5684 sayılı Sigortacılık Kanunu ile düzenlenir. Sigorta şirketleriyle yaşanan uyuşmazlıklar mahkemede veya sigorta şirketinin üye olduğu Sigorta Tahkim Komisyonu aracılığıyla çözülebilir.

Poliçe kapsamı, istisnalar ve bildirim yükümlülükleri tazminatın ödenip ödenmeyeceğini doğrudan etkiler. Büromuz hasar dosyalarının hazırlanması, şirketle yazışmaların yürütülmesi ve uyuşmazlık hâlinde tahkim ve dava süreçlerinde hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Hasar başvurularının hazırlanması ve takibi
- Sigorta Tahkim Komisyonu başvuruları
- Sigorta şirketlerine karşı tazminat davaları
- Rücu davalarında temsil`,
  },
  {
    slug: "tazminat-hukuku",
    baslik: "Tazminat Hukuku",
    kategori: "tazminat-sigorta",
    ozet: "Haksız fiil ve sözleşmeye aykırılıktan doğan maddi ve manevi tazminat talepleri, kişilik hakkı ihlalleri ve idarenin sorumluluğu.",
    altBasliklar: [
      ["Maddi tazminat", "Mal varlığında meydana gelen azalma ve yoksun kalınan kazancın tazmini."],
      ["Manevi tazminat", "Kişilik haklarına yapılan saldırılar nedeniyle manevi zararın giderilmesi."],
      ["Bedensel zararlar", "İş göremezlik, tedavi giderleri ve destekten yoksun kalma talepleri."],
    ],
    araclar: ["trafik-kazasi-tazminati-hesaplama", "is-kazasi-tazminati-hesaplama"],
    icerik: `Türk Borçlar Kanunu, hukuka aykırı ve kusurlu bir fiille başkasına zarar veren kişinin bu zararı gidermekle yükümlü olduğunu düzenler. Tazminat taleplerinde zararın varlığı, illiyet bağı ve kusur unsurlarının ispatı ile zamanaşımı süreleri belirleyicidir.

Büromuz; trafik ve iş kazaları, tıbbi uygulama hataları, kişilik hakkı ihlalleri ve idarenin eylemlerinden doğan zararlar gibi farklı alanlarda tazminat taleplerinin hazırlanması ve takibi konusunda hukuki destek sağlar.

## Bu alanda sunulan hizmetler

- Maddi ve manevi tazminat davaları
- Kişilik hakkı ihlallerine ilişkin davalar
- Bedensel zarar ve destekten yoksun kalma tazminatı
- İdarenin sorumluluğuna dayalı tam yargı davaları`,
  },

  // ── Ceza & Bilişim ─────────────────────────────────────────────────
  {
    slug: "ceza-hukuku",
    baslik: "Ceza Hukuku",
    kategori: "ceza-bilisim",
    ozet: "Soruşturma ve kovuşturma aşamalarında şüpheli, sanık, müşteki ve katılan vekilliği ile infaz hukukuna ilişkin başvurular.",
    altBasliklar: [
      ["Soruşturma aşaması", "İfade ve sorgu süreçlerinde müdafilik, tutuklamaya ve adli kontrole itiraz."],
      ["Kovuşturma aşaması", "Ağır ceza ve asliye ceza mahkemelerinde savunma ile müşteki ve katılan vekilliği."],
      ["Kanun yolları", "İstinaf, temyiz ve yargılamanın yenilenmesi başvuruları."],
      ["İnfaz hukuku", "Koşullu salıverme, denetimli serbestlik ve infaz hâkimliği başvuruları."],
    ],
    araclar: ["infaz-yatar-hesaplama", "adliye-cezaevi-telefon-rehberi"],
    icerik: `Ceza yargılaması, kişinin özgürlüğünü doğrudan etkileyen sonuçlar doğurabilir. 5237 sayılı Türk Ceza Kanunu ve 5271 sayılı Ceza Muhakemesi Kanunu, şüpheli ve sanığa soruşturmanın her aşamasında müdafi yardımından yararlanma hakkı tanır.

Büromuz soruşturma aşamasından hükmün infazına kadar şüpheli ve sanıkların savunmasını üstlenir; suçtan zarar görenlerin müşteki ve katılan olarak haklarının korunmasını sağlar. İnfaz süreleri hakkında ön bilgi için hukuki araçlar bölümümüzdeki infaz hesaplama aracından yararlanılabilir.

## Bu alanda sunulan hizmetler

- Soruşturma aşamasında müdafilik
- Tutuklama ve adli kontrol kararlarına itiraz
- Kovuşturma aşamasında savunma ve katılan vekilliği
- İstinaf ve temyiz başvuruları
- İnfaz hâkimliği başvuruları`,
  },
  {
    slug: "bilisim-hukuku",
    baslik: "Bilişim Hukuku",
    kategori: "ceza-bilisim",
    ozet: "Kişisel verilerin korunması (KVKK), siber suçlar, internet içeriklerine erişim engeli ve e-ticaret mevzuatına ilişkin danışmanlık ve temsil.",
    altBasliklar: [
      ["Kişisel verilerin korunması (KVKK)", "6698 sayılı Kanun kapsamında aydınlatma metinleri, açık rıza süreçleri, VERBİS kaydı, veri envanteri ve veri ihlali bildirimleri; Kişisel Verileri Koruma Kurulu nezdindeki şikâyet ve inceleme süreçleri."],
      ["Siber suçlar", "Bilişim sistemine girme, sistemi engelleme ve bozma, banka ve kredi kartlarının kötüye kullanılması, nitelikli dolandırıcılık ve kişisel verilerin hukuka aykırı olarak ele geçirilmesi suçlarında soruşturma ve kovuşturma süreçleri."],
      ["İnternet içerikleri", "5651 sayılı Kanun kapsamında kişilik hakkını ihlal eden içeriklerin kaldırılması ve erişimin engellenmesi talepleri."],
      ["E-ticaret ve sözleşmeler", "Kullanım koşulları, mesafeli satış sözleşmeleri ve yazılım lisans sözleşmeleri."],
    ],
    araclar: [],
    icerik: `Bilişim hukuku; teknolojinin kullanımından doğan hukuki ilişkileri, kişisel verilerin korunmasını ve bilişim sistemleri aracılığıyla işlenen suçları kapsar. 6698 sayılı Kişisel Verilerin Korunması Kanunu, veri sorumlularına aydınlatma, veri güvenliği ve ilgili kişi başvurularını yanıtlama gibi yükümlülükler getirir; bu yükümlülüklere aykırılık idari para cezası yaptırımına bağlanmıştır.

Siber suçlar ise Türk Ceza Kanunu'nun bilişim alanında suçlara ilişkin hükümleri başta olmak üzere çeşitli düzenlemelerle yaptırıma bağlanmıştır. Büromuz şirketlere KVKK uyum süreçlerinde danışmanlık verir; siber suç mağdurlarını ve bu suçlarla itham edilen kişileri ceza yargılamasında temsil eder.

## Bu alanda sunulan hizmetler

- KVKK uyum projeleri, aydınlatma metinleri ve veri envanteri
- Veri ihlali bildirimleri ve Kurul süreçleri
- Siber suçlara ilişkin şikâyet ve savunma
- İçerik kaldırma ve erişim engeli başvuruları
- Yazılım, lisans ve e-ticaret sözleşmeleri`,
  },
];

const hedef = path.join(process.cwd(), "content", "faaliyet-alanlari");
const uzerineYaz = process.argv.includes("--uzerine-yaz");
fs.mkdirSync(hedef, { recursive: true });

const kategoriSayac = {};
let yazilan = 0;
for (const a of ALANLAR) {
  kategoriSayac[a.kategori] = (kategoriSayac[a.kategori] ?? 0) + 1;
  const dosya = path.join(hedef, `${a.slug}.mdoc`);
  if (fs.existsSync(dosya) && !uzerineYaz) continue;
  const frontmatter = {
    baslik: a.baslik,
    kategori: a.kategori,
    sira: kategoriSayac[a.kategori],
    ozet: a.ozet,
    altBasliklar: a.altBasliklar.map(([baslik, metin]) => ({ baslik, metin })),
    ilgiliAraclar: a.araclar,
  };
  fs.writeFileSync(dosya, `---\n${yaml.dump(frontmatter, { lineWidth: -1 })}---\n${a.icerik}\n`);
  yazilan++;
}
console.log(`${ALANLAR.length} faaliyet alanı; ${yazilan} dosya yazıldı.`);
