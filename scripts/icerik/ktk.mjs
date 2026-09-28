// Trafik Kusur ve Ceza Rehberi taslak içeriklerini Keystatic formatında (content/ktk/*.mdoc) üretir.
// Ceza tutarları: EGM "2026 Yılı Trafik İdari Para Ceza Rehberi" (7574 sayılı Kanun değişiklikleri sonrası).
// Kusur niteliği: 2918 sayılı KTK m.84'te sayılan asli kusur hâlleri esas alınmıştır.
// Tek seferlik kurulum betiğidir; sonraki düzenlemeler Keystatic panelinden yapılır.
// Çalıştırma: node scripts/icerik/ktk.mjs [--uzerine-yaz]

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const EGM = {
  ad: "EGM – 2026 Yılı Trafik İdari Para Ceza Rehberi",
  url: "https://www.trafik.gov.tr/kurumlar/trafik.gov.tr/trafik-para-cezasi/2026/2026-YILI-TRAFIK-IDARI-PARA-CEZA-REHBERI.pdf",
};
const KTK = { ad: "2918 sayılı Karayolları Trafik Kanunu", url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2918&MevzuatTur=1&MevzuatTertip=5" };

// [madde, grup, kusur, tutar|null, puan|null, kısa başlık, ihlal tanımı, sade anlatım, ek bilgiler]
const MADDELER = [
  // ── Işık ve işaretler ─────────────────────────────────────────────
  ["47/1-a", "isaret", "asli", 3000, 20, "Trafik görevlisinin işaretlerine uymamak",
    "Trafiği düzenleme ve denetimle görevli trafik kolluğu veya özel kıyafetli veya işaret taşıyan diğer yetkili kişilerin uyarı ve işaretlerine uymamak.",
    "Kavşakta veya yol kontrolünde trafik polisinin \"dur\", \"geç\" gibi el ve düdük işaretlerine uyulmaması bu kapsamdadır. Görevlinin işareti, ışıklı işaretlerden ve levhalardan önce gelir.",
    { ek: "Trafik görevlisinin dur işaretinde geçmek KTK m.84/a uyarınca asli kusurdur." }],
  ["47/1-b", "isaret", "asli", 5000, 20, "Kırmızı ışıkta geçmek",
    "Kırmızı ışık kuralına uymamak.",
    "Işıklı trafik işaretinde kırmızı yanarken durma çizgisini geçmek bu ihlali oluşturur. 7574 sayılı Kanun ile ceza, son bir yıl içindeki ihlal sayısına göre kademeli olarak artırılmıştır.",
    {
      ehliyet: "Son bir yıl içinde 3. ihlalde 30 gün, 4. ihlalde 60 gün, 5. ihlalde 90 gün; 6. ihlalde sürücü belgesi iptal edilir.",
      ek: "İdari para cezası son bir yıl içindeki ihlal sayısına göre: 1. defa 5.000 TL, 2. defa 10.000 TL, 3. defa 15.000 TL, 4. defa 20.000 TL, 5. defa 30.000 TL, 6. defa 80.000 TL. Kırmızı ışık ihlaliyle kazaya sebebiyet verilmesi hâlinde (m.47/5) ayrıca sürücü belgesi geri alınır.",
    }],
  ["47/1-c", "isaret", "tali", 1000, 20, "Trafik işaret levhalarına uymamak",
    "Trafik işaret levhaları, cihazları ve yer işaretlemeleri ile belirtilen veya gösterilen hususlara uymamak.",
    "Yasak, tehlike ve bilgi levhaları ile yol çizgileri gibi yer işaretlemelerinin gösterdiği kurallara uyulmaması bu kapsamdadır. Kusurun niteliği, uyulmayan işaretin içeriğine göre değişebilir.",
    { ek: "Uyulmayan işaret, KTK m.84'te sayılan bir hâle karşılık geliyorsa (ör. taşıt giremez işareti) kusur asli olarak değerlendirilebilir." }],
  ["47/1-d", "isaret", "tali", 1000, 20, "Yönetmelikteki diğer kurallara uymamak",
    "Trafik güvenliği ve düzeni ile ilgili olan ve yönetmelikte gösterilen diğer kural, yasak, zorunluluk veya yükümlülüklere uymamak.",
    "Kanunda ayrıca düzenlenmeyen, Karayolları Trafik Yönetmeliğinde yer alan kural ve yükümlülüklerin ihlali bu madde kapsamında cezalandırılır. Kaza tespit tutanaklarında sıkça işaretlenen genel bir kusur kodudur.",
    {}],

  // ── Şerit ve yön ──────────────────────────────────────────────────
  ["46/2-a", "serit", "tali", 5000, null, "Yolun sağından veya uygun şeritten gitmemek",
    "Aksine bir işaret bulunmadıkça sürücülerin, araçlarını, gidiş yönüne göre yolun sağından, çok şeritli yollarda ise yol ve trafik durumuna göre hızının gerektirdiği şeritten sürmemesi.",
    "Sürücüler kural olarak yolun sağından gitmek, çok şeritli yollarda ise hızlarına uygun şeridi kullanmak zorundadır.",
    {}],
  ["46/2-b", "serit", "asli", 5000, null, "Şerit değiştirirken geçişi beklememek",
    "Aksine bir işaret bulunmadıkça sürücülerin, şerit değiştirmeden önce gireceği şeritte sürülen araçların emniyetle geçişini beklememesi.",
    "Şerit değiştirecek sürücü, gireceği şeritteki araçların güvenle geçmesini beklemek zorundadır. Bu kurala aykırı şerit değişikliği sonucu meydana gelen kazalarda kusur çoğunlukla şerit değiştiren sürücüye verilir.",
    { ek: "Şerit izleme ve değiştirme kurallarına uymamak KTK m.84/g uyarınca asli kusurdur." }],
  ["46/2-c", "serit", "asli", 10000, null, "Tehlikeli şekilde şerit değiştirmek",
    "Aksine bir işaret bulunmadıkça sürücülerin, trafiği aksatacak veya tehlikeye düşürecek şekilde şerit değiştirmesi.",
    "Diğer araçları ani fren yapmaya veya manevra yapmaya zorlayacak biçimde şerit değiştirilmesi bu ihlali oluşturur.",
    { ek: "KTK m.84/g kapsamında asli kusur hâlidir." }],
  ["46/2-d", "serit", "tali", 5000, null, "En soldaki şeridi sürekli işgal etmek",
    "Aksine bir işaret bulunmadıkça sürücülerin, gidişe ayrılan en soldaki şeridi sürekli olarak işgal etmesi.",
    "Sol şerit geçiş amacıyla kullanılır; geçme tamamlandıktan sonra sağdaki şeride dönülmesi gerekir.",
    {}],
  ["46/2-f", "serit", "tali", null, null, "Emniyet şeridini kullanmak",
    "Aksine bir işaret bulunmadıkça sürücülerin; trafik kazası, arıza hâlleri, acil yardım, kurtarma, kar mücadelesi, kaza incelemesi, genel güvenlik ve asayişin sağlanması gibi durumlar dışında emniyet şeritlerini ve banketleri kullanmaları.",
    "Emniyet şeridi yalnızca arıza, kaza ve acil durumlar için ayrılmıştır; trafik yoğunluğunda bu şeridin kullanılması yasaktır.",
    {}],
  ["46/2-g", "serit", "asli", 90000, null, "Ardı ardına birden fazla şerit değiştirmek (makas)",
    "Aksine bir işaret bulunmadıkça sürücülerin; trafiği aksatacak veya tehlikeye sokacak şekilde ardı ardına birden fazla şerit değiştirmeleri.",
    "Uygulamada \"makas atma\" olarak bilinen davranıştır. 7574 sayılı Kanun ile yüksek idari para cezası ve sürücü belgesinin geri alınması yaptırımına bağlanmıştır.",
    { ehliyet: "Sürücü belgesi 60 gün süreyle geri alınır; tekrarında süre artar.", ek: "KTK m.84/g kapsamında asli kusur hâlidir." }],
  ["46/2-h", "serit", "asli", 10000, null, "Tek yönlü yolda ters yönde gitmek",
    "Aksine bir işaret bulunmadıkça sürücülerin tek yönlü karayollarında araçlarını ters istikamette sürmesi.",
    "Tek yönlü yola ters yönden girilmesi, taşıt giremez işaretiyle kapatılmış yola girme niteliğindedir.",
    { ek: "Taşıt giremez işaretiyle kapatılmış yola girmek KTK m.84/b uyarınca asli kusurdur. Otoyol ve şehirlerarası bölünmüş yollarda ters yönde gitmenin cezası çok daha yüksektir." }],
  ["56/1-a", "serit", "asli", 1000, 20, "Şerit izleme ve değiştirme kurallarına uymamak",
    "Şerit izleme ve değiştirme kurallarına uymamak.",
    "Sürücünün kendi şeridini izlememesi, şerit çizgilerini ihlal etmesi veya kurala aykırı şerit değiştirmesi bu kapsamdadır. Kaza tespit tutanaklarında en sık karşılaşılan asli kusur kodlarından biridir.",
    { ek: "KTK m.84/g uyarınca asli kusurdur." }],
  ["56/1-b", "serit", "tali", 1000, 15, "Dar yollarda karşılaşma kurallarına uymamak",
    "İki yönlü trafiğin kullanıldığı taşıt yollarında karşı yönden gelen araçların geçişini zorlaştıran bir durum varsa; sürücülerin geçişi kolaylaştırmak için aracını sağ kenara yanaştırmaması, gerektiğinde sağa yanaşıp durmaması; dağlık ve dik yokuşlu yollarda inen aracın çıkan araca geçiş kolaylığı sağlamaması.",
    "Dar veya dik yokuşlu yollarda karşılaşan araçlardan, yönetmelikte belirtilen sürücünün diğerine geçiş kolaylığı sağlaması gerekir.",
    {}],
  ["56/1-d", "serit", "tali", 1000, 10, "Gereksiz yavaş gitmek veya ani yavaşlamak",
    "Araçlarını zorunlu bir neden olmadıkça, diğer araçların ilerleyişine engel olacak şekilde veya işaretle belirtilen hız sınırının çok altında sürmek, gereksiz ani yavaşlamak.",
    "Trafik akışını engelleyecek derecede yavaş gitmek veya arkadaki araçları tehlikeye sokacak şekilde sebepsiz ani fren yapmak bu ihlali oluşturur.",
    {}],

  // ── Hız ve takip mesafesi ─────────────────────────────────────────
  ["51/2", "hiz", "tali", null, null, "Hız sınırlarını aşmak",
    "Yerleşim yeri içinde ve dışında belirlenen hız sınırlarını aşmak (aşım miktarına göre kademeli).",
    "Hız sınırı aşımında ceza, aşım miktarına ve yerleşim yeri içi/dışı ayrımına göre kademeli olarak belirlenir; yüksek aşımlarda sürücü belgesi geri alınır. Güncel kademeler için resmî ceza rehberine bakınız.",
    { ek: "Hız sınırının aşılması tek başına KTK m.84'te sayılan asli kusur hâllerinden değildir; ancak kazanın oluşumundaki etkisine göre kusur oranı artabilir." }],
  ["52/1-a", "hiz", "tali", 1246, null, "Riskli noktalarda hızı azaltmamak",
    "Aracın hızını, kavşaklara yaklaşırken, dönemeçlere girerken, tepe üstlerine yaklaşırken, dönemeçli yollarda ilerlerken, yaya geçitlerine, hemzemin geçitlere, tünellere, dar köprü ve menfezlere yaklaşırken, yapım ve onarım alanlarına girerken azaltmamak.",
    "Hız sınırı içinde kalınsa bile kavşak, viraj ve yaya geçidi gibi noktalara yaklaşırken hızın azaltılması gerekir.",
    {}],
  ["52/1-b", "hiz", "tali", 1246, null, "Hızı şartlara uydurmamak",
    "Aracının hızını, aracın yük ve teknik özelliğine, görüş, yol, hava ve trafik durumunun gerektirdiği şartlara uydurmamak.",
    "Yağmur, kar, sis veya yoğun trafik gibi koşullarda hız sınırının altında da olsa güvenli sürüşe uygun hızda gidilmemesi bu ihlali oluşturur. Kaza tespit tutanaklarında sık rastlanan tali kusur kodudur.",
    {}],
  ["52/1-c", "hiz", "asli", 1246, null, "Güvenli takip mesafesi bırakmamak",
    "Diğer bir aracı izlerken, hızını kullandığı aracın yük ve teknik özelliğine, görüş, yol, hava ve trafik durumunun gerektirdiği şartlara uydurmadan yönetmelikte belirlenen güvenli mesafeyi bırakmamak.",
    "Öndeki aracın ani durması hâlinde çarpmadan durabilecek mesafenin bırakılmaması bu ihlali oluşturur. Arkadan çarpmalı kazalarda sıkça uygulanır.",
    { ek: "Arkadan çarpma KTK m.84/d uyarınca asli kusur hâlidir." }],
  ["56/1-c", "hiz", "asli", 5000, 20, "Yakın takip",
    "Önlerinde giden araçları yönetmelikte belirtilen güvenli ve yeterli bir mesafeden izlememek (yakın takip).",
    "Öndeki araca tehlikeli şekilde yaklaşarak takip etmek, 7574 sayılı Kanun ile daha ağır cezaya bağlanmıştır.",
    { ek: "Arkadan çarpmalı kazalarda KTK m.84/d uyarınca asli kusur olarak değerlendirilir." }],
  ["52/1-d", "hiz", "tali", 1246, null, "Konvoyda araçlar arası açıklık bırakmamak",
    "Kol ve grup hâlinde araç kullanırken, araçlar arasında yönetmelikte belirtilen esaslara uygun olarak diğer araçların güvenle girebilecekleri açıklığı bırakmamak.",
    "Konvoy hâlinde gidilirken, geçmek isteyen araçların güvenle araya girebileceği mesafenin bırakılması gerekir.",
    {}],

  // ── Geçme ─────────────────────────────────────────────────────────
  ["54/1-a", "gecme", "asli", 2719, 20, "Geçme kurallarına uymamak",
    "Öndeki aracı geçerken geçme kurallarına riayet etmemek.",
    "Geçmeden önce yolun yeterli mesafede açık olduğundan emin olmamak, işaret vermemek veya geçtiği aracın önüne tehlikeli şekilde girmek bu kapsamdadır.",
    { ek: "Geçme, doğrultu değiştirme manevrası niteliğinde olduğundan kural dışı geçmeler uygulamada çoğunlukla asli kusur olarak değerlendirilir (KTK m.84/f)." }],
  ["54/1-b", "gecme", "asli", 2719, 20, "Geçmenin yasak olduğu yerde geçmek",
    "Geçmenin yasak olduğu yerlerde önündeki aracı geçmek.",
    "Devamlı yol çizgisi, geçme yasağı levhası, virajlar, tepe üstleri, kavşaklar ve yaya geçitleri gibi geçmenin yasak olduğu yerlerde öndeki aracın geçilmesi bu ihlali oluşturur.",
    { ek: "KTK m.84/e uyarınca asli kusurdur." }],
  ["55/1-a", "gecme", "tali", 1000, null, "Geçilecek aracın sürücüsünün kolaylık sağlamaması",
    "Geçilmek istenen araç sürücüsünün; duyulur veya görülür bir geçiş işareti alınca, iki yönlü yollarda taşıt yolunun sağ kenarından gitmemesi, çok şeritli veya bölünmüş yollarda bulunduğu şeridi izlememesi ve hızını artırması.",
    "Geçilmek istenen sürücünün, geçişi zorlaştıracak şekilde hızını artırması veya yolun ortasına doğru kayması yasaktır.",
    {}],
  ["55/1-b", "gecme", "tali", 1000, null, "Yavaş aracın geçişe yer açmaması",
    "Geçilmek istenen araç sürücüsünün; dar taşıt yolları ile trafiğin yoğun olduğu yollarda yavaş gitme nedeniyle kendisini geçmek için izleyen araçların kolayca ve güvenli geçmelerini sağlamak için aracını elverdiği oranda sağ kenara almaması, yavaşlamaması, gerektiğinde durmaması.",
    "Yavaş giden araçların arkadan gelenlere güvenli geçiş imkânı tanıması gerekir.",
    {}],

  // ── Kavşak ve geçiş önceliği ──────────────────────────────────────
  ["53/1-a", "kavsak", "asli", 1246, null, "Sağa dönüş kurallarına uymamak",
    "Sağa dönüş kurallarına riayet etmemek.",
    "Sağa dönüş yapacak sürücünün dönüşten önce sağ şeride geçmesi, işaret vermesi ve dönüşü yolun sağ kenarına yakın yapması gerekir.",
    { ek: "Doğrultu değiştirme manevralarını yanlış yapmak KTK m.84/f uyarınca asli kusurdur." }],
  ["53/1-b", "kavsak", "asli", 1246, null, "Sola dönüş kurallarına uymamak",
    "Sola dönüş kurallarına riayet etmemek.",
    "Sola dönüş yapacak sürücünün uygun şeride geçmesi, işaret vermesi ve karşıdan gelen trafiğe ilk geçiş hakkını tanıması gerekir.",
    { ek: "KTK m.84/f uyarınca asli kusur hâlidir." }],
  ["53/1-c", "kavsak", "asli", 1246, null, "Dönel kavşakta dönüş kurallarına uymamak",
    "Dönel kavşaklarda dönüş kurallarına riayet etmemek.",
    "Dönel kavşaklarda (göbekli kavşaklar) şerit ve çıkış kurallarına uyulmaması bu ihlali oluşturur.",
    { ek: "KTK m.84/f uyarınca asli kusur hâlidir." }],
  ["53/1-d", "kavsak", "asli", 1246, null, "Dönel kavşakta geriye dönüş kurallarına uymamak",
    "Dönel kavşaklarda geriye dönüş kurallarına riayet etmemek.",
    "Dönel kavşaklarda geri dönüş manevrasının kurallara aykırı yapılması bu kapsamdadır.",
    { ek: "KTK m.84/f uyarınca asli kusur hâlidir." }],
  ["53/2-c", "kavsak", "asli", 1246, 20, "Sola dönüşte karşıdan gelenlere yol vermemek",
    "Sürücülerin, sola dönüşlerde sağdan ve karşıdan gelen trafiğe ilk geçiş hakkını vermemesi.",
    "Sola dönen sürücü, karşı yönden düz gelen ve sağdan gelen araçlara ilk geçiş hakkını tanımak zorundadır.",
    { ek: "Kavşaklarda geçiş önceliğine uymamak KTK m.84/h uyarınca asli kusurdur." }],
  ["57/1-a", "kavsak", "asli", 5000, 20, "Kavşakta geçiş önceliğine uymamak",
    "Kavşaklara yaklaşırken kavşaktaki şartlara uyacak şekilde yavaşlamamak, dikkatli olmamak, geçiş hakkı olan araçlara ilk geçiş hakkını vermemek.",
    "Kavşağa yaklaşan sürücü yavaşlamak ve geçiş hakkı olan araçlara öncelik tanımak zorundadır. 7574 sayılı Kanun ile cezası artırılmıştır.",
    { ek: "KTK m.84/h uyarınca asli kusurdur." }],
  ["57/1-b", "kavsak", "asli", 5000, null, "Tali yoldan ana yola çıkarken yol vermemek",
    "Işıklı trafik işareti veya yetkili görevli bulunmayan kavşaklarda; yol ver veya dur işaretli yoldan gelenlerin, tali yoldan ana yola çıkanların, dönel kavşağa girenlerin ve bir mülkten yola çıkanların geçiş hakkı olan araçlara ilk geçiş hakkını vermemesi.",
    "Kavşaktaki işaretlere göre geçiş hakkı olan araçlara öncelik tanınmaması bu ihlali oluşturur. Örneğin dönel kavşağa giren araç, kavşak içindeki araca yol vermek zorundadır.",
    { ek: "KTK m.84/h uyarınca asli kusurdur." }],
  ["57/1-c", "kavsak", "asli", 5000, null, "Sağdan gelene yol vermemek",
    "Kavşak kollarının trafik yoğunluğu bakımından farklı oldukları işaretlerle belirlenmemiş kavşaklarda; motorsuz araç sürücülerinin motorlu araçlara, motorlu araçlardan soldaki aracın sağdan gelen araca geçiş hakkını vermemesi.",
    "İşaretsiz eş değer kavşaklarda \"sağdan gelen önceliklidir\" kuralı uygulanır.",
    { ek: "KTK m.84/h uyarınca asli kusurdur." }],
  ["57/1-d", "kavsak", "tali", 1000, 20, "Kavşağı tıkayacak şekilde kavşağa girmek",
    "Işıklı trafik işaretleri izin verse bile trafik akımı kendisini kavşak içinde durmaya zorlayacak veya diğer doğrultudaki trafiğin geçişine engel olacak hâllerde kavşağa girmek.",
    "Yeşil ışık yansa bile kavşak çıkışı tıkalıysa kavşağa girilmemesi gerekir.",
    {}],
  ["57/1-e", "kavsak", "tali", 1000, 20, "Kavşakta gereksiz durmak veya yavaşlamak",
    "Kavşaklarda gereksiz olarak duraklamak, yavaşlamak, taşıttan inmek veya araçların motorunu durdurmak.",
    "Kavşak alanında trafiği engelleyecek şekilde durulması veya araçtan inilmesi yasaktır.",
    {}],
  ["57/1-f", "kavsak", "asli", 5000, null, "Raylı taşıtlara yol vermemek",
    "Aksine bir işaret olmadıkça, bütün kavşaklarda araçların ray üzerinde hareket eden taşıtlara ilk geçiş hakkını vermemesi.",
    "Tramvay gibi raylı sistem araçlarının kavşaklarda ilk geçiş hakkı vardır.",
    { ek: "KTK m.84/h uyarınca asli kusur hâlidir." }],

  // ── Yaya ve bisiklet ──────────────────────────────────────────────
  ["53/2-a", "yaya", "asli", 1246, null, "Dönüşte yayalara ilk geçiş hakkı vermemek",
    "Sağa ve sola dönüşlerde sürücülerin, kurallara uygun olarak geçiş yapan yayalara ilk geçiş hakkını vermemesi.",
    "Dönüş yapan sürücü, girdiği yolda kurallara uygun şekilde karşıya geçmekte olan yayalara öncelik tanımak zorundadır.",
    { ek: "Yayaya çarpmalı kazalarda sürücünün kusuru, yayanın da kurallara uyup uymadığı dikkate alınarak belirlenir." }],
  ["53/2-b", "yaya", "asli", 1246, null, "Dönüşte bisiklet ve skuter kullananlara yol vermemek",
    "Sağa ve sola dönüşlerde sürücülerin, varsa bisiklet yolundaki ve bisiklet şeridindeki bisiklet ve elektrikli skuter kullananlara ilk geçiş hakkını vermemesi.",
    "Dönüş yapan motorlu araç sürücüsü, bisiklet yolundaki bisiklet ve elektrikli skuterlere öncelik tanımak zorundadır.",
    {}],

  // ── Duraklama ve park ─────────────────────────────────────────────
  ["58", "duraklama", "tali", 1246, null, "İndirme-bindirmeyi yolun sağından yapmamak",
    "İndirme-bindirme sırasında sürücülerin; aksine bir işaret bulunmadıkça araçlarını gidiş yönlerine göre yolun en sağ kenarında durdurmaması, yolcularının iniş ve binişlerini sağ taraftan yaptırmaması ve yolcuların da iniş ve binişlerini sağ taraftan yapmaması.",
    "Yolcu indirme ve bindirme, yolun en sağında ve aracın sağ tarafından yapılmalıdır.",
    {}],
  ["59", "duraklama", "tali", 1246, null, "Yerleşim yeri dışında kurala aykırı durmak",
    "Yerleşim birimleri dışındaki karayolunda, zorunlu hâller dışında duraklamak veya park etmek, zorunlu hâllerde gerekli önlemleri almadan duraklamak veya park etmek.",
    "Şehirlerarası yollarda zorunluluk olmadan durulması veya arıza gibi zorunlu hâllerde reflektör, dörtlü flaşör gibi önlemler alınmadan beklenmesi bu ihlali oluşturur.",
    { ek: "Gerekli önlemler alınmadan yolda bırakılan araca çarpılan kazalarda, duran aracın sürücüsüne de kusur verilebilir." }],
  ["60/1-a", "duraklama", "tali", 1246, null, "Duraklamanın yasak olduğu yerde duraklamak",
    "Taşıt yolu üzerinde duraklamanın yasaklandığının bir trafik işareti ile belirtilmiş olduğu yerlerde duraklamak.",
    "Duraklama yasağı levhası bulunan yerlerde kısa süreli de olsa durulması yasaktır.",
    {}],
  ["61/1-a", "duraklama", "tali", 1246, null, "Duraklamanın yasak olduğu yere park etmek",
    "Taşıt yolu üzerinde duraklamanın yasaklandığı yerlere park etmek.",
    "Duraklamanın yasak olduğu her yerde park etmek de yasaktır.",
    { ek: "Park etmiş taşıtlara çarpmak KTK m.84/j uyarınca çarpan sürücü bakımından asli kusurdur." }],

  // ── Diğer kurallar ────────────────────────────────────────────────
  ["67/1-a", "diger", "asli", 2719, 20, "Manevralarda tehlikeli davranmak",
    "Park yapmış taşıtlar arasından çıkarken, duraklarken veya park yaparken taşıt yolunun sağına veya soluna yanaşırken, sağa veya sola dönerken, karayolunu kullananlar için tehlike doğurabilecek ve bunların hareketlerini zorlaştıracak şekilde davranmak.",
    "Park yerinden çıkarken veya yanaşırken diğer araçları tehlikeye sokacak şekilde manevra yapılması bu kapsamdadır.",
    { ek: "Manevraları düzenleyen genel şartlara uymamak KTK m.84/i uyarınca asli kusurdur." }],
  ["67/1-b", "diger", "asli", 2719, 20, "Kurala aykırı geri dönmek veya geri gitmek",
    "Yönetmelikte belirtilen şartlar dışında geriye dönmek veya geriye gitmek, izin verilen hâllerde bu manevraları yaparken karayolunu kullananlar için tehlike veya engel yaratmak.",
    "İzin verilmeyen yerlerde U dönüşü yapmak veya geri geri gitmek bu ihlali oluşturur.",
    { ek: "İzin verilmeyen yerlerde geriye dönme veya geri gitme KTK m.84/c uyarınca asli kusurdur." }],
  ["67/1-c", "diger", "asli", 2719, 20, "Dönüşte sinyal vermemek",
    "Dönüşlerde veya şerit değiştirmelerde niyetini dönüş işaret ışıkları veya kol işareti ile açıkça ve yeterli şekilde belirtmemek, işaretlere manevra süresince devam etmemek ve biter bitmez sona erdirmemek.",
    "Dönüş ve şerit değiştirme niyetinin sinyalle zamanında belirtilmemesi bu ihlali oluşturur.",
    { ek: "KTK m.84/i kapsamında asli kusur olarak değerlendirilir." }],
  ["30/1-a", "diger", "tali", 1246, 20, "Fren, lastik veya ışıkları bozuk araç kullanmak",
    "Servis freni, lastikleri, dış ışık donanımından yakını ve uzağı gösteren ışıklar ile park, fren ve dönüş ışıkları noksan, bozuk veya teknik şartlara aykırı olan araçları kullanmak.",
    "Aracın güvenli sürüş için gerekli donanımlarının eksik veya bozuk olması hâlinde uygulanır.",
    { men: "Eksiklikleri giderilinceye kadar araç trafikten men edilebilir." }],
  ["30/1-b", "diger", "tali", 2719, 20, "Tehlikeli çıkıntı, duman veya gürültü yapan araç kullanmak",
    "Tehlike doğuracak şekilde çıkıntıları olan, karayolunu kullananlar için tehlike yaratacak şekilde olan veya görüşü engelleyecek ve çevredekileri rahatsız edecek derecede duman veya gürültü çıkaran araçları kullanmak.",
    "Aracın dış yapısındaki tehlikeli çıkıntılar veya aşırı egzoz dumanı ve gürültü bu kapsamda değerlendirilir.",
    { men: "Eksiklikleri giderilinceye kadar araç trafikten men edilebilir." }],
  ["46/3", "diger", "tali", 3000, null, "Hayvan sürülerini kurala aykırı götürmek",
    "Karayollarının belirli kesimlerinde ve zorunluluk olması hâlinde, hayvanlarını veya hayvan sürülerini gidiş yönüne göre yolun en sağından ve en az genişlik işgal ederek ve imkân olduğunda taşıt yolu dışından götürmemek.",
    "Hayvan sürüsünü karayolunda götürenlerin yolun en sağını kullanması ve trafiği mümkün olduğunca az etkilemesi gerekir. Ceza hayvan sürücülerine uygulanır.",
    {}],
  ["69/1", "diger", "tali", 1246, null, "Yolda hayvan bulundurmak veya başıboş bırakmak",
    "Yerleşim yerleri dışındaki karayollarında, taşıt yolu üzerinde zorunlu hâller dışında hayvan bulundurmak, binek hayvanları ve sürüler ile elle sürülen araçları trafik kurallarına uymadan sevk ve idare etmek veya ettirmek, başıboş bırakmak.",
    "Karayoluna başıboş hayvan bırakılması yasaktır. Başıboş hayvanın sebep olduğu kazalarda hayvan sahibinin de sorumluluğu doğabilir (m.69/2).",
    {}],
];

const hedef = path.join(process.cwd(), "content", "ktk");
const uzerineYaz = process.argv.includes("--uzerine-yaz");
fs.mkdirSync(hedef, { recursive: true });

const slugla = (m) => "ktk-" + m.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

let yazilan = 0;
for (const [madde, grup, kusur, tutar, puan, baslik, kanunMetni, ozet, ek] of MADDELER) {
  const dosya = path.join(hedef, `${slugla(madde)}.mdoc`);
  if (fs.existsSync(dosya) && !uzerineYaz) continue;

  const fm = {
    madde,
    baslik,
    grup,
    kanunMetni,
    ozet,
    kusurTuru: kusur,
    ...(tutar !== null && { cezaTutari: tutar }),
    ...(puan !== null && { cezaPuani: puan }),
    ehliyetElKoyma: ek.ehliyet ?? "",
    aracMen: ek.men ?? "",
    ekYaptirim: ek.ek ?? "",
    kaynaklar: [EGM, KTK],
    guncelleme: "2026-09-28",
  };

  const kusurParagrafi =
    kusur === "asli"
      ? `Bu ihlal, 2918 sayılı Kanun'un 84. maddesinde sayılan **asli kusur** hâllerinden birine karşılık gelir. Asli kusur, kazanın meydana gelmesinde belirleyici kabul edilen kusurdur; asli kusurlu sürücünün kusur oranı, kural olarak tali kusurlu sürücüden daha yüksek belirlenir.`
      : `Bu ihlal, 2918 sayılı Kanun'un 84. maddesinde sayılan asli kusur hâlleri arasında yer almadığından kural olarak **tali kusur** olarak değerlendirilir. Tali kusur, kazanın oluşumuna katkı sağlayan ancak belirleyici olmayan kusurdur.`;

  const govde = `## Kusur değerlendirmesi

${kusurParagrafi}

Kaza sonrası kusur oranları; kaza tespit tutanağı, kamera kayıtları, tanık beyanları ve gerektiğinde bilirkişi raporu dikkate alınarak belirlenir. Tutanaktaki kusur tespitine, Sigorta Bilgi ve Gözetim Merkezi (SBM) üzerinden veya dava sürecinde itiraz edilebilir.

## İdari para cezasına itiraz

İdari para cezasına, tebliğ veya öğrenme tarihinden itibaren **15 gün** içinde sulh ceza hâkimliğine başvurularak itiraz edilebilir. Ceza, tebliğden itibaren **15 gün** içinde ödenirse dörtte bir oranında (%25) indirim uygulanır; peşin ödeme itiraz hakkını ortadan kaldırmaz (5326 sayılı Kabahatler Kanunu m.17/6).
`;
  fs.writeFileSync(dosya, `---\n${yaml.dump(fm, { lineWidth: -1 })}---\n${govde}`);
  yazilan++;
}
console.log(`${MADDELER.length} KTK maddesi; ${yazilan} dosya yazıldı.`);
