/** @type {import('next').NextConfig} */
import path from 'path';
import dotenv from 'dotenv';

// Load .env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const nextConfig = {
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
    },
    // Désactive l'optimisation des feuilles de style externes pour éviter l'erreur Typekit
    experimental: {
        optimizeCss: false,
    },
};

export default nextConfig;
