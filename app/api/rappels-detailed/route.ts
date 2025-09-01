import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME || !process.env.AIRTABLE_API_KEY) {
      throw new Error("Variables d'environnement Airtable manquantes. Vérifiez votre fichier .env.local");
    }

    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;
    
    // Récupérer les tâches avec le statut "Envoyée" OU "Reçu" ET les champs Titre et AR
    const filterFormula = 'OR(Statuts="Envoyée", Statuts="Reçu")';
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}&fields[]=Titre&fields[]=AR&fields[]=Statuts`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erreur API Airtable: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.records) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Transformer les données pour inclure le statut AR et le statut
    const tasks = data.records.map((record: any) => ({
      id: record.id,
      titre: record.fields?.Titre || "Titre non défini",
      ar: record.fields?.AR || null,
      hasAR: !!record.fields?.AR,
      statut: record.fields?.Statuts || "Inconnu"
    }));

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Erreur API rappels-detailed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}
