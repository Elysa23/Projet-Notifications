import { NextResponse } from 'next/server';
import { addAR } from '../../../lib/airtableApi';

export async function POST() {
  try {
    const result = await addAR();
    return NextResponse.json({ 
      success: true, 
      message: result.message,
      updatedTasks: result.updatedTasks 
    });
  } catch (error) {
    console.error('Erreur API addAR:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}
