// Test de montée en charge PHOBEE (k6)
// -------------------------------------
// Simule une montée en charge progressive sur les pages publiques et l'API,
// vérifie des seuils de performance (SLA) et génère un rapport HTML.
//
// Lancer :
//   k6 run load-tests/load-test.js                      # cible dev.phobee.net
//   BASE_URL=https://phobee.net k6 run load-tests/load-test.js   # cible la prod
//   PROFILE=smoke k6 run load-tests/load-test.js        # test rapide (3 VUs)
//
// Rapport : génère load-tests/rapport.html (ouvrir dans un navigateur).

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

const BASE_URL = __ENV.BASE_URL || 'https://dev.phobee.net';

// Deux profils : "smoke" (vérif rapide) ou "load" (vraie montée en charge, défaut).
const PROFILES = {
    smoke: [
        { duration: '20s', target: 3 },
        { duration: '10s', target: 0 },
    ],
    load: [
        { duration: '30s', target: 10 }, // montée à 10 utilisateurs simultanés
        { duration: '1m', target: 10 },  // palier
        { duration: '30s', target: 30 }, // montée à 30
        { duration: '1m', target: 30 },  // palier (charge cible)
        { duration: '30s', target: 0 },  // descente
    ],
};

export const options = {
    stages: PROFILES[__ENV.PROFILE] || PROFILES.load,
    thresholds: {
        // Moins de 1 % de requêtes en erreur sur l'ensemble du test.
        http_req_failed: ['rate<0.01'],
        // 95 % des requêtes sous 2 s.
        http_req_duration: ['p(95)<2000'],
        // Objectifs différenciés pages / API (lecture) / écriture PDF (plus lourd).
        'http_req_duration{type:page}': ['p(95)<1500'],
        'http_req_duration{type:api}': ['p(95)<2500'],
        'http_req_duration{type:api_write}': ['p(95)<5000'],
    },
};

const PAGES = ['/', '/abonnements', '/faq', '/dictionary', '/contact'];

export default function () {
    group('Pages publiques', () => {
        const path = PAGES[Math.floor(Math.random() * PAGES.length)];
        const res = http.get(`${BASE_URL}${path}`, { tags: { type: 'page' } });
        check(res, { 'page -> 200': (r) => r.status === 200 });
    });

    group('API (lecture)', () => {
        const pdfs = http.get(`${BASE_URL}/api/pdfs`, { tags: { type: 'api' } });
        check(pdfs, {
            'api/pdfs -> 200': (r) => r.status === 200,
            'api/pdfs -> JSON success': (r) => {
                try {
                    return r.json('success') === true;
                } catch {
                    return false;
                }
            },
        });

        const aides = http.get(`${BASE_URL}/api/aides`, { tags: { type: 'api' } });
        check(aides, {
            'api/aides -> 200': (r) => r.status === 200,
            'api/aides -> liste non vide': (r) => {
                try {
                    const body = r.json();
                    return Array.isArray(body) ? body.length > 0 : Array.isArray(body?.data);
                } catch {
                    return false;
                }
            },
        });
    });

    // Remplissage PDF = écriture (génère un PDF, opération lourde).
    // Limité à ~1 itération sur 5 pour tester l'écriture sans saturer le disque du serveur.
    if (Math.random() < 0.2) {
        group('API (écriture — remplissage PDF)', () => {
            const payload = JSON.stringify({
                mapping: { demandeur: { siret: '12345678900012', commune: 'Nantes' } },
                flatten: false,
            });
            const res = http.post(`${BASE_URL}/api/pdfs/fill?pdf=cerfa_16015`, payload, {
                headers: { 'Content-Type': 'application/json' },
                tags: { type: 'api_write' },
            });
            check(res, {
                'fill -> 200': (r) => r.status === 200,
                'fill -> success': (r) => {
                    try {
                        return r.json('success') === true;
                    } catch {
                        return false;
                    }
                },
            });
        });
    }

    // Pause réaliste entre deux actions d'un même utilisateur.
    sleep(Math.random() * 2 + 1);
}

// Rapport HTML (le "tableau de bord") + résumé console.
export function handleSummary(data) {
    return {
        'load-tests/rapport.html': htmlReport(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
