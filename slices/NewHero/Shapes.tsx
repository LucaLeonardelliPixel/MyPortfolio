"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Environment } from "@react-three/drei";
import Geometries from "./Geometries"; // Importa il gestore geometrie

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
          
          <Physics gravity={[0, -9.81, 0]}>
            {/* Gestore delle forme */}
            <Geometries />
            
            {/* Confini del mondo */}
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