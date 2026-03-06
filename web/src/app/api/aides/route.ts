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
// Blacklist Stricte (Social, Public, Patrimoine)
const EXCLUDED_KEYWORDS = [
    "logement locatif", "ménages", "particuliers", "habitants", "accession sociale",
    "commune", "mairie", "intercommunalité", "agent public", "collectivité territoriale",
    "église", "monument historique", "musée", "bibliothèque", "sport scolaire",
    "lavoir", "éclairage public"
];

// Whitelist Stricte (Marqueurs Agricoles) : L'aide doit contenir au moins un de ces termes
const REQUIRED_AGRICULTURAL_MARKERS = [
    "dja", "dotation jeune agriculteur", "installation", "transmission", "reprise",
    "élevage", "culture", "maraîchage", "viticulture", "arboriculture", "apiculture",
    "matériel agricole", "bâtiment agricole", "stockage", "irrigation",
    "agriculture biologique", "bio", "hve", "conversion", "agroécologie",
    "msa", "trésorerie agricole", "calamité agricole", "exploitation agricole", "agricole", "agriculteurs"
];

// Mots-clés de boost
const BOOST_KEYWORDS = ["dja", "pac", "bio", "hve"];

function calculateRelevanceAndThemes(aid: any) {
    const textToAnalyze = `${aid.name || ""} ${aid.description || ""}`.toLowerCase();

    // 1. Exclusion Stricte (Blacklist)
    for (const word of EXCLUDED_KEYWORDS) {
        if (textToAnalyze.includes(word)) {
            return { isExcluded: true, score: 0, themes: [], filieres: [] };
        }
    }

    // 2. Inclusion Stricte (Whitelist)
    let hasAgriculturalMarker = false;
    for (const word of REQUIRED_AGRICULTURAL_MARKERS) {
        if (textToAnalyze.includes(word)) {
            hasAgriculturalMarker = true;
            break;
        }
    }

    if (!hasAgriculturalMarker) {
        return { isExcluded: true, score: 0, themes: [], filieres: [] };
    }

    let score = 0;
    const themes: string[] = [];
    const filieres: string[] = [];

    // 3. Inclusion Préférentielle (Score)
    for (const word of BOOST_KEYWORDS) {
        if (textToAnalyze.includes(word)) {
            score += 10;
        }
    }

    // 4. Tagging Filières
    if (textToAnalyze.includes("élevage") || textToAnalyze.includes("bovin") || textToAnalyze.includes("ovin") || textToAnalyze.includes("porcin") || textToAnalyze.includes("volaille")) filieres.push("Élevage");
    if (textToAnalyze.includes("culture") || textToAnalyze.includes("céréale") || textToAnalyze.includes("semence")) filieres.push("Cultures");
    if (textToAnalyze.includes("maraîchage") || textToAnalyze.includes("légumes")) filieres.push("Maraîchage");
    if (textToAnalyze.includes("viticulture") || textToAnalyze.includes("vigne") || textToAnalyze.includes("vin")) filieres.push("Viticulture");
    if (textToAnalyze.includes("arboriculture") || textToAnalyze.includes("verger") || textToAnalyze.includes("fruits")) filieres.push("Arboriculture");
    if (textToAnalyze.includes("apiculture") || textToAnalyze.includes("miel") || textToAnalyze.includes("abeille")) filieres.push("Apiculture");

    // 5. Tagging Thématique
    if (textToAnalyze.includes("crise") || textToAnalyze.includes("sècheresse") || textToAnalyze.includes("prêt") || textToAnalyze.includes("trésorerie") || textToAnalyze.includes("calamité")) {
        themes.push("Urgence / Trésorerie");
    }
    if (textToAnalyze.includes("jeune agriculteur") || textToAnalyze.includes("dja") || textToAnalyze.includes("cession") || textToAnalyze.includes("installation") || textToAnalyze.includes("reprise")) {
        themes.push("Installation / Transmission");
    }
    if (textToAnalyze.includes("hve") || textToAnalyze.includes("bio") || textToAnalyze.includes("carbone") || textToAnalyze.includes("haies") || textToAnalyze.includes("environnement") || textToAnalyze.includes("agroécologie")) {
        themes.push("Transition Écologique");
    }
    if (textToAnalyze.includes("matériel") || textToAnalyze.includes("bâtiment") || textToAnalyze.includes("irrigation") || textToAnalyze.includes("stockage")) {
        themes.push("Investissement");
    }

    // Fallback theme si aucun
    if (themes.length === 0) {
        themes.push("Aide Générale");
    }

    return { isExcluded: false, score, themes, filieres };
}


// --- MAIN ROUTE ---
export async function GET() {
    try {
        const token = await getValidToken();

        // 2. Data Collection Engine: using definitive numeric identifiers instead of slugs
        // organization_type_ids=31 (Agriculteur / Exploitation Agricole)
        // category_ids=47 (Agriculture et Agroalimentaire)
        let results: any[] = [];
        let url = 'https://aides-territoires.beta.gouv.fr/api/aids/all/?organization_type_ids=31&category_ids=47&status=open';
        let pagesCount = 0;

        while (url && results.length < 30 && pagesCount < 10) {
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
            results = [...results, ...fetched];

            url = data.next;
            pagesCount++;
        }

        console.log(`[Aides-Agri Engine] Raw Results: ${results.length}`);

        // 3. Application du Moteur de Pertinence
        let cleanedResults: any[] = [];
        for (const aid of results) {
            const analysis = calculateRelevanceAndThemes(aid);

            // On ne garde pas ce qui est pollué par les fausses cibles rurales
            if (!analysis.isExcluded) {
                // On attache les datas calculées à l'objet pour le Frontend
                cleanedResults.push({
                    ...aid,
                    relevanceScore: analysis.score,
                    agriThemes: analysis.themes,
                    agriFilieres: analysis.filieres
                });
            }
        }

        // Tri decroissant par pertinence (Boostés en premier)
        cleanedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        console.log(`[Aides-Agri Engine] Cleaned Results: ${cleanedResults.length}`);

        return NextResponse.json({ results: cleanedResults });

    } catch (error: any) {
        console.error("[Aides-Agri Engine] Fatal Error:", error);
        return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
