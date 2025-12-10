import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            email,
            password,
            username,
        } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'L\'email et le mot de passe sont requis' },
                { status: 400 }
            );
        }



        // Check existing email
        const [existing] = await db.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { message: 'Adresse email déjà utilisée' },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [userResult] = await connection.execute<ResultSetHeader>(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username || email, email, passwordHash]
            );

            const userId = userResult.insertId;



            await connection.commit();

            return NextResponse.json({
                id: userId,
                email,
                username: username || email,
            }, { status: 201 });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (err: any) {
        console.error("Erreur lors de l'inscription:", err);
        return NextResponse.json(
            { message: "Échec de l'inscription", error: err.message },
            { status: 500 }
        );
    }
}
