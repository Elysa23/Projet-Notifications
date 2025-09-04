import {updateTaskWithAr} from "../../../lib/airtableApi";

export async function POST() {
  try {
    // Appeler votre fonction (côté serveur, accès aux variables d'env)
    const result = await updateTaskWithAr();
    
    // Retourner une réponse JSON au client
    return Response.json({ 
      success: true, 
      data: result,
      message: `${result.length} tâches mises à jour avec AR`
    });
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}