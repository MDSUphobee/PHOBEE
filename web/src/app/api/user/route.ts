import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const authHeader = req.headers.get('authorization');

    if (!email) {
        return NextResponse.json(
            { message: 'Email requis' },
            { status: 400 }
        );
    }

    try {
        const apiResponse = await fetch(`${process.env.API_BASE}/users?email=${encodeURIComponent(email)}`, {
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
                'Accept': 'application/json',
            },
        });
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Erreur proxy user:", err);
        return NextResponse.json(
            { message: "Erreur serveur", error: err.message },
            { status: 500 }
        );
    }
}
