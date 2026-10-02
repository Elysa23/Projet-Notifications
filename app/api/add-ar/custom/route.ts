import { NextRequest } from 'next/server';
import { updateTaskWithArPerso } from '@/lib/airtableApi';

export async function POST(_req: NextRequest) {
  try {
    const _body = await _req.json();
    //const taskId = _body.taskId; On n'a pas encore le taskId depuis pushover pour le moment
    const message = _body.message;

    if (!message) {
      return Response.json({
        success: false,
        error: 'Message manquant'
      }, { status: 400 });
    }

    const result = await updateTaskWithArPerso(message);
    return Response.json({ success: true, data: result });

  }

  catch (error) {
    console.error("Erreur lors de l'ajout de l'AR personnalisé:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, {
      status: 500
    })
  }
}

