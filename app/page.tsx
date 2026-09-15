"use client";

import { useState } from "react";
import Wheel from "./components/Wheel";

export default function Home() {
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

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

  return (
    <div className="flex flex-col flex-1 font-sans min-h-screen">
      <main className="flex flex-1 gap-8 py-8 px-6 max-w-7xl mx-auto w-full">
        {/* Colonne gauche - Liste de noms */}
        <div className="spidey-card flex-1 flex flex-col gap-8 rounded-lg shadow-lg p-6">
          <h1 className="font-comic text-5xl text-[var(--spidey-red)] drop-shadow-[2px_2px_0_rgba(27,27,100,0.8)]">
            🕸️ La Toile des Noms
          </h1>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addName()}
              placeholder="Ajouter un nouveau nom"
              className="flex-1 px-4 py-2 border-2 border-[var(--spidey-blue-light)] rounded-lg bg-black/40 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--spidey-red)]"
            />
            <button
              onClick={addName}
              className="px-6 py-2 bg-[var(--spidey-red)] text-white rounded-lg hover:bg-red-700 transition-colors font-bold border-2 border-[var(--spidey-blue-light)]"
            >
              Ajouter
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {names.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">
                Aucun nom dans la liste
              </p>
            ) : (
              names.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-black/40 border border-[var(--spidey-blue-light)]/50 rounded-lg"
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
                        className="flex-1 px-3 py-1 border border-[var(--spidey-red)] rounded bg-black/60 text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(index)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Valider
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-zinc-600 text-white text-sm rounded hover:bg-zinc-500"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-lg text-white">
                        🕷️ {name}
                      </span>
                      <button
                        onClick={() => startEditing(index)}
                        className="px-3 py-1 bg-[var(--spidey-blue-light)] text-white text-sm rounded hover:bg-blue-700"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => deleteName(index)}
                        className="px-3 py-1 bg-[var(--spidey-red)] text-white text-sm rounded hover:bg-red-700"
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
        <Wheel names={names} />
      </main>
    </div>
  );
}
