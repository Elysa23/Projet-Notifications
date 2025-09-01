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
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/rappels-detailed');
        const result = await res.json();
        
        if (result.success) {
          setTasks(result.data);
        } else {
          setError(result.error || "Erreur lors du chargement des rappels");
        }
      } catch (err) {
        setError("Erreur lors du chargement des rappels");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
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
          
          {loading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Chargement...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
                             {tasks.length === 0 ? (
                 <div className="text-center">
                   <p className="text-gray-600 text-lg">🎉 Aucun rappel envoyé pour le moment !</p>
                   <p className="text-gray-500 mt-2">Toutes vos tâches sont à jour.</p>
                 </div>
               ) : (
                 <div className="w-full">
                                       <h2 className="text-xl font-semibold mb-4 text-center">
                      Mes Rappels ({tasks.length})
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Tâches envoyées et confirmées
                    </p>
                   <div className="space-y-3">
                     {tasks.map((task, index) => (
                                               <div 
                          key={task.id}
                          className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                            task.statut === "Reçu"
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full mr-3 ${
                                task.statut === "Reçu"
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="text-gray-800 font-medium">{task.titre}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {task.statut === "Reçu" && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  ✅ Confirmé
                                </span>
                              )}
                              {task.statut === "Envoyée" && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                  📤 Envoyé
                                </span>
                              )}
                            </div>
                          </div>
                          {task.statut === "Reçu" && (
                            <div className="mt-2 text-sm text-green-600">
                              <em>"Super, merci !"</em>
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-500">
                            Statut: <span className="font-medium">{task.statut}</span>
                          </div>
                        </div>
                     ))}
                   </div>
                 </div>
               )}
            </>
          )}

          <div className="mt-8">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
