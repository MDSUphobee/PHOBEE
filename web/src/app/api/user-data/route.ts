import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validation: user_id is strictly required
        if (!body.user_id) {
            // According to requirements, if no user_id, we do not save to DB.
            // Returning 401 or 400. In this case, the frontend shouldn't even call this endpoint if user_id is missing, 
            // but just in case, we enforce it here.
            return NextResponse.json({ success: false, message: "user_id manquant. Données non enregistrées en base." }, { status: 400 });
        }

        const { user_id, aides_id, json_data } = body;

        // Simulate Database Save
        console.log("Enregistrement BDD simulé pour user_id:", user_id, "| aides_id:", aides_id);
        console.log("Data:", json_data);

        // Here you would implement your actual database insertion logic, e.g., Prisma or SQL driver
        // await db.formSubmissions.create({ data: { userId: user_id, aidesId: aides_id, data: json_data } })

        return NextResponse.json({ success: true, message: "Données enregistrées avec succès en base de données." });
    } catch (error: any) {
        console.error("[API user-data] Error:", error);
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}
