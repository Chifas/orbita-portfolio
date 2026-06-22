"use client";

import { Suspense, useRef, useMemo, useState, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, useTexture, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { getSkyState } from "@/lib/sky";

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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** lat/long → posición en una esfera con textura equirectangular estándar (THREE.SphereGeometry). */
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
  const dot = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToVector3(BILBAO_LAT, BILBAO_LON, R * 1.005), []);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
    return q;
  }, [pos]);

  useFrame((state) => {
    const a = approach.current;
    const vis = clamp01(a * 2) * (1 - clamp01((a - 0.7) / 0.3)); // aparece y se va al entrar al 360
    if (ring.current) {
      const p = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      ring.current.scale.setScalar(1 + p * 1.4);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8 * vis;
    }
    if (dot.current) (dot.current.material as THREE.MeshStandardMaterial).opacity = vis;
  });

  return (
    <group position={pos} quaternion={quat}>
      <mesh ref={dot}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={4} transparent toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.002]}>
        <ringGeometry args={[0.045, 0.065, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vObjNormal;
  void main() {
    vUv = uv;
    vObjNormal = normal; // normal en espacio del objeto (anclado a la geografía)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D dayTexture;
  uniform sampler2D nightTexture;
  uniform vec3 sunDirection;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vObjNormal;
  void main() {
    float c = dot(normalize(vObjNormal), normalize(sunDirection));
    float t = smoothstep(-0.12, 0.12, c); // 0 = noche, 1 = día (terminador suave)
    vec3 day = texture2D(dayTexture, vUv).rgb;       // lineal (textura sRGB decodificada por GPU)
    vec3 night = texture2D(nightTexture, vUv).rgb;
    vec3 nightCol = night * vec3(1.25, 1.05, 0.7) * 1.5; // luces de ciudad cálidas
    vec3 col = mix(nightCol, day, t);
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), uOpacity); // lineal → sRGB
  }
`;

/** Tierra con día/noche real (luces de ciudad). Gira a Bilbao y se desvanece al final. */
function Earth({
  approach,
  segments,
  sun,
}: {
  approach: RefObject<number>;
  segments: number;
  sun: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const [dayMap, nightMap] = useTexture(["/textures/earth.jpg", "/textures/earth-night.png"]);
  dayMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.anisotropy = 4;

  const uniforms = useMemo(
    () => ({
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      sunDirection: { value: new THREE.Vector3(sun[0], sun[1], sun[2]) },
      uOpacity: { value: 1 },
    }),
    [dayMap, nightMap, sun],
  );

  const targetQuat = useMemo(() => {
    const dir = latLonToVector3(BILBAO_LAT, BILBAO_LON, 1);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
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
    const fade = 1 - clamp01((a - 0.72) / 0.23); // se desvanece al final (llegada a Bilbao)
    if (matRef.current) matRef.current.uniforms.uOpacity.value = fade;
    g.visible = fade > 0.001;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.18]}>
      <mesh>
        <sphereGeometry args={[R, segments, segments]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={EARTH_VERT}
          fragmentShader={EARTH_FRAG}
          transparent
        />
      </mesh>
      <BilbaoMarker approach={approach} />
    </group>
  );
}

/** Luna texturizada en órbita (mantiene su posición; se desvanece con opacidad). */
function Moon({ approach }: { approach: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const map = useTexture("/textures/moon.jpg");
  map.colorSpace = THREE.SRGBColorSpace;
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    ref.current?.position.set(Math.cos(t) * 2.8, Math.sin(t) * 0.6, Math.sin(t) * 2.8);
    if (ref.current) ref.current.rotation.y += 0.003;
    if (mat.current) mat.current.opacity = 1 - clamp01((approach.current - 0.6) / 0.25);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.28, 32, 32]} />
      <meshStandardMaterial ref={mat} map={map} roughness={1} metalness={0} transparent />
    </mesh>
  );
}

/** Cuerpos en órbita (solo la Luna). Mantiene su posición; se desvanece con opacidad. */
function OrbitingBodies({ approach }: { approach: RefObject<number> }) {
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Moon approach={approach} />
    </Float>
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
      <pointsMaterial size={0.025} color="#9aa0b4" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/** Cámara: se acerca con el scroll + leve parallax con el ratón. */
function CameraRig({ approach, mouse }: { approach: RefObject<number>; mouse: RefObject<Mouse> }) {
  const { camera } = useThree();
  useFrame(() => {
    const a = approach.current;
    const targetZ = 5 - a * 3; // 5 → 2.0 (acercamiento a Bilbao, sin entrar en el planeta)
    const damp = 1 - a * 0.85;
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

  // Estado del cielo según la hora local del visitante (sol, colores, intensidad).
  const sky = useMemo(() => getSkyState(), []);

  // Arrancamos a baja resolución; el PerformanceMonitor la sube si hay FPS.
  const [dpr, setDpr] = useState(1);
  // El bloom (compilar shaders) se activa un poco después, no en el arranque.
  const [bloom, setBloom] = useState(false);

  useEffect(() => {
    if (!high) return;
    const t = setTimeout(() => setBloom(true), 1800);
    return () => clearTimeout(t);
  }, [high]);

  useEffect(() => {
    const onScroll = () => {
      // Progreso sobre TODA la página: el zoom/aterrizaje ocurre poco a poco
      // a lo largo de todo el scroll y culmina al final (en Bilbao).
      const max = document.documentElement.scrollHeight - window.innerHeight;
      approach.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
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
      <color attach="background" args={[sky.background]} />
      <fog attach="fog" args={[sky.fog, 7, 18]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[sky.sun[0] * 5, sky.sun[1] * 5, sky.sun[2] * 5]}
        intensity={sky.sunIntensity}
        color={sky.sunColor}
      />
      <pointLight position={[-4, -2, -2]} intensity={1.4} color="#7c5cff" />

      <Suspense fallback={null}>
        <Earth approach={approach} segments={high ? 48 : 32} sun={sky.sun} />
        <OrbitingBodies approach={approach} />
      </Suspense>

      <Dust count={high ? 160 : 80} />
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
        </EffectComposer>
      )}
    </Canvas>
  );
}
