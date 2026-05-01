"use client";

import { Float, MeshDistortMaterial, OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

function Core() {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * 0.18 + mouse.y * 0.22;
    mesh.current.rotation.y = clock.elapsedTime * 0.28 + mouse.x * 0.32;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={mesh} position={[0, 0.2, 0]}>
        <icosahedronGeometry args={[1.35, 3]} />
        <MeshDistortMaterial
          color="#38bdf8"
          emissive="#5b21b6"
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.72}
          distort={0.22}
          speed={1.4}
        />
      </mesh>
      <Text
        position={[0, -1.85, 0]}
        fontSize={0.22}
        color="#dffbff"
        anchorX="center"
        anchorY="middle"
      >
        QUANTUM TEAMS
      </Text>
    </Float>
  );
}

function OrbitingWidgets() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.22;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <Float key={index} speed={1 + index * 0.05} floatIntensity={0.6}>
            <mesh position={[Math.cos(angle) * 3, Math.sin(index) * 0.55, Math.sin(angle) * 3]}>
              <boxGeometry args={[0.72, 0.42, 0.08]} />
              <meshStandardMaterial
                color={index % 2 ? "#8b5cf6" : "#22d3ee"}
                emissive={index % 2 ? "#7c3aed" : "#0891b2"}
                emissiveIntensity={0.38}
                metalness={0.6}
                roughness={0.25}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export function ExperienceScene({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className={compact ? "h-[300px] w-full" : "absolute inset-0 -z-0 h-full w-full"}>
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }} dpr={[1, 1.7]}>
        <Suspense fallback={null}>
          <color attach="background" args={["#030511"]} />
          <ambientLight intensity={0.55} />
          <pointLight position={[4, 4, 4]} intensity={3.5} color="#22d3ee" />
          <pointLight position={[-4, -2, 3]} intensity={2.2} color="#8b5cf6" />
          <Stars radius={45} depth={40} count={1400} factor={3} saturation={0} fade speed={0.65} />
          <Core />
          <OrbitingWidgets />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} />
        </Suspense>
      </Canvas>
    </div>
  );
}
