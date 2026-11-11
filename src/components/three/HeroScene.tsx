import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Grid } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneColors } from "@/data/portfolio";

const LEVELS = 46;
const SLAB_W = 2.3;
const SLAB_D = 1.5;
const LEVEL_H = 0.11;
const TWIST = 0.042; // radians per level
const POINTER_YAW = 0.55;
const POINTER_PITCH = 0.18;
const FOLLOW = 3.2; // damping rate toward pointer

function taper(i: number) {
  const t = i / (LEVELS - 1);
  return 1 - 0.28 * t + 0.12 * Math.sin(t * Math.PI * 1.6);
}

function useTowerGeometry() {
  return useMemo(() => {
    const slabEdges: number[] = [];
    const diagrid: number[] = [];
    const corners: THREE.Vector3[][] = [];
    const matrices: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (let i = 0; i < LEVELS; i++) {
      const s = taper(i);
      const y = i * LEVEL_H;
      const rot = i * TWIST;
      tmp.position.set(0, y, 0);
      tmp.rotation.set(0, rot, 0);
      tmp.scale.set(s, 1, s);
      tmp.updateMatrix();
      matrices.push(tmp.matrix.clone());
      const hw = (SLAB_W / 2) * s;
      const hd = (SLAB_D / 2) * s;
      const up = new THREE.Vector3(0, 1, 0);
      const c = ([[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]] as const).map(([x, z]) =>
        new THREE.Vector3(x, y + 0.02, z).applyAxisAngle(up, rot),
      );
      corners.push(c);
      for (let k = 0; k < 4; k++) {
        const a = c[k]!, b = c[(k + 1) % 4]!;
        slabEdges.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    // Diagonal lattice: every 3 levels, connect corner k to the next corner up.
    for (let i = 0; i + 3 < LEVELS; i += 3) {
      for (let k = 0; k < 4; k++) {
        const lo = corners[i]!, hi = corners[i + 3]!;
        const a = lo[k]!;
        const b = hi[(k + 1) % 4]!;
        const m = new THREE.Vector3().lerpVectors(lo[k]!, lo[(k + 1) % 4]!, 0.5);
        const mb = new THREE.Vector3().lerpVectors(hi[k]!, hi[(k + 1) % 4]!, 0.5);
        diagrid.push(a.x, a.y, a.z, mb.x, mb.y, mb.z);
        diagrid.push(m.x, m.y, m.z, b.x, b.y, b.z);
      }
    }
    const edges = new THREE.BufferGeometry();
    edges.setAttribute("position", new THREE.Float32BufferAttribute(slabEdges, 3));
    const grid = new THREE.BufferGeometry();
    grid.setAttribute("position", new THREE.Float32BufferAttribute(diagrid, 3));
    return { edges, grid, matrices };
  }, []);
}

/** Window-wide pointer in -1..1, so the tower follows the cursor anywhere on the page. */
function useWindowPointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return p;
}

function Tower() {
  const pointer = useWindowPointer();
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<THREE.InstancedMesh>(null);
  const { edges, grid, matrices } = useTowerGeometry();

  useEffect(() => {
    const mesh = slabs.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useEffect(() => () => { edges.dispose(); grid.dispose(); }, [edges, grid]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const targetY = t * 0.12 + pointer.current.x * POINTER_YAW;
    const targetX = -pointer.current.y * POINTER_PITCH;
    const k = 1 - Math.exp(-FOLLOW * dt);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.position.y = -2.4 + Math.sin(t * 0.6) * 0.05;
  });

  return (
    <group ref={group} position={[0, -2.4, 0]}>
      <instancedMesh ref={slabs} args={[undefined, undefined, LEVELS]}>
        <boxGeometry args={[SLAB_W, 0.035, SLAB_D]} />
        <meshStandardMaterial color={sceneColors.slate} metalness={0.4} roughness={0.35} />
      </instancedMesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={sceneColors.white} transparent opacity={0.55} />
      </lineSegments>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color={sceneColors.gold} transparent opacity={0.85} />
      </lineSegments>
      {/* glowing core */}
      <mesh position={[0, (LEVELS * LEVEL_H) / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.24, LEVELS * LEVEL_H, 24, 1, true]} />
        <meshStandardMaterial color={sceneColors.gold} emissive={sceneColors.gold} emissiveIntensity={0.6} transparent opacity={0.35} />
      </mesh>
      {/* plinth */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[3.6, 0.2, 2.6]} />
        <meshStandardMaterial color="#141a28" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [4.2, 1.6, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => wrap.current?.setAttribute("data-scene-ready", "true")}
      >
        <fog attach="fog" args={[sceneColors.background, 7, 16]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 4]} intensity={1.6} color="#fff4e0" />
        <pointLight position={[-3, 1, 2]} intensity={6} color={sceneColors.gold} distance={8} />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.2} color={sceneColors.goldSoft} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.8} color="#8bb4ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Tower />
        <Grid
          position={[0, -2.62, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#2a3346"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#7a5a1a"
          fadeDistance={14}
          fadeStrength={1.5}
          infiniteGrid
        />
      </Canvas>
    </div>
  );
}
