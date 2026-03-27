import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        
        const response = await fetch(new URL('api/pdfs', apiUrl).toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP backend: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[API PDFs GET] Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
