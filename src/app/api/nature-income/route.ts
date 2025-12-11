import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await db.execute<RowDataPacket[]>('SELECT id, name FROM nature_income ORDER BY name ASC');
        return NextResponse.json(rows);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des natures de revenu:', err);
        return NextResponse.json(
            { message: 'Échec de la récupération des natures de revenu', error: err.message },
            { status: 500 }
        );
    }
}
