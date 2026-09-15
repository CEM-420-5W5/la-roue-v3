"use client";

import { useEffect, useRef } from "react";
import confetti, { type CreateTypes } from "canvas-confetti";

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    instanceRef.current = myConfetti;

    // Formes "toile" et "araignée" pré-rasterisées une seule fois,
    // beaucoup plus rapide que de redessiner un emoji à chaque frame.
    const shapes = [
      confetti.shapeFromText({ text: "🕸️", scalar: 4 }),
      confetti.shapeFromText({ text: "🕷️", scalar: 4 }),
    ];

    const commonOptions = {
      shapes,
      scalar: 2.5,
      gravity: 0.7,
      ticks: 250,
      disableForReducedMotion: true,
    };

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const burst = (x: number, y: number, particleCount: number) => {
      myConfetti({
        ...commonOptions,
        particleCount,
        spread: 360,
        startVelocity: 45,
        origin: { x, y },
      });
    };

    // Grosses explosions à répétition partout à l'écran
    burst(0.5, 0.5, 80);
    timeouts.push(setTimeout(() => burst(0.15, 0.35, 60), 150));
    timeouts.push(setTimeout(() => burst(0.85, 0.35, 60), 250));
    timeouts.push(setTimeout(() => burst(0.5, 0.15, 60), 400));
    timeouts.push(setTimeout(() => burst(0.1, 0.65, 60), 600));
    timeouts.push(setTimeout(() => burst(0.9, 0.65, 60), 700));
    timeouts.push(setTimeout(() => burst(0.3, 0.8, 60), 900));
    timeouts.push(setTimeout(() => burst(0.7, 0.8, 60), 1000));
    timeouts.push(setTimeout(() => burst(0.5, 0.5, 100), 1300));

    // Pluie continue de confettis pendant quelques secondes
    for (let i = 0; i < 12; i++) {
      timeouts.push(
        setTimeout(() => {
          myConfetti({
            ...commonOptions,
            particleCount: 20,
            spread: 100,
            startVelocity: 25,
            origin: { x: Math.random(), y: -0.1 },
            angle: 270,
            gravity: 0.9,
          });
        }, i * 250)
      );
    }

    return () => {
      timeouts.forEach(clearTimeout);
      myConfetti.reset();
      instanceRef.current = null;
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
