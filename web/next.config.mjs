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
};

export default nextConfig;
