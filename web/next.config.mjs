/** @type {import('next').NextConfig} */
import path from 'path';
import dotenv from 'dotenv';

// Load .env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Origines de dev autorisées, dérivées du .env (URL_MOBILE_APP = "host:port").
// Next.js attend uniquement le host (sans protocole ni port).
const devOrigins = [process.env.URL_MOBILE_APP]
    .filter(Boolean)
    .map((v) => v.replace(/^https?:\/\//, "").split(":")[0]);

// Hôte Konfector proxifié en first-party (voir rewrites ci-dessous).
// Les appels passent par /kf/* sur notre domaine → non bloqués par les adblockers.
const KONFECTOR_HOST = process.env.KONFECTOR_HOST || "https://k.konfector.fr";

const nextConfig = {
    output: "standalone",
    allowedDevOrigins: devOrigins,
    images: {
        unoptimized: true,
    },
    // Désactive l'optimisation des feuilles de style externes pour éviter l'erreur Typekit
    experimental: {
        optimizeCss: false,
    },
    // Proxy first-party pour Konfector (analytics pôle Data).
    // Le navigateur ne contacte que notre origine ; Next relaie côté serveur
    // le script et les requêtes d'ingestion vers Konfector.
    async rewrites() {
        return [
            {
                source: "/kf/:path*",
                destination: `${KONFECTOR_HOST}/:path*`,
            },
        ];
    },
};

export default nextConfig;
