import { NextResponse } from 'next/server';

/**
 * Proxy server-side vers Laravel POST /api/aides/fill-pdf
 * Évite les problèmes CORS en passant par le serveur Next.js.
 * Retourne le JSON avec pdf_base64 + filename.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const url = new URL('api/aides/fill-pdf', apiUrl);

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.json(
                { success: false, message: data.message || `Erreur Laravel ${response.status}`, error: data.error },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error('[fill-pdf proxy] Erreur:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur interne du proxy.', error: error.message },
            { status: 500 }
        );
    }
}
