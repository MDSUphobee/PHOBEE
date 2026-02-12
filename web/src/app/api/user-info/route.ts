import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const apiResponse = await fetch(`${process.env.API_BASE}/user-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        console.error('Erreur proxy user-info POST:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}
