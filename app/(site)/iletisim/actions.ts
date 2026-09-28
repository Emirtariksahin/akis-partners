"use server";

import { z } from "zod";
import { Resend } from "resend";

export type IletisimDurumu = {
  durum: "bos" | "basarili" | "hata";
  mesaj?: string;
  hatalar?: Partial<Record<"ad" | "eposta" | "telefon" | "konu" | "mesaj" | "kvkk", string>>;
  degerler?: Record<string, string>;
};

const sema = z.object({
  ad: z.string().trim().min(2, "Ad soyad zorunludur.").max(120),
  eposta: z.email("Geçerli bir e-posta adresi giriniz.").max(200),
  telefon: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[+0-9 ()-]{7,}$/.test(v), "Geçerli bir telefon numarası giriniz."),
  konu: z.string().trim().max(200),
  mesaj: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalıdır.").max(5000),
  kvkk: z.literal("on", { error: "Devam etmek için aydınlatma metnini okuduğunuzu onaylayınız." }),
});

// Botların formu anında doldurmasına karşı: formun açılmasından gönderime kadar geçmesi gereken asgari süre.
const ASGARI_SURE_MS = 3000;

function htmlKacis(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function iletisimFormuGonder(_onceki: IletisimDurumu, formData: FormData): Promise<IletisimDurumu> {
  const ham = Object.fromEntries(
    ["ad", "eposta", "telefon", "konu", "mesaj", "kvkk", "website", "baslangic"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const degerler = { ad: ham.ad, eposta: ham.eposta, telefon: ham.telefon, konu: ham.konu, mesaj: ham.mesaj };

  // Honeypot dolu ya da form çok hızlı gönderildiyse sessizce başarılı dön (bot'a ipucu verme).
  const baslangic = Number(ham.baslangic);
  if (ham.website || !baslangic || Date.now() - baslangic < ASGARI_SURE_MS) {
    return { durum: "basarili" };
  }

  const sonuc = sema.safeParse(ham);
  if (!sonuc.success) {
    const hatalar: IletisimDurumu["hatalar"] = {};
    for (const issue of sonuc.error.issues) {
      const alan = issue.path[0] as keyof NonNullable<IletisimDurumu["hatalar"]>;
      hatalar[alan] ??= issue.message;
    }
    return { durum: "hata", hatalar, degerler };
  }

  const { ad, eposta, telefon, konu, mesaj } = sonuc.data;
  const apiKey = process.env.RESEND_API_KEY;
  const alici = process.env.CONTACT_TO;
  const gonderen = process.env.CONTACT_FROM;

  if (!apiKey || !alici || !gonderen) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[iletisim] RESEND_API_KEY tanımlı değil; mesaj yalnızca konsola yazıldı:", { ad, eposta, telefon, konu });
      return { durum: "basarili" };
    }
    return {
      durum: "hata",
      mesaj: "Form şu anda kullanılamıyor. Lütfen bize e-posta veya telefonla ulaşın.",
      degerler,
    };
  }

  const satirlar = [
    ["Ad soyad", ad],
    ["E-posta", eposta],
    ["Telefon", telefon || "-"],
    ["Konu", konu || "-"],
  ];

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: gonderen,
      to: alici,
      replyTo: eposta,
      subject: `Web sitesi iletişim formu: ${konu || ad}`,
      text: `${satirlar.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${mesaj}`,
      html: `<table>${satirlar
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${htmlKacis(v)}</td></tr>`)
        .join("")}</table><p style="white-space:pre-wrap">${htmlKacis(mesaj)}</p>`,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[iletisim] e-posta gönderilemedi", e);
    return {
      durum: "hata",
      mesaj: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin veya bize e-posta ile ulaşın.",
      degerler,
    };
  }

  return { durum: "basarili" };
}
