import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pour mettre à jour les informations de l'utilisateur.
 * Appelle le backend Laravel : PUT /users/{id}/user-info
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        const body = await req.json();
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const apiResponse = await fetch(`${process.env.API_BASE}/users/${userId}/user-info`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader
            },
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

/**
 * Proxy pour récupérer les informations de l'utilisateur (si besoin).
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        const apiResponse = await fetch(`${process.env.API_BASE}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': authHeader
            },
        });

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