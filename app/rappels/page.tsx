"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { markTaskAsCompleted } from "@/lib/airtableApi";


//Structure de données d'une tâche
type Task = {
  id: string;
  fields: {
    Titre: string;
    Statuts: string;
    AR: string;
  };
};

export default function RappelsPage() {
  const [tasks, setTasks] = useState<Array<{
    id: string;
    titre: string;
    // ar: string | null;
    // hasAR: boolean;
    // statut: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {

    try {
      const res = await fetch('/api/received-tasks');
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);

      if (data.success && Array.isArray(data.data)) {
        setTasks(data.data.map((task: Task) => ({
          id: task.id,
          titre: task.fields.Titre ?? "",
          //  ar: task.fields.AR ?? null,
          //  hasAR: !!task.fields.AR,
          // statut: task.fields.Statuts ?? "",
        })));
      } else {
        setTasks([]);
        setError("Aucune tâche reçue.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue");
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  const completeTask = async (id: string) => {
    try {
      const res = await fetch('/api/completed-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (res!.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
    }
    catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };


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

      <main className="bg-[linear-gradient(105deg,rgba(163,213,255,1)_11.3%,rgba(6,153,153,1)_86.7%)] contrast-127 min-h-screen rounded-lg shadow-lg flex items-center justify-center text-slate-800">
        <div className="hover:bg-cyan-500 font-sans flex flex-col items-center justify-center min-h-screen p-4 pb-20 gap-8 sm:p-20 m-8 rounded-lg shadow-lg shadow-blue-500/50 border-2 border-blue-300 w-50% sm:w-3/4 lg:w-1/2">

          <h1 className="text-3xl font-semibold text-center mb-8 mt-2">📋 Mes Rappels</h1>

          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <ul className="flex flex-col gap-6">
              {loading && <p className="animate-pulse">Chargement des tâches...</p>}
              {!loading && tasks.length === 0 && !error && <p>Aucune tâche reçue.</p>}
              {tasks.map((task) => (
                <>
                  <div className="flex flex-row justify-between items-center gap-6 border-emerald-600 border-2 rounded-3xl p-2 hover:border-cyan-300 hover:shadow-xl sm:active:border-cyan-300" key={task.id}>
                    <li key={task.id} className="p-4 mb-2 max-w-fit">
                      <p className="font-bold">{task.titre}</p>
                    </li>

                    <button onClick={() => completeTask(task.id)} className="bg-emerald-600 px-4 py-2 h-fit rounded-2xl text-amber-50 font-normal hover:scale-110 hover:bg-emerald-400" > Terminer</button>
                  </div >
                </>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <button onClick={fetchTasks} className="bg-blue-700 hover:bg-blue-600 hover:scale-110  text-amber-50 font-normal py-2 px-4 rounded-4xl transition-color"> Rafraîchir</button>
          </div>
        </div>
      </main >
    </>
  );

}