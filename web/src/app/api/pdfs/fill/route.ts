import { NextResponse } from 'next/server';

/**
 * POST /api/pdfs/fill
 *
 * Body (JSON):
 *   {
 *     pdf:     string,           // cerfa key, e.g. "cerfa_11423"
 *     mapping: Record<string, string>,
 *     flatten: boolean           // optional, default false
 *   }
 *
 * Returns the raw PDF binary with Content-Type: application/pdf
 * so the browser / client code can create a Blob URL for download.
 */
export async function POST(request: Request) {
    try {
        const body    = await request.json();
        const pdf     = body?.pdf     ?? '';
        const mapping = body?.mapping ?? {};
        const flatten = body?.flatten ?? false;


        const apiUrl   = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/';
        //alert(`API URL: ${apiUrl}\nPDF: ${pdf}\nMapping: ${JSON.stringify(mapping)}\nFlatten: ${flatten}`);

        const laravelUrl = new URL('api/pdfs/fill', apiUrl);
        laravelUrl.searchParams.set('pdf',      pdf);
        laravelUrl.searchParams.set('download', 'true');
        if (flatten) laravelUrl.searchParams.set('flatten', 'true');

        const response = await fetch(laravelUrl.toString(), {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/pdf',
                // Auth header — reads token from env if set (Sanctum token for protected route)
                ...(process.env.LARAVEL_API_TOKEN
                    ? { Authorization: `Bearer ${process.env.LARAVEL_API_TOKEN}` }
                    : {}),
            },
            body: JSON.stringify({ mapping, flatten }),
            cache: 'no-store',
        });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                { success: false, message: `Laravel error ${response.status}`, detail: text },
                { status: response.status }
            );
        }

        // Stream the raw PDF bytes back to the client
        const pdfBuffer = await response.arrayBuffer();
        const filename  = `${pdf || 'document'}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type':        'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length':      String(pdfBuffer.byteLength),
            },
        });
    } catch (error: any) {
        console.error('[POST /api/pdfs/fill] Error:', error);
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erreur interne du serveur.' },
            { status: 500 }
        );
    }
}
