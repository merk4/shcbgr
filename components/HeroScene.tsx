"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./site.module.css";

function EnergyCluster({ compact }: { compact: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const ringARef = useRef<THREE.Mesh | null>(null);
  const ringBRef = useRef<THREE.Mesh | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const orbiters = useMemo(
    () =>
      Array.from({ length: compact ? 5 : 9 }, (_, index) => {
        const angle = (index / (compact ? 5 : 9)) * Math.PI * 2;
        const radius = compact ? 1.75 : 2.35;

        return {
          position: [
            Math.cos(angle) * radius,
            (index % 3) * 0.3 - 0.3,
            Math.sin(angle) * radius
          ] as [number, number, number],
          scale: 0.08 + (index % 3) * 0.03,
          color: index % 2 === 0 ? "#8dff4d" : "#9750ff"
        };
      }),
    [compact]
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.18;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.28) * 0.12;
      groupRef.current.position.y = Math.sin(elapsed * 0.45) * 0.16;
    }

    if (ringARef.current) {
      ringARef.current.rotation.z = elapsed * 0.45;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z = -elapsed * 0.32;
    }

    if (coreRef.current) {
      const scale = 1 + Math.sin(elapsed * 1.5) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={compact ? [1.7, 0.2, 0] : [2.4, 0.1, -0.3]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[compact ? 0.68 : 0.82, 1]} />
        <meshStandardMaterial
          color="#d9ffbf"
          emissive="#8dff4d"
          emissiveIntensity={1.15}
          roughness={0.28}
          metalness={0.18}
          transparent
          opacity={0.96}
        />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI * 0.38, 0, Math.PI * 0.18]}>
        <torusGeometry args={[compact ? 1.22 : 1.5, 0.035, 18, 120]} />
        <meshStandardMaterial
          color="#8dff4d"
          emissive="#8dff4d"
          emissiveIntensity={1.3}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh ref={ringBRef} rotation={[Math.PI * 0.78, Math.PI * 0.24, -Math.PI * 0.12]}>
        <torusGeometry args={[compact ? 1.56 : 1.94, 0.025, 14, 100]} />
        <meshStandardMaterial
          color="#b889ff"
          emissive="#9750ff"
          emissiveIntensity={1.1}
          transparent
          opacity={0.74}
        />
      </mesh>

      {orbiters.map((orbiter, index) => (
        <mesh key={index} position={orbiter.position} scale={orbiter.scale}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial color={orbiter.color} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ compact }: { compact: boolean }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [positions, colors] = useMemo(() => {
    const count = compact ? 120 : 220;
    const positionData = new Float32Array(count * 3);
    const colorData = new Float32Array(count * 3);
    const green = new THREE.Color("#8dff4d");
    const purple = new THREE.Color("#9750ff");

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      const radius = compact ? 2.8 + Math.random() * 1.6 : 3.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positionData[stride] = radius * Math.sin(phi) * Math.cos(theta);
      positionData[stride + 1] = radius * Math.cos(phi) * 0.6;
      positionData[stride + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = index % 3 === 0 ? purple : green;
      colorData[stride] = color.r;
      colorData[stride + 1] = color.g;
      colorData[stride + 2] = color.b;
    }

    return [positionData, colorData];
  }, [compact]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.045;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
    }
  });

  return (
    <points ref={pointsRef} position={compact ? [0.4, 0.2, 0] : [0.9, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={compact ? 0.03 : 0.038}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroScene() {
  const [sceneMode, setSceneMode] = useState<"off" | "compact" | "full">("off");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMode = () => {
      if (media.matches) {
        setSceneMode("off");
        return;
      }

      setSceneMode(window.innerWidth < 768 ? "compact" : "full");
    };

    updateMode();
    media.addEventListener("change", updateMode);
    window.addEventListener("resize", updateMode);

    return () => {
      media.removeEventListener("change", updateMode);
      window.removeEventListener("resize", updateMode);
    };
  }, []);

  if (sceneMode === "off") {
    return null;
  }

  const compact = sceneMode === "compact";

  return (
    <div className={styles.heroSceneWrap} aria-hidden="true">
      <Canvas
        className={styles.heroSceneCanvas}
        dpr={[1, compact ? 1.2 : 1.6]}
        camera={{ position: [0, 0, 7.8], fov: compact ? 42 : 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#030303", 6, 14]} />
        <ambientLight intensity={0.42} />
        <pointLight position={[2.8, 2, 3.5]} color="#8dff4d" intensity={15} distance={10} />
        <pointLight position={[-2.5, -1.2, 2.4]} color="#9750ff" intensity={12} distance={10} />
        <ParticleField compact={compact} />
        <EnergyCluster compact={compact} />
      </Canvas>
      <div className={styles.heroSceneGlow} />
    </div>
  );
}
