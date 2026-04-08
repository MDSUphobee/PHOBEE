import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Configuration de l'URL du backend Laravel
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const url = new URL('api/user-data', apiUrl);

        // Envoyer exactement ce qui est attendu par Laravel
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            console.error("Erreur serveur Laravel sur /api/user-data:", response.status, response.statusText);
            throw new Error(`Erreur HTTP Laravel: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API user-data POST vers Laravel] Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
