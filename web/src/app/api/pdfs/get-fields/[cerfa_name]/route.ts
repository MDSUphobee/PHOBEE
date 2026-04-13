import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cerfa_name: string }> }
) {
  try {
    // 1. On attend la promesse des paramètres (obligatoire en Next 15+)
    const resolvedParams = await params;
    const cerfaName = decodeURIComponent(resolvedParams.cerfa_name);

    if (cerfaName === 'undefined' || !cerfaName) {
      return Response.json({ error: 'Nom de cerfa invalide' }, { status: 400 });
    }

    // 2. Appel à ton Laravel
    // On nettoie la variable pour enlever d'éventuels "/" terminaux ou "/api" déjà inclus
    const rawApiUrl = process.env.API_URL || 'http://127.0.0.1:8000';
    const baseUrl = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    
    const fullUrl = `${baseUrl}/api/pdfs/get-fields/${encodeURIComponent(cerfaName)}`;
    console.log("[Proxy] Fetching from:", fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store', // Important pour ne pas garder en cache les champs
    });

    if (!response.ok) {
        const text = await response.text();
        return Response.json({ error: `Laravel error ${response.status}`, detail: text }, { status: response.status });
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
