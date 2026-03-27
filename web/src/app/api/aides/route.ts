import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const url = new URL('api/aides', apiUrl);
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error("Erreur serveur Laravel:", response.status, response.statusText);
            throw new Error(`Erreur HTTP Laravel: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Aides API GET vers Laravel] Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const aideName = body?.filters?.aide_name;

        // Configuration de l'URL du backend Laravel
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const url = new URL('api/aides', apiUrl);
        
        // Laravel attend un paramètre GET "filters[aide_name]" via $request->input('filters.aide_name')
        if (aideName) {
            url.searchParams.append('filters[aide_name]', aideName);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error("Erreur serveur Laravel:", response.status, response.statusText);
            throw new Error(`Erreur HTTP Laravel: ${response.status}`);
        }

        const data = await response.json();
        
        // On retourne la donnée (le tableau ou l'objet filtré par la BDD Laravel)
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Aides API POST vers Laravel] Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
