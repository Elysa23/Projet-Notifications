// 
//lib/airtableApi.ts


const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

// Types Airtable
interface AirtableRecordFields {
  Titre?: string;
  Statuts?: string;
  AR?: string;
}

interface AirtableRecord {
  id: string;
  fields: AirtableRecordFields;
}

type AirtableListResponse = { records: AirtableRecord[] };


// Enregistrement de l'AR dans la colonne AR de Airtable

   // 1. Récupération des données dont Statuts = Envoyée 

export async function addAr(): Promise<AirtableRecord[]> {
  try {
    // Vérifier les variables d'environnement
    if (!process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME || !process.env.AIRTABLE_API_KEY) {
      throw new Error("Variables d'environnement manquantes");
    }

    const urlToRecup = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent('Statuts="Envoyée"')}`;
    const res = await fetch(urlToRecup, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erreur Airtable: ${res.status} ${res.statusText}`);
    }

    const data: AirtableListResponse = await res.json();
    return data.records;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'AR dans Airtable:', error);
    return [];
  }
}


      // 2. Mise à jour de chaque tâche pour ajouter l'AR et changer le statut
      export async function updateTaskWithAr() {
        try {
          if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
            throw new Error("Variables d'environnement manquantes");
          }

          const records = await addAr();

          if (!records || records.length === 0) {
            console.log('Aucune tâche à mettre à jour avec AR.');
            return [];
          }

          const updatePromises = records.map(async (record: AirtableRecord) => {
            const updateUrl = `${AIRTABLE_API_URL}/${record.id}`;
            const updateData = {
              fields: {
                AR: 'Super, merci !',
                Statuts: 'Reçue',
              },
            };
            
            console.log('Tentative de mise à jour:', {
              recordId: record.id,
              currentFields: record.fields,
              updateData: updateData
            });
            
            const res = await fetch(updateUrl, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData),
            });

            if (!res.ok) {
              const errorText = await res.text();
              console.error('Erreur détaillée Airtable:', {
                status: res.status,
                statusText: res.statusText,
                errorBody: errorText,
                recordId: record.id,
                updateData: updateData
              });
              throw new Error(`Erreur Airtable: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const result = await res.json();
            console.log('Tâche mise à jour avec AR:', result);
            return result;
          });

          const taskUpdates = await Promise.all(updatePromises);
          return taskUpdates;
        } catch (error) {
          console.error("Erreur lors de la mise à jour des tâches avec AR:", error);
          return [];
        }
      }