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
  color: string;
  size: number;
  shape: "rect" | "circle";
  gravity: number;
  opacity: number;
  drag: number;
}

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#FF1493",
  "#FFD700",
  "#00FF7F",
  "#FF4500",
  "#1E90FF",
  "#FF69B4",
  "#7FFF00",
  "#FF8C00",
];

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
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 6 + Math.random() * 9,
          shape: Math.random() > 0.5 ? "rect" : "circle",
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
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 5 + Math.random() * 7,
          shape: Math.random() > 0.5 ? "rect" : "circle",
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
    createBurst(w / 2, h / 2, 180);
    timeouts.push(setTimeout(() => createBurst(w * 0.15, h * 0.35, 140), 150));
    timeouts.push(setTimeout(() => createBurst(w * 0.85, h * 0.35, 140), 250));
    timeouts.push(setTimeout(() => createBurst(w * 0.5, h * 0.15, 150), 400));
    timeouts.push(setTimeout(() => createBurst(w * 0.1, h * 0.65, 120), 600));
    timeouts.push(setTimeout(() => createBurst(w * 0.9, h * 0.65, 120), 700));
    timeouts.push(setTimeout(() => createBurst(w * 0.3, h * 0.8, 120), 900));
    timeouts.push(setTimeout(() => createBurst(w * 0.7, h * 0.8, 120), 1000));
    timeouts.push(setTimeout(() => createBurst(w / 2, h / 2, 160), 1300));

    // Pluie continue de confettis pendant quelques secondes
    for (let i = 0; i < 25; i++) {
      timeouts.push(setTimeout(() => createRain(18), i * 180));
    }

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
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
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
