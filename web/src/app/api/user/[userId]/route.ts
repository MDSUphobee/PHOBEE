import { NextRequest, NextResponse } from 'next/server';

// Type pour Next.js 16
type RouteContext = {
    params: Promise<{ userId: string }>
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
    try {
        const body = await req.json();
        
        // CRUCIAL : On attend la résolution des paramètres
        const { userId } = await params;

        const apiResponse = await fetch(`${process.env.API_BASE}/users/${userId}`, {
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
        console.error('Erreur proxy users PUT:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        // CRUCIAL : On attend la résolution des paramètres
        const { userId } = await params;

        const apiResponse = await fetch(`${process.env.API_BASE}/users/${userId}`, {
            method: 'DELETE',
        });

        if (apiResponse.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        let data;
        try {
            data = await apiResponse.json();
        } catch (e) {
            data = null;
        }

        if (!apiResponse.ok) {
            return NextResponse.json(data || { message: 'Erreur' }, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Erreur proxy users DELETE:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}