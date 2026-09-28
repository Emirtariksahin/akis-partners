"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

const gold = "#C9A55C";
const darkGold = "#B5934F";
const navy = "#0B1B33";

const goldMat = <meshStandardMaterial color={gold} metalness={0.85} roughness={0.15} />;
const darkGoldMat = <meshStandardMaterial color={darkGold} metalness={0.9} roughness={0.2} />;
const navyMat = <meshStandardMaterial color={navy} metalness={0.7} roughness={0.3} />;

function Pan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.42, 0.08, 32]} />
        {goldMat}
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.48, 0.025, 12, 48]} />
        {darkGoldMat}
      </mesh>
    </group>
  );
}

function ChainLink({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.04, 0.012, 8, 16]} />
      {goldMat}
    </mesh>
  );
}

/* ─── Adalet Terazisi (Scales of Justice) ─── */
function ScalesOfJustice() {
  const group = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Group>(null);
  const leftChainRef = useRef<THREE.Group>(null);
  const rightChainRef = useRef<THREE.Group>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gold = "#C9A55C";
  const darkGold = "#A8863A";
  const navy = isDark ? "#1A2D4A" : "#0B1B33";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 5) * 0.15;
    }
    if (beamRef.current) {
      beamRef.current.rotation.z = Math.sin(t / 2.5) * 0.06;
    }
    if (leftChainRef.current) {
      leftChainRef.current.position.y = Math.sin(t / 2.5) * 0.08;
    }
    if (rightChainRef.current) {
      rightChainRef.current.position.y = -Math.sin(t / 2.5) * 0.08;
    }
  });

  const goldMat = (
    <meshStandardMaterial color={gold} metalness={0.85} roughness={0.15} />
  );
  const darkGoldMat = (
    <meshStandardMaterial color={darkGold} metalness={0.9} roughness={0.2} />
  );
  const navyMat = (
    <meshStandardMaterial color={navy} metalness={0.7} roughness={0.3} />
  );

  return (
    <group ref={group} scale={0.85} position={[0, 0.8, 0]}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        {/* Taban */}
        <mesh position={[0, -2.2, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 0.15, 6]} />
          {navyMat}
        </mesh>
        <mesh position={[0, -2.1, 0]}>
          <cylinderGeometry args={[0.35, 0.6, 0.1, 6]} />
          {goldMat}
        </mesh>

        {/* Merkez Sütun */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 2.6, 16]} />
          {goldMat}
        </mesh>

        {/* Dekoratif halkalar */}
        <mesh position={[0, -1.6, 0]}>
          <torusGeometry args={[0.12, 0.025, 8, 24]} />
          {darkGoldMat}
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 24]} />
          {darkGoldMat}
        </mesh>

        {/* Tepe süsü */}
        <mesh position={[0, 0.65, 0]}>
          <octahedronGeometry args={[0.15]} />
          {goldMat}
        </mesh>

        {/* Kiriş Grubu */}
        <group ref={beamRef} position={[0, 0.45, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.06, 0.06]} />
            {goldMat}
          </mesh>

          <mesh position={[-1.6, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            {darkGoldMat}
          </mesh>
          <mesh position={[1.6, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            {darkGoldMat}
          </mesh>

          {/* Sol Zincir + Kefe */}
          <group ref={leftChainRef} position={[-1.6, 0, 0]}>
            <ChainLink y={-0.12} />
            <ChainLink y={-0.24} />
            <ChainLink y={-0.36} />
            <ChainLink y={-0.48} />
            <ChainLink y={-0.60} />
            <Pan position={[0, -0.72, 0]} />
          </group>

          {/* Sağ Zincir + Kefe */}
          <group ref={rightChainRef} position={[1.6, 0, 0]}>
            <ChainLink y={-0.12} />
            <ChainLink y={-0.24} />
            <ChainLink y={-0.36} />
            <ChainLink y={-0.48} />
            <ChainLink y={-0.60} />
            <Pan position={[0, -0.72, 0]} />
          </group>
        </group>
      </Float>
    </group>
  );
}

/* ─── HeroScene Export ─── */
export function HeroScene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Canvas
      camera={{ position: [0, -0.2, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={isDark ? 0.5 : 0.8} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={isDark ? 1.5 : 2}
        color="#C9A55C"
      />
      <directionalLight
        position={[-4, 4, 3]}
        intensity={isDark ? 0.6 : 1}
        color="#ffffff"
      />
      <pointLight position={[0, -3, 3]} intensity={0.4} color="#C9A55C" />

      <ScalesOfJustice />

      <ContactShadows
        position={[0, -2.8, 0]}
        opacity={0.25}
        scale={6}
        blur={2}
        far={3}
        frames={1}
      />
    </Canvas>
  );
}
