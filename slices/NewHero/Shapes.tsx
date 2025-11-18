"use client";

import * as THREE from "three";
import { Canvas, useThree, useFrame, ThreeEvent } from "@react-three/fiber";
// Rimosso Environment per evitare errori di rete
// import { Environment } from "@react-three/drei"; 
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import gsap from "gsap";
import { Environment } from "@react-three/drei";

export default function Shapes() {
  return (
    <div className="absolute inset-0 z-0 md:touch-none pointer-events-auto">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          
          {/* Mantengo la tua gravità standard */}
          <Physics gravity={[0, -9.81, 0]}>
            <Geometries />
            <Floor />
            <Walls />
          </Physics>

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Floor() {
  const { viewport } = useThree();
  // Mantengo la tua modifica del pavimento
  const yPosition = -viewport.height / 4; 

  return (
    <RigidBody type="fixed" position={[0, yPosition, 0]}>
      <CuboidCollider args={[viewport.width, 0.1, 10]} />
    </RigidBody>
  );
}

function Walls() {
  const { viewport } = useThree();
  const wallWidth = 0.1;
  const xPosition = viewport.width / 2;
  const wallHeight = viewport.height * 2; 

  return (
    <>
      <RigidBody type="fixed" position={[-xPosition, 0, 0]}>
        <CuboidCollider args={[wallWidth, wallHeight, 10]} />
      </RigidBody>
      <RigidBody type="fixed" position={[xPosition, 0, 0]}>
        <CuboidCollider args={[wallWidth, wallHeight, 10]} />
      </RigidBody>
    </>
  );
}

// Struttura dati per le forme
type ShapeData = {
    id: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: [number, number, number];
    scale: number;
};

function Geometries() {
  const { size, viewport } = useThree(); 
  
  const md_breakpoint = 768;
  const lg_breakpoint = 1024;

  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1.5), 
    new THREE.CapsuleGeometry(0.5, 1.0, 2, 16),
    new THREE.DodecahedronGeometry(1.0),
    new THREE.TorusGeometry(0.6, 0.25, 16, 32), 
    new THREE.OctahedronGeometry(1.0), 
  ], []);

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1, opacity: 0.8, transparent: true }),
    new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0, metalness: 0.5, opacity: 0.8, transparent: true }),
  ], []);

  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const nextIdRef = useRef(0);

  const createShape = (isNewSpawn: boolean, scaleRange: [number, number]): ShapeData => {
      nextIdRef.current += 1;
      
      return {
        id: nextIdRef.current,
        geometry: gsap.utils.random(geometries),
        material: gsap.utils.random(materials),
        position: [
            // X casuale
            gsap.utils.random(-viewport.width / 2 + 1, viewport.width / 2 - 1), 
            // Y: 🛑 CORREZIONE QUI PER L'ANIMAZIONE INIZIALE
            // Se è newSpawn (timer), cade da appena sopra (+5).
            // Se è l'init (false), le distribuiamo MOLTO in alto (fino a +20) così ci mettono un po' ad arrivare.
            isNewSpawn 
                ? viewport.height / 2 + 5 
                : gsap.utils.random(viewport.height / 2 + 2, viewport.height / 2 + 15), 
            0, 
        ] as [number, number, number],
        scale: gsap.utils.random(scaleRange[0], scaleRange[1]),
      };
  };

  useEffect(() => {
    let count: number;
    let scaleRange: [number, number];

    if (size.width < md_breakpoint) {
        count = 6; 
        scaleRange = [0.2, 0.4]; 
    } else if (size.width < lg_breakpoint) {
        count = 8;
        scaleRange = [0.3, 0.5]; 
    } else {
        count = 17; 
        scaleRange = [0.4, 0.6]; 
    }

    // ---------------------------------------------------
    // 🛑 MODIFICA: Ritardo iniziale configurabile
    // ---------------------------------------------------
    const START_DELAY = 3000; // ms (1.5 secondi di ritardo)

    const timeout = setTimeout(() => {
        const initialShapes = Array.from({ length: count }, () => createShape(false, scaleRange));
        setShapes(initialShapes);
    }, START_DELAY);

    // Ciclo Infinito ogni 5 secondi
    const interval = setInterval(() => {
        setShapes((prevShapes) => {
             // Se non ci sono ancora forme (stiamo aspettando il delay), non fare nulla
             if (prevShapes.length === 0) return prevShapes;

             const newShapes = [...prevShapes];
             newShapes.shift();
             newShapes.push(createShape(true, scaleRange));
             return newShapes;
        });
    }, 5000); 

    return () => {
        clearTimeout(timeout);
        clearInterval(interval);
    };
  }, [size.width, viewport.width, viewport.height]);

  return (
    <>
      {shapes.map((shape) => (
        <PhysicsShape
          key={shape.id} 
          geometry={shape.geometry}
          material={shape.material}
          position={shape.position}
          scale={shape.scale}
        />
      ))}
    </>
  );
}

type PhysicsShapeProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  scale: number;
};

function PhysicsShape({
  geometry,
  material,
  position,
  scale,
}: PhysicsShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<RapierRigidBody>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const { viewport, size } = useThree(); 
  const isDesktop = size.width >= 768;

  useFrame(({ pointer }) => {
    if (isDesktop && isDragging && bodyRef.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      bodyRef.current.setNextKinematicTranslation({ x, y, z: 0 });
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isDesktop) return;
    
    e.stopPropagation();
    const target = e.nativeEvent.target as HTMLElement;
    if (target && target.setPointerCapture) {
       try {
         target.setPointerCapture(e.pointerId);
       } catch (err) {}
    }

    document.body.style.cursor = "grabbing";
    
    // 2 = KinematicPosition
    bodyRef.current?.setBodyType(2 as any, true);
    bodyRef.current?.wakeUp();
    
    setIsDragging(true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDesktop) return;

    e.stopPropagation();
    const target = e.nativeEvent.target as HTMLElement;
    if (target && target.releasePointerCapture) {
        try {
            target.releasePointerCapture(e.pointerId);
        } catch (err) {}
    }
    
    document.body.style.cursor = "auto";
    
    // 0 = Dynamic
    bodyRef.current?.setBodyType(0 as any, true);
    
    setIsDragging(false);
  };

  const restitution = 0.4; 

  return (
    <RigidBody
      ref={bodyRef}
      colliders="hull" 
      position={position}
      scale={scale}
      restitution={restitution}
      angularDamping={0.8} 
      linearDamping={1} 
      enabledTranslations={[true, true, false]} 
      enabledRotations={[false, false, true]} 
    >
      <mesh 
        ref={meshRef} 
        geometry={geometry} 
        material={material} 
        castShadow 
        onPointerDown={isDesktop ? handlePointerDown : undefined}
        onPointerUp={isDesktop ? handlePointerUp : undefined}
        onPointerOver={isDesktop ? () => { if(!isDragging) document.body.style.cursor = "grab"; } : undefined}
        onPointerOut={isDesktop ? () => { if(!isDragging) document.body.style.cursor = "auto"; } : undefined}
      />
    </RigidBody>
  );
}