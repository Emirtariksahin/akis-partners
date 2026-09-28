"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { iletisimFormuGonder, type IletisimDurumu } from "@/app/(site)/iletisim/actions";

const alanSinifi =
  "bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl w-full";
const etiketSinifi = "font-sans text-xs tracking-widest uppercase opacity-70";

function Hata({ metin }: { metin?: string }) {
  return metin ? <span className="text-red-600 dark:text-red-400 text-xs font-sans mt-1">{metin}</span> : null;
}

export function ContactForm() {
  const [durum, gonder, bekliyor] = useActionState<IletisimDurumu, FormData>(iletisimFormuGonder, { durum: "bos" });
  // "Yeni mesaj" ile kapatılan başarı durumu; form yeniden anahtarlanarak sıfırlanır.
  const [kapatilan, setKapatilan] = useState<IletisimDurumu | null>(null);
  const [formAnahtari, setFormAnahtari] = useState(0);
  // Süre kontrolü için formun açıldığı an. React form eylemi sonrası alanları sıfırladığı için
  // gizli alan yerine ref'te tutulur ve gönderim anında FormData'ya eklenir.
  const acilis = useRef(0);
  useEffect(() => {
    acilis.current = Date.now();
  }, [formAnahtari]);
  const gonderimle = (fd: FormData) => {
    fd.set("baslangic", String(acilis.current));
    gonder(fd);
  };

  if (durum.durum === "basarili" && durum !== kapatilan) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-12 flex flex-col items-center justify-center text-center h-full border border-border"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-4xl mb-4">Mesajınız alındı</h2>
        <p className="font-sans opacity-70 mb-8 max-w-md">Talebiniz büromuza ulaştı. En kısa sürede sizinle iletişime geçeceğiz.</p>
        <button
          onClick={() => {
            setKapatilan(durum);
            setFormAnahtari((k) => k + 1);
          }}
          className="font-sans text-xs uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
        >
          Yeni mesaj gönder <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  const d: Record<string, string> = durum.durum === "hata" ? durum.degerler ?? {} : {};
  const h = durum.durum === "hata" ? durum.hatalar ?? {} : {};

  return (
    <form key={formAnahtari} action={gonderimle} className="flex flex-col gap-8" noValidate data-no-attribution>
      {/* Bot tuzağı: gerçek kullanıcılar bu alanı görmez */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ad" className={etiketSinifi}>Ad Soyad *</label>
        <input id="ad" name="ad" type="text" autoComplete="name" required defaultValue={d.ad} className={alanSinifi} aria-invalid={!!h.ad} />
        <Hata metin={h.ad} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="eposta" className={etiketSinifi}>E-posta *</label>
          <input id="eposta" name="eposta" type="email" autoComplete="email" required defaultValue={d.eposta} className={alanSinifi} aria-invalid={!!h.eposta} />
          <Hata metin={h.eposta} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="telefon" className={etiketSinifi}>Telefon</label>
          <input id="telefon" name="telefon" type="tel" autoComplete="tel" defaultValue={d.telefon} className={alanSinifi} aria-invalid={!!h.telefon} />
          <Hata metin={h.telefon} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="konu" className={etiketSinifi}>Konu</label>
        <input id="konu" name="konu" type="text" defaultValue={d.konu} className={alanSinifi} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mesaj" className={etiketSinifi}>Mesajınız *</label>
        <textarea id="mesaj" name="mesaj" rows={5} required defaultValue={d.mesaj} className={`${alanSinifi} resize-none`} aria-invalid={!!h.mesaj} />
        <Hata metin={h.mesaj} />
        <p className="font-sans text-xs opacity-55 mt-1">
          Lütfen sağlık, ceza mahkûmiyeti gibi özel nitelikli kişisel verilerinizi bu form aracılığıyla paylaşmayınız.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 font-sans text-sm cursor-pointer">
          <input type="checkbox" name="kvkk" required className="mt-1 w-4 h-4 accent-[var(--accent)]" />
          <span className="opacity-80">
            <Link href="/kvkk-aydinlatma-metni" target="_blank" className="text-accent underline underline-offset-4">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum; iletişim talebimin yanıtlanması amacıyla kişisel verilerimin işlenmesi hakkında bilgilendirildim.
          </span>
        </label>
        <Hata metin={h.kvkk} />
      </div>

      {durum.durum === "hata" && durum.mesaj && (
        <p role="alert" className="font-sans text-sm text-red-600 dark:text-red-400 border border-red-600/30 p-4">
          {durum.mesaj}
        </p>
      )}

      <p className="font-sans text-xs opacity-55">
        Form aracılığıyla bilgi iletilmesi avukat–müvekkil ilişkisi kurulduğu anlamına gelmez.
      </p>

      <div>
        <button
          type="submit"
          disabled={bekliyor}
          className="bg-foreground text-background px-12 py-5 font-sans text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {bekliyor ? "Gönderiliyor..." : "Mesajı Gönder"}
        </button>
      </div>
    </form>
  );
}
