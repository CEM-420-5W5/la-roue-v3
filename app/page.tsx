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
        <Wheel names={names} />
      </main>
    </div>
  );
}
