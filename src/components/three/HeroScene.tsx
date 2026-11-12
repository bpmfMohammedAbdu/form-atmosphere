import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Grid } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { sceneColors } from "@/data/portfolio";

/* ---------- interaction feel (unchanged from the original tower) ---------- */
const POINTER_YAW = 0.55;
const POINTER_PITCH = 0.18;
const FOLLOW = 3.2; // damping rate toward pointer

/* ---------- fit ---------- */
const SCALE = 0.8; // model units -> scene units
const FIT_WIDTH = 5.2; // visible width the model needs at full scale
const MIN_FIT = 0.72; // narrowest screens never shrink the model below this

/* ---------- palette (scene palette + the project's red structural accent) ---------- */
const GLASS = "#14233b";
const FIN = "#4a5568";
const STEEL = "#2c3546";
const ACCENT_RED = "#b3352b";
const POOL = "#123052";

/* ---------- lower commercial wing (elevation profile, extruded in z) ---------- */
type P2 = { x: number; y: number };
const WING_Z = 1.35; // half depth
const FOOT_L = -2.0; // wall base, left end
const FOOT_R = 1.75; // wall base, right end
const EAVE_L: P2 = { x: -2.3, y: 1.36 };
const RIDGE: P2 = { x: -0.9, y: 1.52 };
const EAVE_R: P2 = { x: 1.85, y: 1.3 };
const ROOF_T = 0.07;
const ROOF_TIP_L = -2.55;
const ROOF_TIP_R = 2.7; // cantilever carried by the red V columns
const ROOF_HALF_D = 1.55;
const FIN_STEP = 0.085;

/* ---------- upper tower ---------- */
const TOWER = { cx: -1.3, cz: -0.55, w: 1.75, d: 1.35, base: 1.85 };
const SLAB_T = 0.05;
const FLOORS = [
  { h: 0.4, dx: 0.0, lit: true, proj: 0.16, yaw: 0.0 },
  { h: 0.34, dx: 0.06, lit: false, proj: 0.12, yaw: 0.03 },
  { h: 0.62, dx: -0.05, lit: false, proj: 0.2, yaw: -0.04 },
  { h: 0.34, dx: 0.05, lit: true, proj: 0.08, yaw: 0.0 },
  { h: 0.34, dx: -0.04, lit: false, proj: 0.18, yaw: 0.05 },
  { h: 0.34, dx: 0.03, lit: true, proj: 0.12, yaw: -0.03 },
  { h: 0.34, dx: 0.0, lit: true, proj: 0.3, yaw: 0.04 },
];

/* ---------- site ---------- */
const SITE = { cx: 0.15, w: 5.6, d: 4.0, t: 0.12 };
const MODEL_OFFSET_X = -0.15; // centres the site on the rotation axis

/* ---------- geometry helpers ---------- */
const UP = new THREE.Vector3(0, 1, 0);
const _o = new THREE.Object3D();

function lineY(a: P2, b: P2, x: number) {
  return a.y + ((x - a.x) * (b.y - a.y)) / (b.x - a.x);
}
/** Height of the wing's wall top (underside of the folded roof) at x. */
function wallTop(x: number) {
  return x < RIDGE.x ? lineY(EAVE_L, RIDGE, x) : lineY(RIDGE, EAVE_R, x);
}

function boxM(x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0, rz = 0) {
  _o.position.set(x, y, z);
  _o.rotation.set(0, ry, rz);
  _o.scale.set(sx, sy, sz);
  _o.updateMatrix();
  return _o.matrix.clone();
}

/** A plate of thickness t resting on the line (x0,y0)->(x1,y1), centred at depth cz. */
function plateM(x0: number, y0: number, x1: number, y1: number, t: number, depth: number, cz = 0) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const len = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2 - (Math.sin(a) * t) / 2;
  const cy = (y0 + y1) / 2 + (Math.cos(a) * t) / 2;
  return boxM(cx, cy, cz, len, t, depth, 0, a);
}

/** Unit cylinder (radius 1, height 1) stretched between two points. */
function rodM(a: THREE.Vector3, b: THREE.Vector3, r: number) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  return new THREE.Matrix4().compose(mid, q, new THREE.Vector3(r, len, r));
}

const CUBE_EDGES = [
  [0, 1], [2, 3], [4, 5], [6, 7],
  [0, 2], [1, 3], [4, 6], [5, 7],
  [0, 4], [1, 5], [2, 6], [3, 7],
] as const;

