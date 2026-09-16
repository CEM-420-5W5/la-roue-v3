"use client";

import { useState } from "react";
import WinnerModal from "./WinnerModal";

const COLORS = [
  "#E23636",
  "#1B1B64",
  "#0A0A0A",
  "#2D4BD9",
  "#8B0000",
  "#111133",
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
    console.log("Random index:", randomIndex, "Segment angle:", segmentAngle);
    // Angle (dans le repère du SVG, sens horaire depuis 3h) du centre du segment choisi.
    let randomVariationOfTheInsideOfTheSegment = Math.random() * segmentAngle
    const targetCenter = randomIndex * segmentAngle + randomVariationOfTheInsideOfTheSegment;
    // La flèche pointe vers le haut de la roue, soit 270° dans ce repère.
    const target = (((270 - targetCenter) % 360) + 360) % 360;
    // On tient compte de la rotation déjà accumulée pour viser le bon angle absolu.
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((target - currentMod) % 360 + 360) % 360;

    const spins = 5 + Math.ceil(Math.random()) * 5;
    console.log("Spins:", spins);
    const finalRotation = rotation + spins * 360 + delta;
    
    console.log("Target center:", targetCenter, "Target:", target, "Current mod:", currentMod, "Delta:", delta, "Final rotation:", finalRotation);

    setRotation(finalRotation);
    setSelectedName("???");

    setTimeout(() => {
      setIsSpinning(false);
      setResultId((id) => id + 1);
      setShowModal(true);
      setSelectedName(names[randomIndex]);
    }, 3000);
  };

  return (
    <div className="spidey-card flex flex-col items-center justify-center gap-8 rounded-lg shadow-lg p-6 flex-1">
      <h2 className="font-comic text-4xl text-[var(--spidey-red)] drop-shadow-[2px_2px_0_rgba(27,27,100,0.8)]">
        🕸️ Roue de la Toile
      </h2>

      {/* Flèche */}
      <div className="relative h-12 flex items-center justify-center">
        <div className="text-4xl text-[var(--spidey-red)]">▼</div>
      </div>

      {/* Roue */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {names.length === 0 ? (
          <p className="text-zinc-400 text-center">
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
                    stroke="#e5e5e5"
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
              fill="#e5e5e5"
              stroke="var(--spidey-red)"
              strokeWidth="3"
            />
            <text
              x="160"
              y="165"
              textAnchor="middle"
              fill="var(--spidey-red)"
              fontSize="12"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              🕷️
            </text>
          </svg>
        )}
      </div>

      {/* Nom sélectionné */}
      {selectedName && (
        <div className="text-center">
          <p className="text-zinc-400">Sélectionné :</p>
          <p className="font-comic text-4xl text-[var(--spidey-red)]">
            {selectedName}
          </p>
        </div>
      )}

      {/* Bouton pour spin manuel */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || names.length === 0}
        className="px-8 py-3 bg-gradient-to-r from-[var(--spidey-red)] to-[var(--spidey-blue-light)] text-white font-bold rounded-lg border-2 border-white/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSpinning ? "En rotation..." : "🕸️ Faire tourner 🕸️"}
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
