"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Ad Soyad zorunludur.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Geçerli bir e-posta giriniz.";
    if (!formData.message.trim()) newErrors.message = "Mesaj alanı zorunludur.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="pt-64 min-h-screen bg-background">
      <div className="container mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-16"
        >
          <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-tight mb-8">Hukuki sürecinizi konuşalım.</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Adres</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Söğütözü, Çankaya<br />
                Ankara, Türkiye
              </p>
            </div>
            
            <div>
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">İletişim</h2>
              <a href="tel:+903120000000" className="block font-serif text-2xl hover:text-accent transition-colors mb-2">0 (312) 000 00 00</a>
              <a href="mailto:info@akispartners.com" className="block font-serif text-2xl hover:text-accent transition-colors">info@akispartners.com</a>
            </div>

            <div>
              <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-4">Çalışma Saatleri</h2>
              <p className="font-serif text-2xl leading-relaxed">
                Pazartesi – Cuma<br />
                09:00 – 18:00
              </p>
            </div>

            <div className="relative w-full h-[300px] border border-border bg-surface flex items-center justify-center overflow-hidden">
              {/* Map placeholder */}
              <div className="font-sans text-xs tracking-widest uppercase opacity-50 absolute z-10">Harita Yükleniyor...</div>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground via-background to-background" />
            </div>
          </div>

          <div className="lg:col-span-7">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface p-12 flex flex-col items-center justify-center text-center h-full border border-border"
              >
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-4xl mb-4">Mesajınız Alındı</h3>
                <p className="font-sans opacity-70 mb-8 max-w-md">
                  Talebiniz ekibimize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <button 
                  onClick={() => { setIsSuccess(false); setFormData({name: "", email: "", phone: "", subject: "", message: ""}) }}
                  className="font-sans text-xs uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
                >
                  Yeni Mesaj Gönder <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs tracking-widest uppercase opacity-70">Ad Soyad *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl"
                  />
                  {errors.name && <span className="text-red-500 text-xs font-sans mt-1">{errors.name}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs tracking-widest uppercase opacity-70">E-Posta *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl"
                    />
                    {errors.email && <span className="text-red-500 text-xs font-sans mt-1">{errors.email}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs tracking-widest uppercase opacity-70">Telefon</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs tracking-widest uppercase opacity-70">Konu</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs tracking-widest uppercase opacity-70">Mesajınız *</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="bg-transparent border-b border-border py-4 outline-none focus:border-accent transition-colors font-serif text-xl resize-none"
                  />
                  {errors.message && <span className="text-red-500 text-xs font-sans mt-1">{errors.message}</span>}
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-foreground text-background px-12 py-5 font-sans text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
