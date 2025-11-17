// Shapes.tsx
"use client";

import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber"; // Importa useThree
import { Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import gsap from "gsap";

export default function Shapes() {
  return (
    // Il contenitore HTML rimane invariato (absolute, z-index, ecc.)
    <div className="absolute inset-0 z-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        // Camera che guarda dritta (0,0,10) verso il piano Z=0
        camera={{ position: [0, 0, 10], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          
          {/* Motore fisico con gravità normale */}
          <Physics gravity={[0, -9.81, 0]}>
            <Geometries />
            
            {/* Contenitori invisibili */}
            <Floor />
            <Walls />
            
          </Physics>

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// --- PAVIMENTO INVISIBILE DINAMICO ---
function Floor() {
  const { viewport } = useThree();
  // 🛑 CORREZIONE: Posiziona il pavimento al bordo inferiore esatto del viewport
  // (Il tuo / 4 lo metteva troppo in alto)
  const yPosition = -viewport.height / 4;

  return (
    <RigidBody type="fixed" position={[0, yPosition, 0]}>
      {/* Un box largo quanto il viewport, alto 0.1, profondo 10 */}
      <CuboidCollider args={[viewport.width, 0.1, 10]} />
    </RigidBody>
  );
}

// --- MURI LATERALI INVISIBILI ---
function Walls() {
  const { viewport } = useThree();
  const wallWidth = 0.1;
  const xPosition = viewport.width / 2;

  return (
    <>
      {/* Muro Sinistro */}
      <RigidBody type="fixed" position={[-xPosition, 0, 0]}>
        <CuboidCollider args={[wallWidth, viewport.height, 10]} />
      </RigidBody>
      {/* Muro Destro */}
      <RigidBody type="fixed" position={[xPosition, 0, 0]}>
        <CuboidCollider args={[wallWidth, viewport.height, 10]} />
      </RigidBody>
    </>
  );
}

// --- GEOMETRIE ---
function Geometries() {
  // ✅ USA useThree per ottenere la larghezza dello schermo in pixel
  const { size } = useThree();
  // Definiamo "mobile" come qualsiasi schermo più piccolo di 768px (breakpoint 'md' di Tailwind)
  const isMobile = size.width < 768;

  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1.5), // Gem
    new THREE.CapsuleGeometry(0.5, 1.0, 2, 16), // Pill
    new THREE.DodecahedronGeometry(1.0), // Soccer ball
    new THREE.TorusGeometry(0.6, 0.25, 16, 32), // Donut
    new THREE.OctahedronGeometry(1.0), // Diamond
  ], []);

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0, metalness: 0.5, opacity: 0.8, transparent: true }),
  ], []);

  const shapes = useMemo(() => {
    // ✅ Logica responsive
    const count = isMobile ? 10 : 17; // Meno forme su mobile
    const scaleRange = isMobile ? [0.2, 0.4] : [0.4, 0.6]; // Scala più piccola su mobile

    return Array.from({ length: count }, () => ({ // Usa 'count'
      geometry: gsap.utils.random(geometries),
      material: gsap.utils.random(materials),
      position: [
        gsap.utils.random(-5, 5), // X casuale
        gsap.utils.random(10, 20), // Y (Sopra lo schermo)
        0, // <-- FORZA Z=0 (Nessuna profondità)
      ] as [number, number, number],
      scale: gsap.utils.random(scaleRange[0], scaleRange[1]), // Usa 'scaleRange'
    }));
  }, [isMobile, geometries, materials]); // ✅ Aggiungi 'isMobile' alle dipendenze

  return (
    <>
      {shapes.map((shape, index) => (
        <PhysicsShape
          key={index}
          geometry={shape.geometry}
          material={shape.material}
          position={shape.position}
          scale={shape.scale}
        />
      ))}
    </>
  );
}

// --- PROPS PER PHYSICSSHARE (con tipi) ---
type PhysicsShapeProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  scale: number;
};

// --- COMPONENTE FISICO (con blocchi Z) ---
function PhysicsShape({
  geometry,
  material,
  position,
  scale,
}: PhysicsShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<RapierRigidBody>(null!);
  const restitution = 0.3; // Rimbalzo leggero

  return (
    <RigidBody
      ref={bodyRef}
      colliders="hull" // Hitbox precisa
      position={position}
      scale={scale}
      restitution={restitution}
      angularDamping={0.8} // Rallenta la rotazione
      linearDamping={1} // Resistenza dell'aria
      
      // ✅ BLOCCHI PER FISICA 2D
      enabledTranslations={[true, true, false]} // Permetti X, Y. Blocca Z.
      enabledRotations={[false, false, true]} // Permetti solo rotazione Z (come un foglio di carta).
    >
      <mesh ref={meshRef} geometry={geometry} material={material} castShadow />
    </RigidBody>
  );
}