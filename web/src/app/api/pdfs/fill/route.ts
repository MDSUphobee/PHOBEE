import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000/';
        const body = await request.json();

        const { searchParams } = new URL(request.url);
        const pdf = searchParams.get('pdf');

        // Forward au backend Laravel avec le même query param ?pdf=
        const targetUrl = new URL('api/aides/fill-pdf', apiUrl);
        if (pdf) targetUrl.searchParams.set('pdf', pdf);

        console.log(`[PDF Fill] → ${targetUrl.toString()}`);

        const response = await fetch(targetUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Lire la réponse JSON de Laravel (qui contient pdf_base64)
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
            const errMsg = data?.message || data?.error || `Erreur backend ${response.status}`;
            console.error('[PDF Fill] Laravel error:', response.status, errMsg);
            return NextResponse.json(
                { success: false, error: errMsg },
                { status: 500 }
            );
        }

        // Laravel retourne { success, pdf_base64, filename }
        const { pdf_base64, filename } = data;

        if (!pdf_base64) {
            return NextResponse.json(
                { success: false, error: 'Le backend n\'a pas retourné de PDF.' },
                { status: 500 }
            );
        }

        // Décoder le Base64 → Buffer binaire → réponse PDF
        const pdfBuffer = Buffer.from(pdf_base64, 'base64');

        const outputFilename = filename || (pdf ? `${pdf}_rempli.pdf` : 'formulaire_rempli.pdf');

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Length', pdfBuffer.byteLength.toString());
        headers.set('Content-Disposition', `inline; filename="${outputFilename}"`);

        return new NextResponse(pdfBuffer, { status: 200, headers });

    } catch (error: any) {
        console.error('[API PDFs Fill] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erreur interne du serveur.' },
            { status: 500 }
        );
    }
}
