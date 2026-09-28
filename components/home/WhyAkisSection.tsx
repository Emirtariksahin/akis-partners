"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

const REASONS = [
  { id: "01", title: "Stratejik Yaklaşım", desc: "Yalnızca mevcut durumu değil, sürecin olası sonraki aşamalarını da birlikte değerlendiriyoruz." },
  { id: "02", title: "Şeffaf İletişim", desc: "Karmaşık hukuki jargonu net, anlaşılır ve eyleme geçirilebilir bilgiye dönüştürüyoruz." },
  { id: "03", title: "Disiplinler Arası Bakış", desc: "Ticari gerçeklikleri ve sektör dinamiklerini hukuki analizle harmanlıyoruz." },
  { id: "04", title: "Düzenli Bilgilendirme", desc: "Dosyanın her aşamasında müvekkilimizi gelişmeler ve seçenekler hakkında düzenli olarak bilgilendiriyoruz." },
];

/* ─── Tokmak + Halkalar (Canvas İÇİNDE render edilir) ─── */
function Gavel({ isDark }: { isDark: boolean }) {
  const gavelRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const gold = "#C9A55C";
  const darkGold = "#A8863A";
  const navy = isDark ? "#1A2D4A" : "#0B1B33";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gavelRef.current) {
      gavelRef.current.rotation.y = Math.sin(t / 4) * 0.2;
      gavelRef.current.rotation.x = Math.sin(t / 3) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.15;
      ringRef.current.rotation.y = t * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.2;
      ring2Ref.current.rotation.z = t * 0.12;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      {/* ─── Tokmak Grubu ─── */}
      <group ref={gavelRef} rotation={[0.2, 0.3, -0.5]}>
        {/* Tokmak başı (Head) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.55, 0.55]} />
          <meshStandardMaterial color={navy} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Altın bantlar */}
        <mesh position={[-0.62, 0, 0]}>
          <boxGeometry args={[0.06, 0.58, 0.58]} />
          <meshStandardMaterial color={gold} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.62, 0, 0]}>
          <boxGeometry args={[0.06, 0.58, 0.58]} />
          <meshStandardMaterial color={gold} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Orta dekoratif bant */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.57, 0.57]} />
          <meshStandardMaterial color={darkGold} metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Sap (Handle) */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 1.0, 16]} />
          <meshStandardMaterial color={navy} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Sap halka dekorları */}
        <mesh position={[0, -0.28, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 24]} />
          <meshStandardMaterial color={gold} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 24]} />
          <meshStandardMaterial color={gold} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Sap uç süsü */}
        <mesh position={[0, -1.22, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={gold} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* ─── Orbital Altın Halkalar ─── */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.015, 16, 80]} />
        <meshStandardMaterial color={gold} metalness={1} roughness={0.1} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.1, 0.01, 16, 80]} />
        <meshStandardMaterial color={darkGold} metalness={1} roughness={0.15} transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

/* ─── GavelScene — Canvas sarmalayıcı ─── */
function GavelScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gold = "#C9A55C";

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
    >
      <ambientLight intensity={isDark ? 0.5 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.2 : 1.8} color={gold} />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#ffffff" />
      <pointLight position={[2, 3, -2]} intensity={0.4} color={gold} />

      <Gavel isDark={isDark} />
    </Canvas>
  );
}

function ReasonItem({ reason, index, total, scrollYProgress }: { reason: (typeof REASONS)[number], index: number, total: number, scrollYProgress: MotionValue<number> }) {
  const start = index * 0.25;
  const end = start + 0.25;
  
  const inStart = index === 0 ? 0 : start - 0.05;
  const inEnd = start + 0.05;
  const outStart = end - 0.1;
  const outEnd = index === total - 1 ? 1 : end;

  const opacity = useTransform(scrollYProgress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [inStart, inEnd, outStart, outEnd], [50, 0, 0, -50]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute top-24 w-full"
    >
      <span className="font-sans text-xs tracking-widest opacity-50 block mb-4">— {reason.id}</span>
      <h3 className="font-serif text-[clamp(2rem,3vw,3rem)] leading-[1.1] tracking-tight mb-6">
        {reason.title}
      </h3>
      <p className="font-sans text-sm md:text-base opacity-70 leading-relaxed">
        {reason.desc}
      </p>
    </motion.div>
  );
}

/* ─── WhyAkisSection Export ─── */
export function WhyAkisSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 md:p-24 z-10">
          <div className="max-w-md w-full relative h-[400px]">
            <h2 className="font-sans text-xs tracking-widest uppercase text-accent mb-12 absolute top-0">Neden Akış Partners?</h2>
            
            {REASONS.map((reason, index) => (
              <ReasonItem 
                key={reason.id}
                reason={reason}
                index={index}
                total={REASONS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Right Side: 3D Scene */}
        <div className="w-full lg:w-1/2 h-full absolute lg:relative top-0 right-0 opacity-20 lg:opacity-100 pointer-events-none">
          <div className="absolute inset-0 z-0">
            <GavelScene />
          </div>
          <motion.div 
            className="absolute inset-0 z-10 bg-gradient-to-l from-transparent to-background lg:w-1/4"
          />
        </div>
        
      </div>
    </section>
  );
}
