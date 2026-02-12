import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiResponse = await fetch(`${process.env.API_BASE}/nature-income`);
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Erreur proxy nature-income:', err);
        return NextResponse.json(
            { message: 'Erreur serveur', error: err.message },
            { status: 500 }
        );
    }
}
