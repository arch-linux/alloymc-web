"use client";

import { useEffect, useRef } from "react";

interface Drip {
  x: number;
  size: number;
  phase: "forming" | "stretching" | "necking" | "falling";
  t: number; // 0–1 progress within current phase
  fallY: number;
  fallV: number;
  formDuration: number;
  stretchDuration: number;
  neckDuration: number;
  wobble: number;
}

function makeDrip(canvasW: number): Drip {
  return {
    x: 40 + Math.random() * (canvasW - 80),
    size: 4 + Math.random() * 4,
    phase: "forming",
    t: 0,
    fallY: 0,
    fallV: 0,
    formDuration: 1.5 + Math.random() * 1.5,
    stretchDuration: 1.2 + Math.random() * 1.0,
    neckDuration: 0.4 + Math.random() * 0.3,
    wobble: Math.random() * Math.PI * 2,
  };
}

function drawDrip(ctx: CanvasRenderingContext2D, d: Drip, canvasH: number) {
  const { x, size, phase, t } = d;

  // Gradient: gold top → ember → molten bottom
  const grad = ctx.createLinearGradient(x, 0, x, 60);
  grad.addColorStop(0, "rgba(240, 184, 48, 0.85)");
  grad.addColorStop(0.4, "rgba(255, 107, 0, 0.75)");
  grad.addColorStop(1, "rgba(204, 85, 0, 0.5)");
  ctx.fillStyle = grad;
  ctx.shadowColor = "rgba(255, 107, 0, 0.5)";
  ctx.shadowBlur = size * 2.5;

  if (phase === "forming") {
    // Growing hemisphere at ceiling
    const h = size * 0.3 + t * size * 0.8;
    const w = size * 0.4 + t * size * 0.4;
    ctx.beginPath();
    ctx.moveTo(x - w, 0);
    ctx.bezierCurveTo(x - w, h * 0.5, x - w * 0.3, h, x, h);
    ctx.bezierCurveTo(x + w * 0.3, h, x + w, h * 0.5, x + w, 0);
    ctx.fill();
  } else if (phase === "stretching") {
    // Elongating: wide top, thinning neck, bulging bottom
    const ease = t * t; // accelerating stretch
    const totalLen = size * (1.2 + ease * 4);
    const topW = size * (0.7 - ease * 0.15);
    const neckW = size * (0.35 - ease * 0.12);
    const neckY = totalLen * 0.35;
    const blobW = size * (0.55 + ease * 0.35);
    const blobY = totalLen * (0.55 + ease * 0.15);
    const tipY = totalLen;

    ctx.beginPath();
    // Left side: top → neck → blob → tip
    ctx.moveTo(x - topW, 0);
    ctx.bezierCurveTo(x - topW, neckY * 0.3, x - neckW, neckY * 0.7, x - neckW, neckY);
    ctx.bezierCurveTo(x - neckW, neckY + (blobY - neckY) * 0.3, x - blobW, blobY - (blobY - neckY) * 0.3, x - blobW, blobY);
    ctx.quadraticCurveTo(x - blobW * 0.6, tipY, x, tipY + blobW * 0.4);
    // Right side: tip → blob → neck → top
    ctx.quadraticCurveTo(x + blobW * 0.6, tipY, x + blobW, blobY);
    ctx.bezierCurveTo(x + blobW, blobY - (blobY - neckY) * 0.3, x + neckW, neckY + (blobY - neckY) * 0.3, x + neckW, neckY);
    ctx.bezierCurveTo(x + neckW, neckY * 0.7, x + topW, neckY * 0.3, x + topW, 0);
    ctx.fill();
  } else if (phase === "necking") {
    // Neck thinning to almost nothing, blob about to detach
    const totalLen = size * 5.5;
    const topW = size * 0.5;
    const neckW = size * (0.2 - t * 0.17); // gets hair-thin
    const neckY = totalLen * 0.3;
    const blobW = size * (0.9 + t * 0.15);
    const blobY = totalLen * (0.65 + t * 0.1);
    const tipY = totalLen + t * size * 2;
    const sag = t * size * 1.5; // blob sags further

    ctx.beginPath();
    // Top residue
    ctx.moveTo(x - topW, 0);
    ctx.bezierCurveTo(x - topW, neckY * 0.25, x - neckW, neckY * 0.6, x - neckW, neckY);
    // Neck to blob
    ctx.bezierCurveTo(x - neckW * 0.5, neckY + sag * 0.5, x - blobW, blobY - size, x - blobW, blobY);
    ctx.quadraticCurveTo(x - blobW * 0.55, tipY, x, tipY + blobW * 0.35);
    // Right mirror
    ctx.quadraticCurveTo(x + blobW * 0.55, tipY, x + blobW, blobY);
    ctx.bezierCurveTo(x + blobW, blobY - size, x + neckW * 0.5, neckY + sag * 0.5, x + neckW, neckY);
    ctx.bezierCurveTo(x + neckW, neckY * 0.6, x + topW, neckY * 0.25, x + topW, 0);
    ctx.fill();
  } else if (phase === "falling") {
    // Residue at ceiling — shrinks away
    const residueW = size * 0.45 * Math.max(0, 1 - t * 2);
    const residueH = size * 0.6 * Math.max(0, 1 - t * 2);
    if (residueW > 0.3) {
      ctx.beginPath();
      ctx.moveTo(x - residueW, 0);
      ctx.quadraticCurveTo(x, residueH, x + residueW, 0);
      ctx.fill();
    }

    // Falling teardrop
    const fy = d.fallY;
    if (fy < canvasH + 30) {
      const bw = size * 0.75;
      const bh = size * 2.2;
      // Slight wobble
      const wx = Math.sin(d.wobble + fy * 0.02) * 1.5;

      const dropGrad = ctx.createLinearGradient(x + wx, fy - bh * 0.5, x + wx, fy + bh * 0.6);
      dropGrad.addColorStop(0, "rgba(240, 184, 48, 0.9)");
      dropGrad.addColorStop(0.5, "rgba(255, 107, 0, 0.8)");
      dropGrad.addColorStop(1, "rgba(204, 85, 0, 0.5)");
      ctx.fillStyle = dropGrad;
      ctx.shadowBlur = size * 3;

      ctx.beginPath();
      // Teardrop: pointed top, round bottom
      ctx.moveTo(x + wx, fy - bh * 0.5);
      ctx.bezierCurveTo(
        x + wx - bw * 0.15, fy - bh * 0.2,
        x + wx - bw, fy + bh * 0.15,
        x + wx - bw * 0.7, fy + bh * 0.4
      );
      ctx.quadraticCurveTo(x + wx, fy + bh * 0.65, x + wx + bw * 0.7, fy + bh * 0.4);
      ctx.bezierCurveTo(
        x + wx + bw, fy + bh * 0.15,
        x + wx + bw * 0.15, fy - bh * 0.2,
        x + wx, fy - bh * 0.5
      );
      ctx.fill();
    }
  }
}

