import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, start_date, payment_frequency, has_acre } = body;

        if (!user_id || !start_date || !payment_frequency) {
            return NextResponse.json(
                { message: 'Les champs user_id, start_date et payment_frequency sont requis' },
                { status: 400 }
            );
        }

        const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO users_info (user_id, start_date, payment_frequency, has_acre) VALUES (?, ?, ?, ?)',
            [user_id, start_date, payment_frequency, has_acre ? 1 : 0]
        );

        return NextResponse.json(
            {
                id: result.insertId,
                user_id,
                start_date,
                payment_frequency,
                has_acre: !!has_acre,
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('Erreur lors de la création des infos utilisateur:', err);
        return NextResponse.json(
            { message: 'Échec de la création des infos', error: err.message },
            { status: 500 }
        );
    }
}