function pushBoxEdges(m: THREE.Matrix4, out: number[]) {
  const c: THREE.Vector3[] = [];
  for (let i = 0; i < 8; i++) {
    c.push(new THREE.Vector3(i & 1 ? 0.5 : -0.5, i & 2 ? 0.5 : -0.5, i & 4 ? 0.5 : -0.5).applyMatrix4(m));
  }
  for (const [a, b] of CUBE_EDGES) {
    const p = c[a]!, q = c[b]!;
    out.push(p.x, p.y, p.z, q.x, q.y, q.z);
  }
}

/** Curtain-wall mullions on the four faces of a glass box. */
function pushMullions(out: number[], cx: number, cz: number, w: number, d: number, y0: number, y1: number, transom: boolean) {
  const e = 0.004;
  const nx = Math.round(w / 0.175);
  const nz = Math.round(d / 0.175);
  for (let i = 1; i < nx; i++) {
    const x = cx - w / 2 + (i * w) / nx;
    for (const z of [cz - d / 2 - e, cz + d / 2 + e]) out.push(x, y0, z, x, y1, z);
  }
  for (let k = 1; k < nz; k++) {
    const z = cz - d / 2 + (k * d) / nz;
    for (const x of [cx - w / 2 - e, cx + w / 2 + e]) out.push(x, y0, z, x, y1, z);
  }
  if (transom) {
    const y = (y0 + y1) / 2;
    const x0 = cx - w / 2 - e, x1 = cx + w / 2 + e, z0 = cz - d / 2 - e, z1 = cz + d / 2 + e;
    out.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
  }
}

function lines(arr: number[]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
  return g;
}

