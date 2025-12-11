import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
    const userId = Number(params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return NextResponse.json({ message: 'Identifiant utilisateur invalide' }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { email, username, password } = body;

        if (!email && !username && !password) {
            return NextResponse.json({ message: 'Aucune donnée à mettre à jour' }, { status: 400 });
        }

        // Check if user exists
        const [existingUser] = await db.execute<RowDataPacket[]>('SELECT id FROM users WHERE id = ? AND deleted = 0', [userId]);
        if (!existingUser.length) {
            return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const updates: string[] = [];
        const values: any[] = [];

        if (email) {
            // Check email uniqueness
            const [emailCheck] = await db.execute<RowDataPacket[]>('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [email, userId]);
            if (emailCheck.length) {
                return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 409 });
            }
            updates.push('email = ?');
            values.push(email);
        }

        if (username) {
            updates.push('username = ?');
            values.push(username);
        }

        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(passwordHash);
        }

        values.push(userId);

        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

        await db.execute<ResultSetHeader>(query, values);

        return NextResponse.json({
            id: userId,
            email: email || undefined,
            username: username || undefined,
            message: 'Utilisateur mis à jour avec succès'
        });

    } catch (err: any) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        return NextResponse.json({ message: 'Échec de la mise à jour', error: err.message }, { status: 500 });
    }
}

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
