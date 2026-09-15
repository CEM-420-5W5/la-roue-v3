"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  shape: "web" | "spider";
  gravity: number;
  opacity: number;
  drag: number;
}

const SHAPES: Particle["shape"][] = ["web", "spider"];
const EMOJI: Record<Particle["shape"], string> = {
  web: "🕸️",
  spider: "🕷️",
};

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createBurst = (originX: number, originY: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 16;
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 25,
          size: 18 + Math.random() * 16,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          gravity: 0.12 + Math.random() * 0.12,
          opacity: 1,
          drag: 0.985,
        });
      }
    };

    const createRain = (count: number) => {
      const w = canvas.width;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 3,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 20,
          size: 16 + Math.random() * 14,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          gravity: 0.08 + Math.random() * 0.08,
          opacity: 1,
          drag: 0.995,
        });
      }
    };

    particlesRef.current = [];
    const w = canvas.width;
    const h = canvas.height;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Grosses explosions à répétition partout à l'écran
    createBurst(w / 2, h / 2, 18);
    timeouts.push(setTimeout(() => createBurst(w * 0.15, h * 0.35, 3), 150));
    timeouts.push(setTimeout(() => createBurst(w * 0.85, h * 0.35, 3), 250));
    timeouts.push(setTimeout(() => createBurst(w * 0.5, h * 0.15, 3), 400));
    timeouts.push(setTimeout(() => createBurst(w * 0.1, h * 0.65, 3), 600));
    timeouts.push(setTimeout(() => createBurst(w * 0.9, h * 0.65, 3), 700));
    timeouts.push(setTimeout(() => createBurst(w * 0.3, h * 0.8, 3), 900));
    timeouts.push(setTimeout(() => createBurst(w * 0.7, h * 0.8, 3), 1000));
    timeouts.push(setTimeout(() => createBurst(w / 2, h / 2, 160), 10));

    // Pluie continue de confettis pendant quelques secondes
    /*for (let i = 0; i < 25; i++) {
      timeouts.push(setTimeout(() => createRain(18), i * 180));
    }*/

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.85) {
          p.opacity -= 0.015;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(EMOJI[p.shape], 0, 0);
        ctx.restore();
      });

      particlesRef.current = particlesRef.current.filter(
        (p) => p.opacity > 0 && p.y < canvas.height + 50
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      timeouts.forEach(clearTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}