/* ---------- the building ---------- */
function useBuilding() {
  return useMemo(() => {
    const glass: THREE.Matrix4[] = [];
    const slabs: THREE.Matrix4[] = [];
    const fins: THREE.Matrix4[] = [];
    const glow: THREE.Matrix4[] = [];
    const columns: THREE.Matrix4[] = [];
    const red: THREE.Matrix4[] = [];
    const white: number[] = [];
    const gold: number[] = [];
    const mullion: number[] = [];

    /* site base */
    const site = boxM(SITE.cx, -SITE.t / 2, 0, SITE.w, SITE.t, SITE.d);
    pushBoxEdges(site, white);

    /* lower wing: glazed body from the elevation profile */
    const shape = new THREE.Shape();
    shape.moveTo(FOOT_L, 0);
    shape.lineTo(FOOT_R, 0);
    shape.lineTo(EAVE_R.x, EAVE_R.y);
    shape.lineTo(RIDGE.x, RIDGE.y);
    shape.lineTo(EAVE_L.x, EAVE_L.y);
    shape.closePath();
    const body = new THREE.ExtrudeGeometry(shape, { depth: WING_Z * 2, bevelEnabled: false });
    body.translate(0, 0, -WING_Z);
    const bodyEdges = new THREE.EdgesGeometry(body, 20);
    white.push(...(bodyEdges.getAttribute("position").array as Float32Array));
    bodyEdges.dispose();

    /* folded roof: two plates meeting at the ridge, cantilevered to the right */
    const roofA = plateM(ROOF_TIP_L, lineY(EAVE_L, RIDGE, ROOF_TIP_L), RIDGE.x, RIDGE.y, ROOF_T, ROOF_HALF_D * 2);
    const roofB = plateM(RIDGE.x, RIDGE.y, ROOF_TIP_R, lineY(RIDGE, EAVE_R, ROOF_TIP_R), ROOF_T, ROOF_HALF_D * 2);
    slabs.push(roofA, roofB);
    pushBoxEdges(roofA, white);
    pushBoxEdges(roofB, white);

    /* skylight grid on the long roof plate */
    const skyX0 = -0.55, skyX1 = 0.45, skyZ0 = -0.6, skyZ1 = 0.4;
    const skyLift = ROOF_T + 0.012;
    glass.push(plateM(skyX0, lineY(RIDGE, EAVE_R, skyX0) + ROOF_T, skyX1, lineY(RIDGE, EAVE_R, skyX1) + ROOF_T, 0.02, skyZ1 - skyZ0, (skyZ0 + skyZ1) / 2));
    for (let i = 0; i <= 5; i++) {
      const z = skyZ0 + ((skyZ1 - skyZ0) * i) / 5;
      gold.push(skyX0, lineY(RIDGE, EAVE_R, skyX0) + skyLift + 0.012, z, skyX1, lineY(RIDGE, EAVE_R, skyX1) + skyLift + 0.012, z);
      const x = skyX0 + ((skyX1 - skyX0) * i) / 5;
      const y = lineY(RIDGE, EAVE_R, x) + skyLift + 0.012;
      gold.push(x, y, skyZ0, x, y, skyZ1);
    }

    /* vertical sun-shading fins: long faces, leaving the entrance open */
    const entrance = { x0: -0.48, x1: 0.06 };
    for (let x = FOOT_L + 0.06; x <= FOOT_R - 0.04; x += FIN_STEP) {
      const h = wallTop(x);
      for (const side of [-1, 1]) {
        if (side === 1 && x > entrance.x0 && x < entrance.x1) continue;
        fins.push(boxM(x, h / 2, side * (WING_Z + 0.04), 0.022, h, 0.07));
      }
    }
    /* fins on the two raked end walls */
    for (const end of [
      { foot: FOOT_L, top: EAVE_L },
      { foot: FOOT_R, top: EAVE_R },
    ]) {
      const lean = Math.atan2(end.top.x - end.foot, end.top.y);
      const len = Math.hypot(end.top.x - end.foot, end.top.y);
      const out = Math.sign(end.top.x) * 0.04;
      for (let z = -WING_Z + 0.06; z <= WING_Z - 0.04; z += FIN_STEP) {
        fins.push(boxM((end.foot + end.top.x) / 2 + out, end.top.y / 2, z, 0.07, len, 0.022, 0, -lean));
      }
    }

    /* framed horizontal openings with a warm glowing rim (both long faces) */
    const openings = [
      { x0: -1.75, x1: -0.62, y0: 0.92, y1: 1.16 },
      { x0: 0.22, x1: 1.55, y0: 0.4, y1: 0.62 },
    ];
    for (const side of [-1, 1]) {
      for (const o of openings) {
        const cx = (o.x0 + o.x1) / 2, cy = (o.y0 + o.y1) / 2, w = o.x1 - o.x0, h = o.y1 - o.y0;
        glow.push(boxM(cx, cy, side * (WING_Z + 0.085), w + 0.045, h + 0.045, 0.02));
        slabs.push(boxM(cx, cy, side * (WING_Z + 0.1), w, h, 0.03));
      }
    }

    /* lit entrance with its folded canopy */
    glow.push(boxM((entrance.x0 + entrance.x1) / 2, 0.22, WING_Z + 0.01, entrance.x1 - entrance.x0 - 0.12, 0.44, 0.02));
    const canopy = plateM(-0.62, 0.5, 0.2, 0.68, 0.04, 0.5, WING_Z + 0.25);
    slabs.push(canopy);
    pushBoxEdges(canopy, gold);

    /* red V columns carrying the roof cantilever */
    for (const z of [-1.05, 1.05]) {
      const foot = new THREE.Vector3(2.3, 0, z);
      for (const tx of [1.98, 2.6]) {
        red.push(rodM(foot, new THREE.Vector3(tx, wallTop(tx), z), 0.045));
      }
    }

    /* upper tower: pilotis + base platform */
    const { cx, cz, w, d, base } = TOWER;
    for (const px of [cx - 0.72, cx, cx + 0.72]) {
      for (const pz of [cz - 0.52, cz + 0.52]) {
        columns.push(rodM(new THREE.Vector3(px, 0, pz), new THREE.Vector3(px, base - 0.09, pz), 0.04));
      }
    }
    const platform = boxM(cx, base - 0.045, cz, w + 0.8, 0.09, d + 0.7);
    slabs.push(platform);
    pushBoxEdges(platform, gold);

    /* stacked, offset glass floors with projecting plates */
    let y = base;
    for (const f of FLOORS) {
      const gh = f.h - SLAB_T;
      const fx = cx + f.dx;
      const g = boxM(fx, y + gh / 2, cz, w, gh, d);
      glass.push(g);
      pushBoxEdges(g, white);
      pushMullions(mullion, fx, cz, w, d, y, y + gh, gh > 0.4);
      if (f.lit) glow.push(boxM(fx, y + gh - 0.035, cz, w + 0.012, 0.055, d + 0.012));
      const s = boxM(cx + f.dx * 0.5, y + gh + SLAB_T / 2, cz, w + f.proj * 2, SLAB_T, d + f.proj * 1.6, f.yaw);
      slabs.push(s);
      pushBoxEdges(s, gold);
      y += f.h;
    }

    return {
      site,
      body,
      glass,
      slabs,
      fins,
      glow,
      columns,
      red,
      white: lines(white),
      gold: lines(gold),
      mullion: lines(mullion),
    };
  }, []);
}

