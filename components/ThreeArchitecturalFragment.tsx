"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/Meshy_AI_Cliffside_Sky_Villa_0516212452_texture.glb";

// Preload the GLB asset so it's ready before the component mounts
useGLTF.preload(MODEL_PATH);

function ArchitecturalForm() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);

  const { scene } = useGLTF(MODEL_PATH);

  // Enable shadows on every mesh inside the loaded model
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        scrollProgressRef.current = customEvent.detail.progress;
      }
    };
    window.addEventListener("craft-scroll", handleScroll);
    return () => window.removeEventListener("craft-scroll", handleScroll);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Base slow auto-rotation + scroll-driven 360-degree rotation
      const baseRotation = clock.getElapsedTime() * 0.05;
      const scrollRotation = scrollProgressRef.current * Math.PI * 2;
      groupRef.current.rotation.y = baseRotation + scrollRotation;

      // Scale based on scroll progress (matching the original GSAP logic)
      const scale = 1 + Math.sin(scrollProgressRef.current * Math.PI) * 0.15;
      groupRef.current.scale.set(scale, scale, scale);

      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.03) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        <Center>
          {/* Adjust scale here if the villa model appears too large or small */}
          <primitive object={scene} scale={1.8} />
        </Center>
      </group>
    </Float>
  );
}

export default function ThreeArchitecturalFragment() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          color="#fff8ee"
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.6}
          color="#c8a96a"
        />
        <pointLight position={[0, 3, 3]} intensity={0.5} color="#c8a96a" />

        <fog attach="fog" args={["#17130f", 8, 20]} />

        <Suspense fallback={null}>
          <ArchitecturalForm />
        </Suspense>

        <Environment preset="city" environmentIntensity={0.5} />
      </Canvas>
    </div>
  );
}
