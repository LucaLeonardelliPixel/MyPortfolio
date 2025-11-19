"use client";

import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import PhysicsShape from "./PhysicsShape";

type ShapeData = {
    id: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: [number, number, number];
    scale: number;
};

export default function Geometries() {
  const { size, viewport } = useThree(); 
  
  const md_breakpoint = 768;
  const lg_breakpoint = 1024;

  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1.5), 
    new THREE.CapsuleGeometry(0.5, 1, 2, 16),
    new THREE.DodecahedronGeometry(1),
    new THREE.TorusGeometry(0.6, 0.25, 16, 32), 
    new THREE.OctahedronGeometry(1), 
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
            gsap.utils.random(-viewport.width / 2 + 1, viewport.width / 2 - 1), 
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
        count = 15; 
        scaleRange = [0.4, 0.6]; 
    }

    const START_DELAY = 3000; 

    const timeout = setTimeout(() => {
        const initialShapes = Array.from({ length: count }, () => createShape(false, scaleRange));
        setShapes(initialShapes);
    }, START_DELAY);

    const interval = setInterval(() => {
        setShapes((prevShapes) => {
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