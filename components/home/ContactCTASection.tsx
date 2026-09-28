"use client";

import { motion } from "motion/react";
import { MagneticButton } from "../ui/MagneticButton";

export function ContactCTASection() {
  return (
    <section className="relative py-48 overflow-hidden bg-foreground text-background">
      {/* Abstract Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px]" />
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-0 right-0 w-[500px] h-[500px] border-[1px] border-white/5 rounded-full"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] border-[1px] border-white/5 rounded-full -translate-x-1/4 translate-y-1/4"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] tracking-tight mb-8 max-w-3xl mx-auto">
            Hukuki belirsizliği <br />
            birlikte <span className="italic text-accent">netleştirelim.</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-sans text-sm md:text-base opacity-70 max-w-md mx-auto mb-12"
        >
          Görüşme talebiniz için bizimle iletişime geçebilirsiniz. Başvurunuz değerlendirilerek size en kısa sürede dönüş yapılır.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <MagneticButton href="/iletisim" variant="primary" showArrow>
            Görüşme Talep Et
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
