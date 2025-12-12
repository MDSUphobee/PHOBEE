/** @type {import('next').NextConfig} */
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
