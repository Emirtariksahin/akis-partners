// Hesaplama sayfalarında gösterilen açıklama, mevzuat dayanağı ve sık sorulan sorular.

export type AracMeta = { aciklama: string; dayanak: string[]; sss: { soru: string; cevap: string }[] };

export const ARAC_META: Record<string, AracMeta> = {
  "kidem-ve-ihbar-tazminati-hesaplama": {
    aciklama:
      "Kıdem tazminatı, en az bir yıl çalışmış işçinin iş sözleşmesinin kanunda sayılan hâllerde sona ermesi durumunda, her tam yıl için 30 günlük giydirilmiş brüt ücret tutarında ödenir. İhbar tazminatı ise bildirim sürelerine uyulmadan yapılan fesihlerde, bu sürelere ilişkin ücret tutarında ödenir.",
    dayanak: ["1475 sayılı İş Kanunu m.14", "4857 sayılı İş Kanunu m.17", "193 sayılı Gelir Vergisi Kanunu m.25/7"],
    sss: [
      {
        soru: "İstifa eden işçi kıdem tazminatı alabilir mi?",
        cevap: "Kural olarak hayır. Ancak haklı nedenle fesih, emeklilik, askerlik ve evlilik sonrası bir yıl içinde kadın işçinin ayrılması gibi hâllerde istifa eden işçi de kıdem tazminatına hak kazanır.",
      },
      {
        soru: "Kıdem tazminatı tavanı nedir?",
        cevap: "Kıdem tazminatının yıllık tutarı, en yüksek devlet memuruna ödenen emeklilik ikramiyesini geçemez. Tavan her altı ayda bir güncellenir ve çıkış tarihindeki tavan uygulanır.",
      },
    ],
  },
  "yillik-izin-ucreti-hesaplama": {
    aciklama:
      "İşyerinde en az bir yıl çalışmış işçiler yıllık ücretli izne hak kazanır. İzin süresi hizmet süresine ve yaşa göre değişir; iş sözleşmesi sona erdiğinde kullanılmayan izin günlerinin ücreti son ücret üzerinden ödenir.",
    dayanak: ["4857 sayılı İş Kanunu m.53-59", "657 sayılı Devlet Memurları Kanunu m.102"],
    sss: [
      {
        soru: "Kullanılmayan izin ücreti ne zaman talep edilir?",
        cevap: "İş sözleşmesinin herhangi bir nedenle sona ermesi hâlinde talep edilebilir. Zamanaşımı süresi sözleşmenin sona erdiği tarihten itibaren başlar.",
      },
    ],
  },
  "fazla-mesai-ucreti-hesaplama": {
    aciklama:
      "Haftalık 45 saati aşan çalışmalar fazla çalışmadır ve her bir saat için normal saat ücretinin %50 fazlası ödenir. Saat ücreti, aylık brüt ücretin 225'e bölünmesiyle bulunur.",
    dayanak: ["4857 sayılı İş Kanunu m.41", "İş Kanununa İlişkin Fazla Çalışma ve Fazla Sürelerle Çalışma Yönetmeliği"],
    sss: [
      {
        soru: "Fazla mesai yerine serbest zaman kullanılabilir mi?",
        cevap: "Evet. İşçi isterse fazla çalıştığı her saat karşılığında 1 saat 30 dakika serbest zaman kullanabilir.",
      },
    ],
  },
  "ubgt-ucreti-hesaplama": {
    aciklama:
      "Ulusal bayram ve genel tatil günlerinde çalışmayan işçiye o günün ücreti tam olarak ödenir. Tatil gününde çalışan işçiye ise ayrıca, çalıştığı her gün için bir günlük ilave ücret ödenir.",
    dayanak: ["4857 sayılı İş Kanunu m.44 ve 47", "2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun"],
    sss: [
      {
        soru: "Hangi günler ulusal bayram ve genel tatildir?",
        cevap: "1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim (28 Ekim yarım gün) ile Ramazan ve Kurban Bayramı günleridir.",
      },
    ],
  },
  "netten-brute-brutten-nete-hesaplama": {
    aciklama:
      "Brüt ücretten SGK primi, işsizlik sigortası primi, gelir vergisi ve damga vergisi düşülerek net ücrete ulaşılır. Asgari ücrete isabet eden gelir ve damga vergisi istisna edildiğinden, vergi yükü yalnızca asgari ücreti aşan kısım için oluşur.",
    dayanak: ["193 sayılı Gelir Vergisi Kanunu m.23/18 ve m.103", "488 sayılı Damga Vergisi Kanunu", "5510 sayılı Kanun m.81-82"],
    sss: [
      {
        soru: "Net maaşım neden yıl içinde azalıyor?",
        cevap: "Gelir vergisi yıl başından itibaren kümülatif matraha göre hesaplanır. Kümülatif matrah bir üst dilime geçtiğinde vergi oranı artar ve net ücret azalır.",
      },
    ],
  },
  "kira-artis-orani-hesaplama": {
    aciklama:
      "Konut ve çatılı işyeri kiralarında yenilenen kira dönemlerinde uygulanacak artış, bir önceki kira yılında tüketici fiyat endeksinin on iki aylık ortalamalara göre değişim oranını geçemez. Bu oran her ay TÜİK tarafından açıklanır.",
    dayanak: ["6098 sayılı Türk Borçlar Kanunu m.344", "TÜİK Tüketici Fiyat Endeksi bültenleri"],
    sss: [
      {
        soru: "Kira artışında hangi ayın oranı uygulanır?",
        cevap: "Kira sözleşmesinin yenilendiği ay için açıklanan (bir önceki aya ait) TÜFE on iki aylık ortalama değişim oranı uygulanır.",
      },
      {
        soru: "İşyeri kiralarında farklı bir oran var mı?",
        cevap: "Hayır. Çatılı işyeri kiralarında da aynı TÜFE sınırı uygulanır.",
      },
    ],
  },
  "mahkeme-harc-ve-gider-hesaplama": {
    aciklama:
      "Dava açılırken başvurma harcı, peşin karar ve ilam harcı ile gider avansı yatırılır. Konusu para olan davalarda karar ve ilam harcı dava değeri üzerinden nispi olarak hesaplanır ve dörtte biri peşin alınır.",
    dayanak: ["492 sayılı Harçlar Kanunu ve (1) sayılı tarife", "6100 sayılı HMK m.120", "HMK Gider Avansı Tarifesi"],
    sss: [
      {
        soru: "Gider avansı yatırılmazsa ne olur?",
        cevap: "Mahkeme eksik gider avansının tamamlanması için süre verir; süre içinde tamamlanmazsa dava usulden reddedilebilir.",
      },
    ],
  },
  "islah-harci-hesaplama": {
    aciklama:
      "Islah ile talep sonucu artırıldığında, artırılan miktar üzerinden nispi karar ve ilam harcının dörtte biri peşin olarak tamamlanır.",
    dayanak: ["6100 sayılı HMK m.176-182", "492 sayılı Harçlar Kanunu"],
    sss: [
      {
        soru: "Islah kaç kez yapılabilir?",
        cevap: "Aynı davada taraflardan her biri ancak bir kez ıslah yoluna başvurabilir ve ıslah tahkikat sona erinceye kadar yapılabilir.",
      },
    ],
  },
  "vekalet-ucreti-hesaplama": {
    aciklama:
      "Yargılama sonunda haklı çıkan taraf lehine, karşı taraf aleyhine Avukatlık Asgari Ücret Tarifesine göre vekalet ücretine hükmedilir. Konusu para olan davalarda ücret kademeli oranlarla hesaplanır ve yargı yerine göre belirlenen maktu ücretten az olamaz.",
    dayanak: ["1136 sayılı Avukatlık Kanunu m.164 ve 168", "Avukatlık Asgari Ücret Tarifesi (RG 04.11.2025/33067)"],
    sss: [
      {
        soru: "Karşı taraf vekalet ücreti kime aittir?",
        cevap: "Avukatlık Kanunu m.164 uyarınca yargılama sonunda karşı tarafa yükletilen vekalet ücreti avukata aittir.",
      },
    ],
  },
  "arabuluculuk-ucreti-hesaplama": {
    aciklama:
      "Arabulucu ücreti, uyuşmazlığın türüne, taraf sayısına, anlaşma sağlanıp sağlanmadığına ve anlaşma bedeline göre Arabuluculuk Asgari Ücret Tarifesi uyarınca belirlenir.",
    dayanak: ["6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu", "2026 Yılı Arabuluculuk Asgari Ücret Tarifesi (RG 26.12.2025/33119)"],
    sss: [
      {
        soru: "Hangi uyuşmazlıklarda arabuluculuk zorunludur?",
        cevap: "İşçi-işveren, ticari alacak, tüketici, kira, komşu hakkı, kat mülkiyeti ve ortaklığın giderilmesi uyuşmazlıklarının önemli bir kısmında dava açmadan önce arabulucuya başvurmak zorunludur.",
      },
    ],
  },
  "infaz-yatar-hesaplama": {
    aciklama:
      "Hapis cezasının ne kadarının cezaevinde geçirileceği; suçun türüne göre belirlenen koşullu salıverme oranına, denetimli serbestlik süresine, mahsup edilecek sürelere ve tekerrür durumuna göre değişir.",
    dayanak: ["5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun m.105/A, 107, 108", "5275 sayılı Kanun geçici maddeleri"],
    sss: [
      {
        soru: "Denetimli serbestlik nedir?",
        cevap: "Koşullu salıverilme tarihine belirli bir süre kalan ve açık cezaevinde iyi hâlli olan hükümlünün, cezasının kalan kısmını cezaevi dışında denetim altında geçirmesidir.",
      },
    ],
  },
  "trafik-kazasi-tazminati-hesaplama": {
    aciklama:
      "Trafik kazası sonucu sürekli iş göremezliğe uğrayan kişinin maddi zararı; gelirine, yaşına, bakiye ömrüne, maluliyet oranına ve kusur durumuna göre aktüeryal yöntemle hesaplanır.",
    dayanak: ["2918 sayılı Karayolları Trafik Kanunu m.85 ve 90-92", "6098 sayılı Türk Borçlar Kanunu m.54-55", "Karayolları Motorlu Araçlar Zorunlu Mali Sorumluluk Sigortası Genel Şartları"],
    sss: [
      {
        soru: "Sigorta şirketine başvurmadan dava açılabilir mi?",
        cevap: "Zorunlu mali sorumluluk sigortasına karşı dava açılmadan önce sigorta şirketine yazılı başvuru yapılması gerekir.",
      },
    ],
  },
  "is-kazasi-tazminati-hesaplama": {
    aciklama:
      "İş kazası sonucu sürekli iş göremezliğe uğrayan işçinin maddi zararı, işverenin kusuru oranında tazmin edilir. SGK tarafından bağlanan gelirin peşin sermaye değeri tazminattan düşülür.",
    dayanak: ["6331 sayılı İş Sağlığı ve Güvenliği Kanunu", "5510 sayılı Kanun m.13 ve 21", "6098 sayılı Türk Borçlar Kanunu m.417"],
    sss: [
      {
        soru: "İş kazası tazminatı davası hangi mahkemede açılır?",
        cevap: "İş kazasından doğan tazminat davaları iş mahkemesinde açılır ve dava öncesinde arabuluculuğa başvurulması zorunlu değildir.",
      },
    ],
  },
};
