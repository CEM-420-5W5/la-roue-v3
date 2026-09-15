"use client";

import { useState } from "react";
import WinnerModal from "./WinnerModal";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

interface WheelProps {
  names: string[];
}

export default function Wheel({ names }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resultId, setResultId] = useState(0);

  const spinWheel = () => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    setShowModal(false);

    const randomIndex = Math.floor(Math.random() * names.length);
    const segmentAngle = 360 / names.length;
    // Angle (dans le repère du SVG, sens horaire depuis 3h) du centre du segment choisi.
    const targetCenter = randomIndex * segmentAngle + segmentAngle / 2;
    // La flèche pointe vers le haut de la roue, soit 270° dans ce repère.
    const target = (((270 - targetCenter) % 360) + 360) % 360;
    // On tient compte de la rotation déjà accumulée pour viser le bon angle absolu.
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((target - currentMod) % 360 + 360) % 360;

    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + spins * 360 + delta;

    setRotation(finalRotation);
    setSelectedName(names[randomIndex]);

    setTimeout(() => {
      setIsSpinning(false);
      setResultId((id) => id + 1);
      setShowModal(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 flex-1">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Roue de la Chance
      </h2>

      {/* Flèche */}
      <div className="relative h-12 flex items-center justify-center">
        <div className="text-4xl">▼</div>
      </div>

      {/* Roue */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {names.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center">
            Ajoutez des noms pour créer la roue
          </p>
        ) : (
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            className={
              isSpinning ? "" : "cursor-pointer hover:opacity-90"
            }
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center",
              transitionDuration: isSpinning ? "3s" : "0s",
              transitionProperty: "transform",
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            onClick={spinWheel}
          >
            {names.map((name, index) => {
              const segmentAngle = 360 / names.length;
              const startAngle = (index * segmentAngle * Math.PI) / 180;
              const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;
              const radius = 150;
              const centerX = 160;
              const centerY = 160;

              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              const pathData =
                names.length === 1
                  ? `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${
                      centerX - 0.01
                    } ${centerY - radius} Z`
                  : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

              const textAngle =
                (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
              const textRadius = 95;
              const textX = centerX + textRadius * Math.cos(textAngle);
              const textY = centerY + textRadius * Math.sin(textAngle);
              const textRotation =
                index * segmentAngle + segmentAngle / 2 - 90;

              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    style={{
                      transform: `rotate(${textRotation}deg)`,
                      transformOrigin: `${textX}px ${textY}px`,
                      pointerEvents: "none",
                    }}
                  >
                    {name}
                  </text>
                </g>
              );
            })}

            {/* Cercle central */}
            <circle
              cx="160"
              cy="160"
              r="25"
              fill="white"
              stroke="#333"
              strokeWidth="2"
            />
            <text
              x="160"
              y="165"
              textAnchor="middle"
              fill="#333"
              fontSize="12"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              SPIN
            </text>
          </svg>
        )}
      </div>

      {/* Nom sélectionné */}
      {selectedName && (
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Sélectionné :</p>
          <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
            {selectedName}
          </p>
        </div>
      )}

      {/* Bouton pour spin manuel */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || names.length === 0}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSpinning ? "En rotation..." : "Faire tourner"}
      </button>

      {showModal && selectedName && (
        <WinnerModal
          key={resultId}
          winner={selectedName}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
