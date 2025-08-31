"use client"; //intéractivité côté client

import React, { useState, useEffect } from "react";
/*import { getTasks, updateTaskStatus } from "../lib/airtableApi";*/
import Link from "next/link";
import { getTasks } from "@/lib/airtableApi"; 

type Task = {
  id: string;
  fields: {
    Titre: string;
    Statuts: string;
  };
};

export default function Home() {
  /*Variable*/

  const nom = "Elyyy"
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showRest, setShowRest] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const data = await getTasks();
      console.log("Données reçues d'Airtable :", data);
      setTasks(data);
    }
    fetchTasks();
  }, []); // Récupération des tâches depuis Airtable

  /*Fonction JSX*/

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRest(true);
    }, 3245); 

    return () => clearTimeout(timer);
  }, []); //Effet de montage

  function envoiMessagePerso() {
    setConfirmation("Message personnalisé envoyé !");
    setShowModal(false);
    setMessage("");
    setTimeout(()=> setConfirmation(""), 3000);
  }
  
  function envoiMessageDefaut() {
    setConfirmation("Accusé de réception envoyé !");
    setShowModal(false);
    setTimeout(() => setConfirmation(""), 3000); // Efface après 3s
  }

  
  return (
  <>
        <nav className="w-50% bg-sky-700 text-white flex justify-center  py-4 shadow">
      <ul className="flex gap-20">
        <li>
          <Link href="/" className="font-bold hover:underline active:underline-offset-8">Accueil</Link>
        </li>
        <li>
          <Link href="/rappels" className="font-bold hover:underline">Mes rappels</Link>
        </li>
      </ul>
    </nav>
    
      
      <main className=" bg-gradient-to-t from-orange-300 to-sky-300 sm:from-orange-200 sm:to-sky-200 min-h-screen rounded-lg shadow-lg flex items-center justify-center text-gray-700">
    <div className="hover:bg-indigo-200 font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 m-8 bg-red rounded-lg shadow-lg shadow-blue-500/50 border-2 border-blue-300 w-50% sm:w-3/4 lg:w-1/2">
      
      { !showRest && (
        <>
      <h2 className="animate-bounce"> Coucouu {nom} 👋!</h2>
      <p className="animate-bounce">J&lsquo;espère que tu vas bien 😊</p>
         </>
         )}
         {showRest && (
        <>
      <p>Si tu es ici c&apos;est que tu as reçu mon rappel ! 😉😝😄</p>
      <ul className="space-y-2">
        {(Array.isArray(tasks) ? tasks : []).map((task: Task) => (
          <li key={task.id} className="p-4 border rounded">
            <p><strong>{task.fields.Titre}</strong></p>
            <p>Statut : {task.fields.Statuts}</p>
          </li>
        ))}
      </ul>
      <p> Fais-moi signe de sa bonne réception, via ces boutons 👇😉</p>
    

    <div className="flex gap-8 items-center flex-col sm:flex-row">
      <button type="button" onClick={envoiMessageDefaut} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-300 transition-sm delay-150 duration-400 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-300 active:scale-95 ">Ok je l&apos;ai</button>
      <button type="button" onClick={() => setShowModal(true)} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-blue-300 transition delay-150 duration-400 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-300 active:scale-95"> Personnaliser</button>
    </div>
    
    </>
   ) }
    
    
    {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-indigo-200 p-8 rounded-3xl border-b-blue-500 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold">Un petit mot pour moi ? 👇😊</h3>
            <textarea
              name="messagePerso"
              id="messagePerso"
              placeholder="Ton message..."
              className="border p-2 rounded"
              value={message}
              onChange={e => setMessage(e.target.value)}
            ></textarea>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>
              <button
                onClick={envoiMessagePerso}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-100 text-green-700 font-bold px-6 py-4 rounded shadow-lg animate-fade-in">
        {confirmation}
          </div>
        </div>
      )}
    </div> 
  </main>

</>
    
    );
}

/*Récupérer le message perso en le stockant dans une variable -> faire une requête POST à airtable pour l'enregistrement
-> l'enregister dans la colonne ayant le même id que la task-> Récupérer l'id de la task dans l'url (paramètre)
-> Définir le statut de la task en Reçu
-> Notifier via n8n vers pushover */

/*Ajouter un bouton pour envoyer le message par défaut (ok je l'ai) -> définir le statut de la task en Reçu
-> Notifier via n8n vers pushover 
Donc en cliquant sur le bouton Ok je l'ai, cela génère un envoi de message vers airtable-> définit le statut de la task en reçe
-> Notifier via n8n vers pushover*/
