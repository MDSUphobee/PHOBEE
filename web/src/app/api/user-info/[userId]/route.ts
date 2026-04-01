import { NextRequest, NextResponse } from 'next/server';

// On définit le type pour Next.js 16 (params est une Promise)
type RouteContext = {
    params: Promise<{ userId: string }>
};

export async function GET(req: NextRequest, { params }: RouteContext) {
    try {
        // CRUCIAL : On attend que les paramètres soient résolus
        const resolvedParams = await params;
        const userId = resolvedParams.userId;

        const apiResponse = await fetch(`${process.env.API_BASE}/user-info/${userId}`);
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Erreur proxy user-info GET:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    try {
        const body = await req.json();
        
        // CRUCIAL : On attend aussi ici
        const resolvedParams = await params;
        const userId = resolvedParams.userId;

        const apiResponse = await fetch(`${process.env.API_BASE}/user-info/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Erreur proxy user-info PUT:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}