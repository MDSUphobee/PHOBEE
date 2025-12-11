import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    const userId = Number(params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return NextResponse.json(
            { message: 'Identifiant utilisateur invalide' },
            { status: 400 }
        );
    }

    try {
        const [userResult] = await db.execute<ResultSetHeader>(
            'UPDATE users SET deleted = 1 WHERE id = ? AND deleted = 0',
            [userId]
        );

        if (userResult.affectedRows === 0) {
            return NextResponse.json(
                { message: 'Utilisateur non trouvé ou déjà supprimé' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (err: any) {
        console.error('Erreur lors de la suppression (soft delete) de l’utilisateur:', err);
        return NextResponse.json(
            { message: 'Échec de la suppression de l’utilisateur', error: err.message },
            { status: 500 }
        );
    }
}
