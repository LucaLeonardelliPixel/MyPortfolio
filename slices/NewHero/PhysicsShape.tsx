"use client";

import { useRef, useState, useEffect, MutableRefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";

export type PhysicsShapeProps = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: [number, number, number];
  scale: number;
};

export default function PhysicsShape({
  geometry,
  material,
  position,
  scale,
}: PhysicsShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<RapierRigidBody>(null!);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const { viewport, size } = useThree(); 
  const isDesktop = size.width >= 768;

  // --- RAF LOOP ---
  useFrame(({ pointer }) => {
    if (isDesktop && isDragging && bodyRef.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      
      bodyRef.current.setNextKinematicTranslation({ 
        x: x - dragOffset.current.x, 
        y: y - dragOffset.current.y, 
        z: 0 
      });
    }
  });

  // --- EVENTS: Inizio Drag ---
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
    
    // Logica Offset per Donut
    const isTorus = geometry.type === 'TorusGeometry';
    if (isTorus) {
        const currentTranslation = bodyRef.current?.translation();
        const mouseX = (e.pointer.x * viewport.width) / 2;
        const mouseY = (e.pointer.y * viewport.height) / 2;

        if (currentTranslation) {
            dragOffset.current = {
                x: mouseX - currentTranslation.x,
                y: mouseY - currentTranslation.y
            };
        }
    } else {
        dragOffset.current = { x: 0, y: 0 };
    }
    
    // 2 = KinematicPosition
    bodyRef.current?.setBodyType(2 as any, true);
    bodyRef.current?.wakeUp();
    
    setIsDragging(true);
  };

  // --- EVENTS: Fine Drag ---
  const handlePointerUp = () => {
    document.body.style.cursor = "auto";
    // 0 = Dynamic
    bodyRef.current?.setBodyType(0 as any, true);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
        const handleGlobalUp = () => {
            handlePointerUp();
        };
        window.addEventListener("pointerup", handleGlobalUp);
        return () => window.removeEventListener("pointerup", handleGlobalUp);
    }
  }, [isDragging]);

  return (
    <RigidBody
      ref={bodyRef}
      colliders="hull" 
      position={position}
      scale={scale}
      restitution={0.4}
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
        onPointerOver={isDesktop ? () => { if(!isDragging) document.body.style.cursor = "grab"; } : undefined}
        onPointerOut={isDesktop ? () => { if(!isDragging) document.body.style.cursor = "auto"; } : undefined}
      />
    </RigidBody>
  );
}