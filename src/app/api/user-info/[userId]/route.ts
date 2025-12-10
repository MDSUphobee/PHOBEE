import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const userId = Number(params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return NextResponse.json(
            { message: 'Identifiant utilisateur invalide' },
            { status: 400 }
        );
    }

    try {
        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT id, user_id, exploiting_name, name, exploiting_address, siret, nature_income_id FROM users_info WHERE user_id = ? LIMIT 1',
            [userId]
        );

        if (!rows.length) {
            return NextResponse.json(
                { message: 'Informations utilisateur non trouvées' },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (err: any) {
        console.error('Erreur lors de la récupération de users_info:', err);
        return NextResponse.json(
            { message: 'Échec de la récupération des informations utilisateur', error: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
    const userId = Number(params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return NextResponse.json(
            { message: 'Identifiant utilisateur invalide' },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const {
            exploiting_name,
            name,
            exploiting_address,
            siret,
            nature_income_id,
        } = body;

        if (!exploiting_name || !name || !exploiting_address || !siret || !nature_income_id) {
            return NextResponse.json(
                { message: 'Tous les champs users_info sont requis' },
                { status: 400 }
            );
        }

        const [result] = await db.execute<ResultSetHeader>(
            `UPDATE users_info
       SET exploiting_name = ?, name = ?, exploiting_address = ?, siret = ?, nature_income_id = ?
       WHERE user_id = ?`,
            [exploiting_name, name, exploiting_address, siret, nature_income_id, userId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: 'Informations utilisateur non trouvées' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user_id: userId,
            exploiting_name,
            name,
            exploiting_address,
            siret,
            nature_income_id,
        });
    } catch (err: any) {
        console.error('Erreur lors de la mise à jour de users_info:', err);
        return NextResponse.json(
            { message: 'Échec de la mise à jour des informations utilisateur', error: err.message },
            { status: 500 }
        );
    }
}
