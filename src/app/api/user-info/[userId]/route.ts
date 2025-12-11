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
            'SELECT id, user_id, exploiting_name, name, exploiting_address, siret, nature_income_id, start_date, payment_frequency, has_acre FROM users_info WHERE user_id = ? LIMIT 1',
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

        // Fields allowed to be updated
        const allowedFields = [
            'exploiting_name',
            'name',
            'exploiting_address',
            'siret',
            'nature_income_id',
            'start_date',
            'payment_frequency',
            'has_acre'
        ];

        const fieldsToUpdate: string[] = [];
        const values: any[] = [];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(body[field]);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return NextResponse.json(
                { message: 'Aucune donnée fournie pour la mise à jour' },
                { status: 400 }
            );
        }

        values.push(userId);

        const query = `UPDATE users_info SET ${fieldsToUpdate.join(', ')} WHERE user_id = ?`;

        const [result] = await db.execute<ResultSetHeader>(query, values);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: 'Informations utilisateur non trouvées' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Informations mises à jour avec succès',
            updatedFields: Object.keys(body).filter(k => allowedFields.includes(k))
        });
    } catch (err: any) {
        console.error('Erreur lors de la mise à jour de users_info:', err);
        return NextResponse.json(
            { message: 'Échec de la mise à jour des informations utilisateur', error: err.message },
            { status: 500 }
        );
    }
}
