import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// --- TOKEN CACHE SYSTEM ---
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getValidToken(): Promise<string> {
    const apiKey = process.env.JWT_API_AIDES_TERRITOIRES;
    if (!apiKey) {
        throw new Error("Configuration back-end manquante (JWT_API_AIDES_TERRITOIRES).");
    }

    // Refresh if no token or if it expires in less than 5 minutes (300000ms)
    const now = Date.now();
    if (cachedToken && tokenExpiresAt > now + 300000) {
        console.log("[Aides-Agri Engine] Token Status: Valid (from cache)");
        return cachedToken;
    }

    console.log("[Aides-Agri Engine] Token Status: Refreshing...");
    const authRes = await fetch('https://aides-territoires.beta.gouv.fr/api/connexion/', {
        method: 'POST',
        headers: {
            'X-AUTH-TOKEN': apiKey
        }
    });

    if (!authRes.ok) {
        throw new Error(`Authentication to Aides-Territoires failed: ${await authRes.text()}`);
    }

    const authData = await authRes.json();
    if (!authData.token) {
        throw new Error("Token non retourné par l'API.");
    }

    cachedToken = authData.token;
    // Assuming 24h validity for "Aides-Territoires" API tokens
    tokenExpiresAt = now + (24 * 60 * 60 * 1000);
    console.log("[Aides-Agri Engine] Token Status: Refreshed & Cached (24h)");

    return cachedToken as string;
}

// --- RELEVANCE ENGINE ---

// Blacklist Sémantique ciblée sur le TITRE (name)
const TITLE_BLACKLIST = [
    "archives", "bibliothèque", "musée", "école", "sport scolaire", "église",
    "chapelle", "voirie", "pont", "éclairage public", "station d'épuration",
    "cimetière", "mairie"
];

// Whitelist de pertinence (Priorité Agricole)
const RELEVANCE_MARKERS = [
    "exploitation", "dja", "msa", "bio", "hve", "troupeau", "élevage",
    "culture", "maraîchage", "viticulture", "calamités", "irrigation",
    "stockage agricole"
];

function calculateRelevanceAndThemes(aid: any) {
    const titleToAnalyze = `${aid.name || ""}`.toLowerCase();
    const textToAnalyze = `${aid.name || ""} ${aid.description || ""}`.toLowerCase();

    // 1. Filtre de Public Cible (Indispensable)
    // Ne conserve l'aide QUE si targeted_audiences contient "Agriculteur" ou "Entreprise".
    // Si uniquement "Commune" ou "EPCI", on rejette.
    const audiencesStr = JSON.stringify(aid.targeted_audiences || []).toLowerCase();
    const hasAgriOrEntreprise = audiencesStr.includes("agriculteur") || audiencesStr.includes("entreprise");

    if (!hasAgriOrEntreprise) {
        return { isExcluded: true, score: 0, themes: [], filieres: [] };
    }

    // 2. Blacklist Sémantique (Nettoyage du bruit sur le TITRE)
    for (const word of TITLE_BLACKLIST) {
        if (titleToAnalyze.includes(word.toLowerCase())) {
            return { isExcluded: true, score: 0, themes: [], filieres: [] };
        }
    }

    let score = 0;

    // 3. Whitelist de pertinence (Priorité Agricole)
    for (const word of RELEVANCE_MARKERS) {
        if (textToAnalyze.includes(word.toLowerCase())) {
            score += 10;
        }
    }

    const themes: string[] = [];
    const filieres: string[] = [];

    // Tagging Filières
    if (textToAnalyze.includes("élevage") || textToAnalyze.includes("bovin") || textToAnalyze.includes("ovin") || textToAnalyze.includes("porcin") || textToAnalyze.includes("volaille") || textToAnalyze.includes("troupeau")) filieres.push("Élevage");
    if (textToAnalyze.includes("culture") || textToAnalyze.includes("céréale") || textToAnalyze.includes("semence")) filieres.push("Cultures");
    if (textToAnalyze.includes("maraîchage") || textToAnalyze.includes("légumes")) filieres.push("Maraîchage");
    if (textToAnalyze.includes("viticulture") || textToAnalyze.includes("vigne") || textToAnalyze.includes("vin")) filieres.push("Viticulture");

    // Tagging Thématique
    if (textToAnalyze.includes("urgence") || textToAnalyze.includes("crise") || textToAnalyze.includes("trésorerie") || textToAnalyze.includes("calamité")) themes.push("Urgence / Trésorerie");
    if (textToAnalyze.includes("installation") || textToAnalyze.includes("dja") || textToAnalyze.includes("transmission")) themes.push("Installation / Transmission");
    if (textToAnalyze.includes("bio") || textToAnalyze.includes("hve") || textToAnalyze.includes("agroécologie") || textToAnalyze.includes("environnement")) themes.push("Transition Écologique");
    if (textToAnalyze.includes("matériel") || textToAnalyze.includes("bâtiment") || textToAnalyze.includes("irrigation") || textToAnalyze.includes("stockage")) themes.push("Investissement");

    if (themes.length === 0) themes.push("Aide Générale");

    return { isExcluded: false, score, themes, filieres };
}

// --- MAIN ROUTE ---
export async function GET() {
    try {
        const token = await getValidToken();

        let cleanedResults: any[] = [];
        let url = 'https://aides-territoires.beta.gouv.fr/api/aids/all/?organization_type_ids=31&category_ids=47&status=open';
        let pagesCount = 0;

        // Logique de Fallback: continuer tant qu'on n'a pas 10 résultats pertinents OU qu'on n'a pas épuisé l'API (limite à 20 pages max pour éviter timeout)
        while (url && cleanedResults.length < 10 && pagesCount < 20) {
            const dataRes = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token || ""}`
                }
            });

            if (!dataRes.ok) {
                console.error("[Aides-Agri Engine] Data fetch failed on page", pagesCount, await dataRes.text());
                break;
            }

            const data = await dataRes.json();
            const fetched = data.results || [];

            for (const aid of fetched) {
                const analysis = calculateRelevanceAndThemes(aid);

                if (!analysis.isExcluded) {
                    // Sécurité des Liens
                    const safeApplicationUrl = aid.application_url || `https://aides-territoires.beta.gouv.fr/aides/${aid.slug}/`;

                    cleanedResults.push({
                        ...aid,
                        application_url: safeApplicationUrl,
                        relevanceScore: analysis.score,
                        agriThemes: analysis.themes,
                        agriFilieres: analysis.filieres
                    });
                }
            }

            url = data.next;
            pagesCount++;
        }

        console.log(`[Aides-Agri Engine] Cleaned Results: ${cleanedResults.length}`);

        // Tri decroissant par pertinence (Boostés en premier)
        cleanedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        return NextResponse.json({ results: cleanedResults, count: cleanedResults.length });

    } catch (error: any) {
        console.error("[Aides-Agri Engine] Fatal Error:", error);
        return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
