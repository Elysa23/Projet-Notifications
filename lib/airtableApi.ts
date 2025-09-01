// 
//lib/airtableApi.ts


const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;




// Récupérer les tâches depuis Airtable dont le statut est "Envoyée"
export async function getEnvoyeeTitles() {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME || !process.env.AIRTABLE_API_KEY) {
    throw new Error("Variables d'environnement Airtable manquantes. Vérifiez votre fichier .env.local");
  }

  const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent('Statuts="Envoyée"')}&fields[]=Titre`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur API Airtable: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  // Vérifier que la réponse contient des records
  if (!data.records) {
    console.warn("Aucun enregistrement trouvé dans la réponse Airtable");
    return [];
  }

  return data.records.map((record: any) => record.fields?.Titre || "Titre non défini");
}


// Mettre à jour toutes les tâches avec le statut "Envoyée" en ajoutant "Super, merci !" dans la colonne AR
export async function addAR() {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME || !process.env.AIRTABLE_API_KEY) {
    throw new Error("Variables d'environnement Airtable manquantes. Vérifiez votre fichier .env.local");
  }

  try {
    // 1. D'abord, récupérer toutes les tâches avec le statut "Envoyée"
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent('Statuts="Envoyée"')}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erreur lors de la récupération des tâches: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.records || data.records.length === 0) {
      console.log("Aucune tâche avec le statut 'Envoyée' trouvée");
      return { success: true, message: "Aucune tâche à mettre à jour" };
    }

    // 2. Mettre à jour chaque tâche en ajoutant "Super, merci !" dans la colonne AR
    const updatePromises = data.records.map(async (record: any) => {
      const updateUrl = `${AIRTABLE_API_URL}/${record.id}`;
      const updateRes = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { 
            AR: "Super, merci !",
            Statuts: "Reçu" // On change le statut en "Reçu" pour indiquer que l'AR a été reçu
          },
        }),
      });

      if (!updateRes.ok) {
        throw new Error(`Erreur lors de la mise à jour de la tâche ${record.id}: ${updateRes.status}`);
      }

      return updateRes.json();
    });

    // 3. Attendre que toutes les mises à jour soient terminées
    const results = await Promise.all(updatePromises);
    
    console.log(`${results.length} tâches mises à jour avec succès`);
    return { 
      success: true, 
      message: `${results.length} tâches mises à jour avec succès`,
      updatedTasks: results.length
    };

  } catch (error) {
    console.error("Erreur dans addAR:", error);
    throw error;
  }
}