/** One draw call for many copies of the same piece. */
function Batch({ matrices, children }: { matrices: THREE.Matrix4[]; children: ReactNode }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]} frustumCulled={false}>
      {children}
    </instancedMesh>
  );
}

/** Window-wide pointer in -1..1, so the building follows the cursor anywhere on the page. */
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

function Building() {
  const pointer = useWindowPointer();
  const group = useRef<THREE.Group>(null);
  const b = useBuilding();
  const viewportWidth = useThree((s) => s.viewport.width);
  const fit = SCALE * Math.max(MIN_FIT, Math.min(1, viewportWidth / FIT_WIDTH));
  const sitePos = useMemo(() => new THREE.Vector3().setFromMatrixPosition(b.site), [b.site]);

  useEffect(
    () => () => {
      b.body.dispose();
      b.white.dispose();
      b.gold.dispose();
      b.mullion.dispose();
    },
    [b],
  );

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
    <group ref={group} position={[0, -2.4, 0]} scale={fit}>
      <group position={[MODEL_OFFSET_X, 0, 0]}>
        {/* site base + pool */}
        <mesh position={sitePos}>
          <boxGeometry args={[SITE.w, SITE.t, SITE.d]} />
          <meshStandardMaterial color="#141a28" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0.95, 0.004, 1.74]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1.3, 0.5]} />
          <meshStandardMaterial color={POOL} emissive="#1d4f91" emissiveIntensity={0.35} metalness={0.6} roughness={0.15} />
        </mesh>

        {/* glazing: wing body, tower floors, skylight */}
        <mesh geometry={b.body}>
          <meshStandardMaterial color={GLASS} metalness={0.8} roughness={0.1} envMapIntensity={2} />
        </mesh>
        <Batch matrices={b.glass}>
          <boxGeometry />
          <meshStandardMaterial color={GLASS} metalness={0.8} roughness={0.08} envMapIntensity={2.2} />
        </Batch>

        {/* floor plates, roof, platform, canopy, window frames */}
        <Batch matrices={b.slabs}>
          <boxGeometry />
          <meshStandardMaterial color={sceneColors.slate} metalness={0.4} roughness={0.35} />
        </Batch>

        <Batch matrices={b.fins}>
          <boxGeometry />
          <meshStandardMaterial color={FIN} metalness={0.5} roughness={0.45} />
        </Batch>

        {/* warm interior light bands */}
        <Batch matrices={b.glow}>
          <boxGeometry />
          <meshStandardMaterial color={sceneColors.gold} emissive={sceneColors.gold} emissiveIntensity={0.75} />
        </Batch>

        <Batch matrices={b.columns}>
          <cylinderGeometry args={[1, 1, 1, 12]} />
          <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.4} />
        </Batch>
        <Batch matrices={b.red}>
          <cylinderGeometry args={[1, 1, 1, 12]} />
          <meshStandardMaterial color={ACCENT_RED} emissive={ACCENT_RED} emissiveIntensity={0.25} metalness={0.3} roughness={0.45} />
        </Batch>

        {/* architectural linework */}
        <lineSegments geometry={b.white}>
          <lineBasicMaterial color={sceneColors.white} transparent opacity={0.5} />
        </lineSegments>
        <lineSegments geometry={b.mullion}>
          <lineBasicMaterial color={sceneColors.white} transparent opacity={0.18} />
        </lineSegments>
        <lineSegments geometry={b.gold}>
          <lineBasicMaterial color={sceneColors.gold} transparent opacity={0.85} />
        </lineSegments>
      </group>
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
        camera={{ position: [5.2, 1.4, 8.4], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.1, 0);
          wrap.current?.setAttribute("data-scene-ready", "true");
        }}
      >
        <fog attach="fog" args={[sceneColors.background, 9, 18]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 4]} intensity={1.6} color="#fff4e0" />
        <pointLight position={[-3, 1, 2]} intensity={6} color={sceneColors.gold} distance={8} />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.2} color={sceneColors.goldSoft} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.8} color="#8bb4ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Building />
        <Grid
          position={[0, -2.62, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#2a3346"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#7a5a1a"
          fadeDistance={11}
          fadeStrength={1.5}
          infiniteGrid
        />
      </Canvas>
    </div>
  );
}
