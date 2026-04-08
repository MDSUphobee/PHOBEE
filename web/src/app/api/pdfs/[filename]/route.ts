import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
    try {
        const { filename } = params;
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const url = new URL(`api/pdfs/${filename}`, apiUrl);

        // Fetch the PDF stream from Laravel
        const response = await fetch(url.toString(), {
            method: 'GET',
        });

        if (!response.ok) {
            console.error("Erreur serveur Laravel PDF:", response.status, response.statusText);
            if (response.status === 404) {
                return NextResponse.json({ success: false, error: "PDF introuvable" }, { status: 404 });
            }
            throw new Error(`Erreur HTTP Laravel: ${response.status}`);
        }

        // Return the blob directly to Next.js Client
        const blob = await response.blob();
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        
        // Pass download query parameter if requested
        const searchParams = new URL(request.url).searchParams;
        if (searchParams.get('download') === '1') {
            headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        } else {
            headers.set('Content-Disposition', `inline; filename="${filename}"`);
        }

        return new NextResponse(blob, { status: 200, statusText: "OK", headers });
    } catch (error: any) {
        console.error("[API PDFs GET vers Laravel] Fetch Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Erreur interne." }, { status: 500 });
    }
}
