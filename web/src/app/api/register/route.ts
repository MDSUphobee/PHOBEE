import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const apiBaseRaw = process.env.API_BASE;
        if (!apiBaseRaw) {
            return NextResponse.json(
                { message: 'Configuration manquante: API_BASE' },
                { status: 500 }
            );
        }

        const apiBase = apiBaseRaw.replace(/\/+$/, '');
        const backendUrl = `${apiBase}/register`;

        const apiResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const rawText = await apiResponse.text();
        let data: any = null;
        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch {
            data = {
                message: 'Réponse non-JSON reçue depuis le backend',
                backendUrl,
                status: apiResponse.status,
                statusText: apiResponse.statusText,
                bodyPreview: rawText?.slice(0, 500),
            };
        }

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }
        
        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        console.error("Erreur proxy signup:", err);
        // console.log('API_BASE:', process.env.API_BASE);
        return NextResponse.json(
            { message: "Erreur serveur", error: err.message },
            { status: 500 }
        );
    }
}
