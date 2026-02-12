import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId;
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

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
    try {
        const body = await req.json();
        const userId = params.userId;

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
