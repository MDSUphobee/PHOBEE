import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
    try {
        const body = await req.json();
        const userId = params.userId;

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

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId;

        const apiResponse = await fetch(`${process.env.API_BASE}/users/${userId}`, {
            method: 'DELETE',
        });

        // 204 No Content typically has no body
        if (apiResponse.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        // If there's a body (error or otherwise)
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
