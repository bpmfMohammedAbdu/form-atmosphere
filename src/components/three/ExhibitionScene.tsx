import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { exhibition, sceneColors } from "@/data/portfolio";

const N = exhibition.length;
const STEP = (Math.PI * 2) / N;
const RADIUS = 5.4;
const PANEL_H = 2.1;
const MAX_W = 3;
const DRAG_SENS = 0.006;
const SPIN_DAMP = 5;

type Props = {
  index: number;
  onIndexChange: (i: number) => void;
  onOpen: (i: number) => void;
  active: boolean;
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function Panel({ i, texture, onOpen, dragMoved }: { i: number; texture: THREE.Texture; onOpen: (i: number) => void; dragMoved: React.MutableRefObject<boolean> }) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const img = texture.image as { width: number; height: number } | undefined;
  const aspect = img ? img.width / img.height : 1.4;
  const w = Math.min(PANEL_H * aspect, MAX_W);
  const h = w / aspect;
  const a = i * STEP;

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const target = hover ? 1.06 : 1;
    const k = 1 - Math.exp(-10 * Math.min(delta, 0.05));
    g.scale.setScalar(g.scale.x + (target - g.scale.x) * k);
  });

  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => { document.body.style.cursor = ""; };
  }, [hover]);

  return (
    <group position={[Math.sin(a) * RADIUS, 0.25, Math.cos(a) * RADIUS]} rotation={[0, a, 0]}>
      <group
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); if (!dragMoved.current) onOpen(i); }}
      >
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[w + 0.12, h + 0.12, 0.06]} />
          <meshStandardMaterial color={hover ? sceneColors.gold : "#1a2131"} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
      {/* plinth label line */}
      <mesh position={[0, -h / 2 - 0.45, 0.02]}>
        <planeGeometry args={[w * 0.4, 0.012]} />
        <meshBasicMaterial color={sceneColors.gold} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Ring({ index, onIndexChange, onOpen }: Omit<Props, "active">) {
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(exhibition.map((e) => e.thumb));
  const target = useRef(0);
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const lastX = useRef(0);
  const downX = useRef(0);
  const { gl } = useThree();

  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  // Sync external index (buttons, keyboard) to the nearest equivalent rotation.
  useEffect(() => {
    const u = Math.round(-target.current / STEP);
    let d = mod(index - u, N);
    if (d > N / 2) d -= N;
    target.current = -(u + d) * STEP;
  }, [index]);

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      dragging.current = true;
      dragMoved.current = false;
      lastX.current = e.clientX;
      downX.current = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      if (Math.abs(e.clientX - downX.current) > 6) dragMoved.current = true;
      target.current += dx * DRAG_SENS;
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const u = Math.round(-target.current / STEP);
      target.current = -u * STEP;
      onIndexChange(mod(u, N));
      setTimeout(() => { dragMoved.current = false; }, 0);
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, onIndexChange]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-SPIN_DAMP * dt);
    g.rotation.y += (target.current - g.rotation.y) * k;
    // subtle camera parallax
    const cam = state.camera;
    cam.position.x += (state.pointer.x * 0.6 - cam.position.x) * k;
    cam.position.y += (0.6 + state.pointer.y * 0.3 - cam.position.y) * k;
    cam.lookAt(0, 0.2, RADIUS - 2);
  });

  return (
    <group ref={group}>
      {textures.map((t, i) => (
        <Panel key={i} i={i} texture={t} onOpen={onOpen} dragMoved={dragMoved} />
      ))}
    </group>
  );
}

export default function ExhibitionScene({ index, onIndexChange, onOpen, active }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrap} className="absolute inset-0 touch-pan-y">
      <Canvas
        dpr={[1, 1.6]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0.6, RADIUS + 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => wrap.current?.setAttribute("data-scene-ready", "true")}
      >
        <fog attach="fog" args={[sceneColors.background, 6, 17]} />
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 6, RADIUS + 3]} angle={0.5} penumbra={0.8} intensity={40} color="#ffe2b0" />
        <Environment resolution={32}>
          <Lightformer intensity={1.5} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color={sceneColors.goldSoft} position={[-5, 1, 5]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        {/* gallery floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
          <circleGeometry args={[RADIUS + 6, 64]} />
          <meshStandardMaterial color="#0e1320" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.69, 0]}>
          <ringGeometry args={[RADIUS + 0.9, RADIUS + 0.93, 128]} />
          <meshBasicMaterial color={sceneColors.gold} transparent opacity={0.5} />
        </mesh>
        <Suspense fallback={null}>
          <Ring index={index} onIndexChange={onIndexChange} onOpen={onOpen} />
        </Suspense>
      </Canvas>
    </div>
  );
}
