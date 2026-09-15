"use client";

import Confetti from "./Confetti";

interface WinnerModalProps {
  winner: string;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <Confetti active />

      <div
        className="winner-card relative flex flex-col items-center gap-4 rounded-3xl px-14 py-12 text-center shadow-2xl border-4"
        style={{
          background:
            "linear-gradient(160deg, #8B0000 0%, #E23636 45%, #1B1B64 100%)",
          borderColor: "#0a0a0a",
          boxShadow: "0 0 0 4px #2D4BD9 inset, 0 20px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl font-bold text-white/80 transition-colors hover:text-white"
          aria-label="Fermer"
        >
          ✕
        </button>
        <div className="text-6xl">🕷️🕸️🕷️</div>
        <h2 className="font-comic text-4xl uppercase tracking-wide text-white drop-shadow-lg">
          Pris dans la toile !
        </h2>
        <p className="font-comic max-w-xl break-words text-6xl text-white drop-shadow-lg">
          {winner}
        </p>
        <p className="text-xl font-semibold text-white/90">
          a été choisi par la Toile !
        </p>
      </div>
    </div>
  );
}
