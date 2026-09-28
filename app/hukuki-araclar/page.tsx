"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator } from "lucide-react";

export default function LegalToolsPage() {
  const [activeTab, setActiveTab] = useState("kidem");
  
  // Severance Calculator State
  const [brutMaas, setBrutMaas] = useState("");
  const [giris, setGiris] = useState("");
  const [cikis, setCikis] = useState("");
  const [kidemResult, setKidemResult] = useState<number | null>(null);

  // Fee Calculator State
  const [davaDegeri, setDavaDegeri] = useState("");
  const [harcResult, setHarcResult] = useState<number | null>(null);

  const calculateKidem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brutMaas || !giris || !cikis) return;
    
    const d1 = new Date(giris);
    const d2 = new Date(cikis);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    const years = timeDiff / (1000 * 3600 * 24 * 365.25);
    
    const maas = parseFloat(brutMaas);
    if (isNaN(maas) || years < 1) {
      setKidemResult(0);
      return;
    }
    
    // Simplistic calculation: Brut Salary * Years
    setKidemResult(Math.floor(maas * years));
  };

  const calculateHarc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!davaDegeri) return;
    
    const deger = parseFloat(davaDegeri);
    if (isNaN(deger)) return;
    
    // Simplistic prototype formula (Nispi harç: binde 68.31, peşin 1/4 alınır vs)
    // Here we use a generic placeholder formula (e.g. %1.7)
    setHarcResult(Math.floor(deger * 0.0170775));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);
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
          <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none tracking-tight mb-8">Hukuki Araçlar</h1>
          <p className="font-sans text-lg leading-relaxed opacity-80 border-l-2 border-accent pl-6 py-2">
            Hukuki süreçlerinize ilişkin ön fikir edinmeniz için tasarlanmış basit hesaplama araçları.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/4">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveTab("kidem")}
                className={`text-left font-sans text-xs uppercase tracking-widest py-4 px-6 border-l-2 transition-all ${activeTab === "kidem" ? "border-accent text-accent bg-surface/50" : "border-border opacity-50 hover:opacity-100"}`}
              >
                Kıdem Tazminatı
              </button>
              <button 
                onClick={() => setActiveTab("harc")}
                className={`text-left font-sans text-xs uppercase tracking-widest py-4 px-6 border-l-2 transition-all ${activeTab === "harc" ? "border-accent text-accent bg-surface/50" : "border-border opacity-50 hover:opacity-100"}`}
              >
                Dava Harcı (Nispi)
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              {activeTab === "kidem" && (
                <motion.div 
                  key="kidem"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-surface p-8 md:p-12 border border-border"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Calculator className="text-accent w-6 h-6" />
                    <h2 className="font-serif text-3xl">Kıdem Tazminatı Hesaplama</h2>
                  </div>
                  
                  <form onSubmit={calculateKidem} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs tracking-widest uppercase opacity-70">Brüt Maaş (TL)</label>
                      <input 
                        type="number" 
                        value={brutMaas}
                        onChange={(e) => setBrutMaas(e.target.value)}
                        className="bg-background border border-border px-4 py-3 outline-none focus:border-accent transition-colors font-sans"
                        placeholder="Örn: 30000"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs tracking-widest uppercase opacity-70">İşe Giriş Tarihi</label>
                      <input 
                        type="date" 
                        value={giris}
                        onChange={(e) => setGiris(e.target.value)}
                        className="bg-background border border-border px-4 py-3 outline-none focus:border-accent transition-colors font-sans"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs tracking-widest uppercase opacity-70">İşten Çıkış Tarihi</label>
                      <input 
                        type="date" 
                        value={cikis}
                        onChange={(e) => setCikis(e.target.value)}
                        className="bg-background border border-border px-4 py-3 outline-none focus:border-accent transition-colors font-sans"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full bg-foreground text-background py-3 font-sans text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                        Hesapla
                      </button>
                    </div>
                  </form>

                  {kidemResult !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background p-6 border border-accent/30 text-center"
                    >
                      <div className="font-sans text-xs tracking-widest uppercase opacity-70 mb-2">Tahmini Kıdem Tazminatı Tutarı</div>
                      <div className="font-serif text-4xl text-accent">{formatCurrency(kidemResult)}</div>
                    </motion.div>
                  )}
                  
                  <p className="mt-8 font-sans text-xs opacity-50 italic">
                    * Bu hesaplama yalnızca yaklaşık bilgilendirme amacı taşır. Hukuki görüş niteliğinde değildir. Net tutar için bordro kalemleri ve fesih nedenleri detaylıca incelenmelidir.
                  </p>
                </motion.div>
              )}

              {activeTab === "harc" && (
                <motion.div 
                  key="harc"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-surface p-8 md:p-12 border border-border"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Calculator className="text-accent w-6 h-6" />
                    <h2 className="font-serif text-3xl">Dava Harcı (Peşin) Hesaplama</h2>
                  </div>
                  
                  <form onSubmit={calculateHarc} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs tracking-widest uppercase opacity-70">Dava Müddeabihi / Değeri (TL)</label>
                      <input 
                        type="number" 
                        value={davaDegeri}
                        onChange={(e) => setDavaDegeri(e.target.value)}
                        className="bg-background border border-border px-4 py-3 outline-none focus:border-accent transition-colors font-sans"
                        placeholder="Örn: 500000"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="w-full bg-foreground text-background py-3 font-sans text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors">
                        Hesapla
                      </button>
                    </div>
                  </form>

                  {harcResult !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background p-6 border border-accent/30 text-center"
                    >
                      <div className="font-sans text-xs tracking-widest uppercase opacity-70 mb-2">Tahmini Peşin Harç Tutarı (1/4)</div>
                      <div className="font-serif text-4xl text-accent">{formatCurrency(harcResult)}</div>
                    </motion.div>
                  )}

                  <p className="mt-8 font-sans text-xs opacity-50 italic">
                    * Bu formül basit prototip amaçlıdır. Dava türüne, mahkemesine ve harçlar kanunundaki güncel tarifelere göre değişiklik gösterebilir. Hukuki görüş niteliğinde değildir.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
