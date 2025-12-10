import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json(
            { message: 'Le paramètre de requête email est requis' },
            { status: 400 }
        );
    }

    try {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT id, username, email FROM users WHERE email = ? AND deleted = 0 LIMIT 1',
            [email]
        );

        if (!rows.length) {
            return NextResponse.json(
                { message: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (err: any) {
        console.error("Erreur lors de la récupération de l'utilisateur par email:", err);
        return NextResponse.json(
            { message: "Échec de la récupération de l'utilisateur", error: err.message },
            { status: 500 }
        );
    }
}
