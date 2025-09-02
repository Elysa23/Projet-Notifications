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

export async function addAr() {
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

    const data = await res.json();
    return data.records;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'AR dans Airtable:', error);
    return [];
  }
}