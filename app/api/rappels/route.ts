import { NextResponse } from 'next/server';
import { getEnvoyeeTitles } from '../../../lib/airtableApi';

export async function GET() {
  try {
    const titles = await getEnvoyeeTitles();
    return NextResponse.json({ success: true, data: titles });
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}
