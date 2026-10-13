// web/src/lib/api.ts
//
// Base URL de l'API appelée DEPUIS LE NAVIGATEUR (client).
//
// Problème : sur un téléphone physique (app Expo = WebView qui charge le site
// via l'IP du Mac), "localhost" désigne le téléphone, pas la machine de dev.
// Un NEXT_PUBLIC_API_BASE figé sur http://localhost:8000 casse donc le login
// sur mobile.
//
// Solution : côté navigateur, on vise le MÊME hôte que celui qui sert le site,
// sur le port de l'API (8000). Ainsi :
//   - desktop (localhost:3000)        -> http://localhost:8000/api
//   - mobile  (10.x.x.x:3000 via Expo) -> http://10.x.x.x:8000/api
// sans jamais coder l'IP en dur.
//
// Côté serveur (SSR), on retombe sur NEXT_PUBLIC_API_BASE.

const API_PORT = 8000;

export function getApiBase(): string {
    if (typeof window !== "undefined" && window.location?.hostname) {
        const { protocol, hostname } = window.location;
        return `${protocol}//${hostname}:${API_PORT}/api`;
    }
    return process.env.NEXT_PUBLIC_API_BASE || `http://localhost:${API_PORT}/api`;
}
