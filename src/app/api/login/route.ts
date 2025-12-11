import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export async function POST(req: Request) {
    if (!JWT_SECRET || !JWT_EXPIRES_IN) {
        console.error('JWT_SECRET et JWT_EXPIRES_IN doivent être définis dans .env');
        return NextResponse.json(
            { message: 'Erreur de configuration du serveur' },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'L\'email et le mot de passe sont requis' },
                { status: 400 }
            );
        }

        const [rows] = await db.execute<RowDataPacket[]>(
            'SELECT id, username, email, password, deleted FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        const user = rows[0];

        if (!user || user.deleted) {
            return NextResponse.json(
                { message: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json(
                { message: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { sub: user.id, email: user.email, username: user.username },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } as any
        );

        return NextResponse.json({ token });

    } catch (err: any) {
        console.error("Erreur lors de la connexion:", err);
        return NextResponse.json(
            { message: "Échec de la connexion", error: err.message },
            { status: 500 }
        );
    }
}
