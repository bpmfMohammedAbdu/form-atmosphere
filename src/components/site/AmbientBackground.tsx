import { useEffect, useRef } from "react";
import { sceneColors } from "@/data/portfolio";

const SPACING = 38;
const RADIUS = 190;
const PUSH = 22;

/** Procedural blueprint dot grid that bends away from the cursor. Pure 2D canvas, no WebGL. */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const gold = sceneColors.gold;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX; mouse.ty = e.clientY; };
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };

    const draw = (time: number) => {
      const t = time * 0.00025;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let x = i * SPACING;
          let y = j * SPACING;
          const wave = Math.sin(i * 0.35 + t * 3) * Math.cos(j * 0.3 - t * 2);
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          let near = 0;
          if (d < RADIUS) {
            near = 1 - d / RADIUS;
            const f = (near * near * PUSH) / (d || 1);
            x += dx * f;
            y += dy * f;
          }
          const alpha = 0.08 + 0.07 * (wave + 1) * 0.5 + near * 0.55;
          const size = 1 + near * 1.6;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = near > 0.08 ? gold : "#c7d0e0";
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-vignette" />
    </div>
  );
}
