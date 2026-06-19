"use client";

import { Suspense, useRef, useMemo, useState, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, useTexture, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/** Generador pseudo-aleatorio determinista (puro) basado en un índice. */
function det(n: number, spread: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * spread;
}

const R = 1.35; // radio de la Tierra
// Bilbao, País Vasco
const BILBAO_LAT = 43.26;
const BILBAO_LON = -2.93;

type Quality = "low" | "high";
type Mouse = { x: number; y: number };

/** lat/long → posición en una esfera con textura equirectangular estándar. */
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (coarse || small || cores <= 4 || mem <= 4) return "low";
  return "high";
}

/** Marcador luminoso de Bilbao sobre la superficie (hijo del grupo Tierra). */
function BilbaoMarker({ approach }: { approach: RefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToVector3(BILBAO_LAT, BILBAO_LON, R * 1.005), []);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
    return q;
  }, [pos]);

  useFrame((state) => {
    if (!ring.current) return;
    const p = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
    ring.current.scale.setScalar(1 + p * 1.4);
    const mat = ring.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - p) * 0.8 * Math.min(1, approach.current * 2);
  });

  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.002]}>
        <ringGeometry args={[0.045, 0.065, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Tierra cartoon (toon). Al hacer scroll se acerca y gira para mostrar Bilbao. */
function Earth({
  approach,
  segments,
}: {
  approach: RefObject<number>;
  segments: number;
}) {
  const group = useRef<THREE.Group>(null);
  const map = useTexture("/textures/earth.jpg");
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const gradientMap = useMemo(() => {
    const steps = new Uint8Array([70, 130, 190, 245]);
    const tex = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Orientación que deja Bilbao mirando a la cámara (ligeramente desde arriba).
  const targetQuat = useMemo(() => {
    const dir = latLonToVector3(BILBAO_LAT, BILBAO_LON, 1);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(dir, new THREE.Vector3(0, 0.3, 1).normalize());
    return q;
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const a = approach.current;
    if (a < 0.03) {
      g.rotation.y += 0.12 * delta; // giro libre arriba del todo
    } else {
      g.quaternion.slerp(targetQuat, 0.06); // viaje suave a Bilbao
    }
    g.scale.setScalar(1 + a * 0.9); // se acerca/crece
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.18]}>
      <mesh scale={1.035}>
        <sphereGeometry args={[R, segments, segments]} />
        <meshBasicMaterial color="#070b22" side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R, segments, segments]} />
        <meshToonMaterial map={map} gradientMap={gradientMap} />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[R, segments, segments]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.BackSide}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <BilbaoMarker approach={approach} />
    </group>
  );
}

/** Luna texturizada en órbita. */
function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  const map = useTexture("/textures/moon.jpg");
  map.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    ref.current?.position.set(Math.cos(t) * 2.8, Math.sin(t) * 0.6, Math.sin(t) * 2.8);
    if (ref.current) ref.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.28, 32, 32]} />
      <meshStandardMaterial map={map} roughness={1} metalness={0} />
    </mesh>
  );
}

function DebrisRing({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.3 + det(i, 0.45);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = det(i + 99, 0.15);
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref} rotation={[0.5, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#22d3ee" transparent opacity={0.7} sizeAttenuation toneMapped={false} />
    </points>
  );
}

/** Cuerpos en órbita (Luna + anillo) que se desvanecen al acercarnos a Bilbao. */
function OrbitingBodies({ approach, count }: { approach: RefObject<number>; count: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const a = approach.current;
    ref.current.visible = a < 0.85;
    ref.current.scale.setScalar(Math.max(0.001, 1 - a * 1.15));
  });
  return (
    <group ref={ref}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Moon />
        <DebrisRing count={count} />
      </Float>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = det(i * 3, 14);
      arr[i * 3 + 1] = det(i * 3 + 1, 14);
      arr[i * 3 + 2] = det(i * 3 + 2, 14);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#9aa0b4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/** Cámara: se acerca con el scroll (zoom a Bilbao) + leve parallax con el ratón. */
function CameraRig({ approach, mouse }: { approach: RefObject<number>; mouse: RefObject<Mouse> }) {
  const { camera } = useThree();
  useFrame(() => {
    const a = approach.current;
    const targetZ = 5 - a * 1.9;
    const damp = 1 - a * 0.85; // menos parallax cuanto más cerca
    camera.position.x += (mouse.current.x * 0.8 * damp - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.5 * damp - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function VisibilityPause() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setFrameloop]);
  return null;
}

export default function CosmosScene() {
  const approach = useRef(0);
  const mouse = useRef<Mouse>({ x: 0, y: 0 });
  const [quality] = useState<Quality>(detectQuality);
  const high = quality === "high";

  const [dpr, setDpr] = useState(high ? 1.5 : 1);
  const [bloom, setBloom] = useState(high);

  useEffect(() => {
    const onScroll = () => {
      // Llega a "Bilbao" tras ~1.4 alturas de pantalla.
      approach.current = Math.min(window.scrollY / (window.innerHeight * 1.4), 1);
    };
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={dpr}
      gl={{ antialias: high, alpha: true, stencil: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#060814"]} />
      <fog attach="fog" args={["#060814", 7, 18]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 3]} intensity={1.6} color="#fff7e6" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#7c5cff" />

      <Suspense fallback={null}>
        <Earth approach={approach} segments={high ? 48 : 32} />
        <OrbitingBodies approach={approach} count={high ? 320 : 160} />
      </Suspense>

      <Dust count={high ? 250 : 120} />
      <Stars radius={60} depth={40} count={high ? 1800 : 700} factor={4} saturation={0} fade speed={0.5} />

      <CameraRig approach={approach} mouse={mouse} />
      <VisibilityPause />

      {high && (
        <PerformanceMonitor
          flipflops={3}
          onChange={({ factor }) => setDpr(Math.min(1.5, 0.85 + factor * 0.65))}
          onDecline={() => setBloom(false)}
          onFallback={() => {
            setDpr(1);
            setBloom(false);
          }}
        />
      )}

      {bloom && (
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.25} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
