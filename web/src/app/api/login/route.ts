import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const apiBaseRaw = process.env.API_BASE;
        if (!apiBaseRaw) {
            return NextResponse.json(
                { message: 'Configuration manquante: API_BASE' },
                { status: 500 }
            );
        }

        const apiBase = apiBaseRaw.replace(/\/+$/, '');
        const backendUrl = `${apiBase}/login`;

        const apiResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const rawText = await apiResponse.text();
        let data: any = null;
        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch {
            data = {
                message: 'Réponse non-JSON reçue depuis le backend',
                backendUrl,
                status: apiResponse.status,
                statusText: apiResponse.statusText,
                bodyPreview: rawText?.slice(0, 500),
            };
        }

        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        // Laravel peut renvoyer uniquement { token }. Le front a besoin aussi de { user }
        // pour pouvoir accéder aux pages qui utilisent localStorage.user (ex: /profile).
        if (data?.token && !data?.user && email) {
            try {
                const userRes = await fetch(
                    `${process.env.API_BASE}/users?email=${encodeURIComponent(email)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${data.token}`,
                        },
                    }
                );

                if (userRes.ok) {
                    const userData = await userRes.json();
                    const user = Array.isArray(userData)
                        ? userData[0]
                        : (Array.isArray(userData?.data) ? userData.data[0] : userData);

                    return NextResponse.json({ ...data, user });
                }
            } catch (e) {
                // Best-effort only: si ça échoue, on renvoie au moins le token.
            }
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Erreur proxy login:", err);
        return NextResponse.json(
            { message: "Erreur serveur", error: err.message },
            { status: 500 }
        );
    }
}
