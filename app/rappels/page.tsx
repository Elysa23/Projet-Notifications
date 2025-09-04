"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// L'API est maintenant appelée via fetch

export default function RappelsPage() {
  const [tasks, setTasks] = useState<Array<{
    id: string;
    titre: string;
    ar: string | null;
    hasAR: boolean;
    statut: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Désactivé: l'API interne a été supprimée
    setLoading(false);
    setTasks([]);
    setError("Chargement désactivé (Développement en cours)");
  }, []);

  return (
    <>
      <nav className="w-50% bg-blue-800 text-white flex justify-center py-4 shadow">
        <ul className="flex gap-20">
          <li>
            <Link href="/" className="font-bold hover:underline">Accueil</Link>
          </li>
          <li>
            <Link href="/rappels" className="font-bold hover:underline active:underline-offset-8">Mes rappels</Link>
          </li>
        </ul>
      </nav>

      <main className="bg-gradient-to-t from-indigo-400 to-blue-200 min-h-screen rounded-lg shadow-lg flex items-center justify-center text-slate-900">
        <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 m-8 bg-white rounded-lg shadow-lg shadow-blue-500/50 border-2 border-blue-300 w-50% sm:w-3/4 lg:w-1/2">
          
          <h1 className="text-3xl font-bold text-center mb-8">📋 Mes Rappels</h1>
          
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mt-8">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
