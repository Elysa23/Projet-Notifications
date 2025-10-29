"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";


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
  const [confirmation, setConfirmation] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
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
        console.log('Tâches reçues:', data.data);
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

  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/completed-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId })
      });

      const json = await res.json();
      if (!res.ok) {
        console.error('Erreur serveur /api/completed-tasks:', json);
        throw new Error(json?.error || `Erreur HTTP: ${res.status}`);
      }

      console.log('Tâche terminée avec succès:', json);
      // Rafraîchir la liste des tâches après la mise à jour
      await fetchTasks();

      if (res) {
        //alert(`Tâche terminée avec succès !`);
        setConfirmation("Tâche marquée comme terminée avec succès !");
        setTimeout(() => setConfirmation(""), 4000);
      }
      else {
        setError("Erreur lors de la mise à jour de la tâche.");
      }
    } catch (error) {
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

      <main className="bg-[linear-gradient(105deg,rgba(163,213,255,1)_11.3%,rgba(6,153,153,1)_86.7%)] contrast-127 min-h-screen rounded-lg shadow-lg flex items-center justify-center flex-col text-slate-800">

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold text-center mb-8 mt-2">📋 Mes Rappels</h1>
        </div>

        <div className="hover:bg-cyan-500 font-sans flex flex-col items-center justify-center min-h-screen p-4 pb-20 gap-8 sm:p-20 m-8 rounded-lg shadow-lg shadow-blue-500/50 border-2 border-blue-300 w-50% sm:w-3/4 lg:w-1/2">


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

                <div className="flex flex-row justify-between items-center gap-6 border-emerald-600 border-2 rounded-3xl p-2 hover:border-cyan-300 hover:shadow-xl sm:active:border-cyan-300" key={task.id}>
                  <li key={task.id} className="p-4 mb-2 max-w-fit">
                    <p className="font-bold">{task.titre}</p>
                  </li>

                  <button onClick={() => completeTask(task.id)} className="bg-emerald-600 px-4 py-2 h-fit rounded-2xl text-amber-50 font-normal hover:scale-110 hover:bg-emerald-400" > Terminer</button>
                  {confirmation && (

                    <div className="fixed top-5 right-5 flex items-center justify-center x-100 y-100 z-200 pointer-events-none">
                      <div className="bg-green-200 text-green-700 font-bold px-6 py-4 rounded-xl shadow-lg animate-fade-in">
                        {confirmation}
                      </div>
                    </div>
                  )}
                </div >



              ))}
            </ul>
          </div>

          <div className="mt-5">
            <button onClick={fetchTasks} className="bg-blue-700 shadow-md shadow-blue-500 border-blue-300 border hover:bg-blue-600 hover:scale-110  text-amber-50 font-normal py-2 px-4 rounded-4xl transition-color"> Rafraîchir</button>
          </div>
        </div>
      </main >
    </>
  );

}