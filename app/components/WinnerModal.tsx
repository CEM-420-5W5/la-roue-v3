"use client";

import Confetti from "./Confetti";

interface WinnerModalProps {
  winner: string;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <Confetti active />

      <div
        className="winner-card relative flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 px-14 py-12 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl font-bold text-white/80 transition-colors hover:text-white"
          aria-label="Fermer"
        >
          ✕
        </button>
        <div className="text-6xl">🎉🏆🎉</div>
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg">
          Félicitations !
        </h2>
        <p className="max-w-xl break-words text-5xl font-black text-white drop-shadow-lg">
          {winner}
        </p>
        <p className="text-xl font-semibold text-white/90">
          a gagné la roue de la chance !
        </p>
      </div>
    </div>
  );
}
