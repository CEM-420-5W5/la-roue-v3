"use client";

import { useState } from "react";

export default function Home() {
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const addName = () => {
    if (inputValue.trim()) {
      setNames([...names, inputValue.trim()]);
      setInputValue("");
    }
  };

  const deleteName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(names[index]);
  };

  const saveEdit = (index: number) => {
    if (editingValue.trim()) {
      const updatedNames = [...names];
      updatedNames[index] = editingValue.trim();
      setNames(updatedNames);
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const spinWheel = () => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    const spins = 5 + Math.random() * 5;
    const randomIndex = Math.floor(Math.random() * names.length);
    const segmentAngle = 360 / names.length;
    const finalRotation =
      spins * 360 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation(finalRotation);
    setSelectedName(names[randomIndex]);

    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 gap-8 py-8 px-6 max-w-7xl mx-auto w-full">
        {/* Colonne gauche - Liste de noms */}
        <div className="flex-1 flex flex-col gap-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Liste de Noms
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addName()}
              placeholder="Ajouter un nouveau nom"
              className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addName}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Ajouter
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {names.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
                Aucun nom dans la liste
              </p>
            ) : (
              names.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                >
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && saveEdit(index)
                        }
                        className="flex-1 px-3 py-1 border border-blue-500 rounded dark:bg-zinc-700 dark:text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(index)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Valider
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-zinc-400 text-white text-sm rounded hover:bg-zinc-500"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-lg text-black dark:text-white">
                        {name}
                      </span>
                      <button
                        onClick={() => startEditing(index)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => deleteName(index)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne droite - Roue de la chance */}
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
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              className={`transition-transform ${
                isSpinning ? "" : "cursor-pointer hover:opacity-90"
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center",
                transitionDuration: isSpinning ? "3s" : "0s",
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

                const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const textAngle =
                  (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
                const textRadius = 95;
                const textX = centerX + textRadius * Math.cos(textAngle);
                const textY = centerY + textRadius * Math.sin(textAngle);
                const rotation = (index * segmentAngle + segmentAngle / 2 - 90);

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={colors[index % colors.length]}
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
                        transform: `rotate(${rotation}deg)`,
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
        </div>
      </main>
    </div>
  );
}