export function LavaDrips() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Check reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas || !parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    resize();
    window.addEventListener("resize", resize);

    // Init drips with staggered starts
    const drips: Drip[] = [];
    for (let i = 0; i < 6; i++) {
      const d = makeDrip(w);
      d.t = -i * 1.2; // negative = waiting to start
      drips.push(d);
    }

    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const ctx = canvas!.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const d of drips) {
        // Waiting phase
        if (d.t < 0) {
          d.t += dt;
          continue;
        }

        if (d.phase === "forming") {
          d.t += dt / d.formDuration;
          if (d.t >= 1) {
            d.t = 0;
            d.phase = "stretching";
          }
        } else if (d.phase === "stretching") {
          d.t += dt / d.stretchDuration;
          if (d.t >= 1) {
            d.t = 0;
            d.phase = "necking";
          }
        } else if (d.phase === "necking") {
          d.t += dt / d.neckDuration;
          if (d.t >= 1) {
            d.phase = "falling";
            d.t = 0;
            d.fallY = d.size * 7;
            d.fallV = 40;
          }
        } else if (d.phase === "falling") {
          d.t += dt * 0.4;
          d.fallV += 280 * dt; // gravity
          d.fallY += d.fallV * dt;
          if (d.fallY > h + 40) {
            // Reset
            Object.assign(d, makeDrip(w));
          }
        }

        drawDrip(ctx, d, h);
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
