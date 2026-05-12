"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./site.module.css";

function createPlanetTexture(baseColor: string, accentColor: string, shadowColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, shadowColor);
  gradient.addColorStop(0.42, baseColor);
  gradient.addColorStop(1, accentColor);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let band = 0; band < 22; band += 1) {
    const y = (band / 22) * canvas.height;
    const height = 16 + Math.random() * 36;
    const hueShift = band % 3 === 0 ? "rgba(209,255,146,0.18)" : "rgba(45,89,12,0.22)";

    context.fillStyle = hueShift;
    context.beginPath();
    context.moveTo(0, y);

    for (let x = 0; x <= canvas.width; x += 24) {
      const wave = Math.sin(x * 0.012 + band * 1.35) * height;
      const offset = Math.cos(x * 0.021 - band * 0.8) * (height * 0.42);
      context.lineTo(x, y + wave + offset);
    }

    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();
  }

  for (let fracture = 0; fracture < 14; fracture += 1) {
    context.strokeStyle = fracture % 2 === 0 ? "rgba(190,255,122,0.24)" : "rgba(12,28,6,0.22)";
    context.lineWidth = 1.5 + Math.random() * 2.5;
    context.beginPath();

    const startY = Math.random() * canvas.height;
    context.moveTo(0, startY);

    for (let x = 0; x <= canvas.width; x += 32) {
      const drift = Math.sin(x * 0.015 + fracture * 1.8) * 18 + Math.cos(x * 0.032) * 8;
      context.lineTo(x, startY + drift);
    }

    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

type PlanetMode = "mobile" | "compact" | "full";

function HulkPlanet({ mode }: { mode: PlanetMode }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const planetRef = useRef<THREE.Mesh | null>(null);
  const cloudRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);

  const isMobile = mode === "mobile";
  const isCompact = mode === "compact";

  const [surfaceTexture, cloudTexture] = useMemo(() => {
    const surface = createPlanetTexture("#4f9f1b", "#cfff74", "#14260a");
    const clouds = createPlanetTexture("#6dc72b", "#dfff9f", "#315a13");

    if (clouds) {
      clouds.repeat.set(1.5, 1);
    }

    return [surface, clouds];
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * (isMobile ? 0.11 : 0.08);
      groupRef.current.rotation.z = Math.sin(elapsed * 0.18) * (isMobile ? 0.07 : 0.05);
      groupRef.current.position.y = Math.sin(elapsed * 0.35) * (isMobile ? 0.16 : 0.12);
    }

    if (planetRef.current) {
      planetRef.current.rotation.y = elapsed * (isMobile ? 0.24 : 0.18);
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y = -elapsed * (isMobile ? 0.14 : 0.1);
      cloudRef.current.rotation.z = elapsed * 0.03;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * (isMobile ? 0.16 : 0.12);
    }

    if (moonRef.current) {
      const orbitX = isMobile ? 2.45 : isCompact ? 2.15 : 2.7;
      const orbitZ = isMobile ? 1.45 : isCompact ? 1.2 : 1.6;

      moonRef.current.position.x = Math.cos(elapsed * 0.38) * orbitX;
      moonRef.current.position.z = Math.sin(elapsed * 0.38) * orbitZ;
      moonRef.current.position.y = Math.sin(elapsed * 0.72) * 0.24;
    }
  });

  const position: [number, number, number] = isMobile
    ? [1.1, -0.05, -0.1]
    : isCompact
      ? [1.65, 0.1, -0.15]
      : [2.3, 0.05, -0.35];
  const planetRadius = isMobile ? 1.22 : isCompact ? 0.98 : 1.24;
  const cloudRadius = isMobile ? 1.29 : isCompact ? 1.03 : 1.3;
  const atmosphereRadius = isMobile ? 1.34 : isCompact ? 1.08 : 1.36;
  const ringRadius = isMobile ? 1.94 : isCompact ? 1.62 : 2.06;
  const outerRingRadius = isMobile ? 2.18 : isCompact ? 1.84 : 2.34;
  const moonRadius = isMobile ? 0.16 : isCompact ? 0.13 : 0.17;

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTexture}
          color="#6fcf2b"
          emissive="#315a12"
          emissiveIntensity={0.45}
          roughness={0.9}
          metalness={0.06}
        />
      </mesh>

      <mesh ref={cloudRef}>
        <sphereGeometry args={[cloudRadius, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          color="#dfffab"
          transparent
          opacity={isMobile ? 0.24 : 0.18}
          emissive="#8dff4d"
          emissiveIntensity={isMobile ? 0.24 : 0.16}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={isMobile ? 1.18 : isCompact ? 1.1 : 1.15}>
        <sphereGeometry args={[atmosphereRadius, 48, 48]} />
        <meshBasicMaterial color="#8dff4d" transparent opacity={isMobile ? 0.13 : 0.08} side={THREE.BackSide} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI * 0.72, Math.PI * 0.2, Math.PI * 0.14]}>
        <torusGeometry args={[ringRadius, isMobile ? 0.048 : isCompact ? 0.032 : 0.04, 20, 140]} />
        <meshStandardMaterial
          color="#b8ff71"
          emissive="#8dff4d"
          emissiveIntensity={isMobile ? 1.1 : 0.95}
          transparent
          opacity={isMobile ? 0.62 : 0.52}
        />
      </mesh>

      <mesh rotation={[Math.PI * 0.72, Math.PI * 0.2, Math.PI * 0.14]}>
        <torusGeometry args={[outerRingRadius, isMobile ? 0.016 : 0.012, 12, 120]} />
        <meshBasicMaterial color="#9750ff" transparent opacity={isMobile ? 0.48 : 0.36} />
      </mesh>

      <mesh ref={moonRef} position={[isMobile ? 2.45 : isCompact ? 2.15 : 2.7, 0.08, 0]}>
        <sphereGeometry args={[moonRadius, 28, 28]} />
        <meshStandardMaterial
          color="#d4ffc0"
          emissive="#8dff4d"
          emissiveIntensity={0.55}
          roughness={0.6}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ mode }: { mode: PlanetMode }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const isMobile = mode === "mobile";
  const isCompact = mode === "compact";

  const [positions, colors] = useMemo(() => {
    const count = isMobile ? 180 : isCompact ? 110 : 210;
    const positionData = new Float32Array(count * 3);
    const colorData = new Float32Array(count * 3);
    const green = new THREE.Color("#8dff4d");
    const lime = new THREE.Color("#dfff9f");
    const purple = new THREE.Color("#9750ff");

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      const radius = isMobile ? 3.2 + Math.random() * 1.8 : isCompact ? 3 + Math.random() * 1.5 : 3.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positionData[stride] = radius * Math.sin(phi) * Math.cos(theta);
      positionData[stride + 1] = radius * Math.cos(phi) * 0.62;
      positionData[stride + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = index % 5 === 0 ? purple : index % 2 === 0 ? lime : green;
      colorData[stride] = color.r;
      colorData[stride + 1] = color.g;
      colorData[stride + 2] = color.b;
    }

    return [positionData, colorData];
  }, [isCompact, isMobile]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * (isMobile ? 0.045 : 0.03);
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.16) * 0.05;
    }
  });

  const position: [number, number, number] = isMobile ? [0.55, 0.06, 0] : isCompact ? [0.45, 0.18, 0] : [0.95, 0.08, 0];

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.033 : isCompact ? 0.028 : 0.036}
        sizeAttenuation
        vertexColors
        transparent
        opacity={isMobile ? 0.84 : 0.74}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroScene() {
  const [sceneMode, setSceneMode] = useState<"off" | PlanetMode>("off");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMode = () => {
      if (media.matches) {
        setSceneMode("off");
        return;
      }

      if (window.innerWidth < 768) {
        setSceneMode("mobile");
        return;
      }

      if (window.innerWidth < 1080) {
        setSceneMode("compact");
        return;
      }

      setSceneMode("full");
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

  const isMobile = sceneMode === "mobile";

  return (
    <div className={`${styles.heroSceneWrap} ${isMobile ? styles.heroSceneWrapMobile : ""}`} aria-hidden="true">
      <Canvas
        className={styles.heroSceneCanvas}
        dpr={[1, isMobile ? 1.35 : sceneMode === "compact" ? 1.2 : 1.6]}
        camera={{ position: isMobile ? [0, 0, 6.3] : [0, 0, 7.8], fov: isMobile ? 34 : sceneMode === "compact" ? 42 : 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#040704", 5.5, 14]} />
        <ambientLight intensity={isMobile ? 0.38 : 0.3} />
        <pointLight position={[3, 2.2, 3.8]} color="#8dff4d" intensity={isMobile ? 20 : 17} distance={11} />
        <pointLight position={[-2.4, -1.3, 2.8]} color="#6dff3b" intensity={isMobile ? 10 : 8} distance={10} />
        <pointLight position={[0.4, -1.8, 2.2]} color="#9750ff" intensity={isMobile ? 7.5 : 6} distance={9} />
        <ParticleField mode={sceneMode} />
        <HulkPlanet mode={sceneMode} />
      </Canvas>
      <div className={`${styles.heroSceneGlow} ${isMobile ? styles.heroSceneGlowMobile : ""}`} />
    </div>
  );
}
