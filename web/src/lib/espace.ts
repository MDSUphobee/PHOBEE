"use client";

/**
 * Espace personnel — persistance serveur (API Laravel) avec repli localStorage.
 *
 *  - Connecté (token présent) : lecture via GET /me/espace, écritures via /me/*,
 *    avec mise à jour optimiste et cache localStorage de secours.
 *  - Non connecté : fonctionne en localStorage uniquement (mode invité / démo).
 *
 * Blocs couverts : aides en cours, échéances (calendrier), documents, préférences
 * de notification. Les alertes sont dérivées (non stockées).
 */

import { useCallback, useEffect, useState } from "react";
import { getApiBase } from "@/lib/api";

export type Statut = "À compléter" | "En cours" | "Acceptée";
export const STATUTS: Statut[] = ["À compléter", "En cours", "Acceptée"];

export type TypeEcheance = "Déclaration" | "Aide" | "Justificatif";
export const TYPES_ECHEANCE: TypeEcheance[] = ["Déclaration", "Aide", "Justificatif"];

export type AideSuivie = { id: string; aideId?: number; nom: string; statut: Statut; action?: string; echeanceISO?: string };
export type Echeance = { id: string; dateISO: string; label: string; type: TypeEcheance; detail?: string; aideId?: string };
export type DocItem = { id: string; nom: string; cerfa?: string; dateISO: string; url?: string };
export type Notifs = { rappels: boolean; aides: boolean; alertes: boolean };

export type Espace = { suivi: AideSuivie[]; echeances: Echeance[]; documents: DocItem[]; notifs: Notifs };

export const NOTIFS_DEFAUT: Notifs = { rappels: true, aides: true, alertes: true };
const VIDE: Espace = { suivi: [], echeances: [], documents: [], notifs: NOTIFS_DEFAUT };

export const uid = () =>
    (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`);

// ─── Identité / stockage local ───────────────────────────────────────────────
function currentUser(): { id: string | null; token: string | null } {
    try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token");
        return { id: u?.id != null ? String(u.id) : null, token };
    } catch {
        return { id: null, token: null };
    }
}
const cacheKey = (who: string) => `phobee:espace:v2:${who}`;

function readCache(who: string): Espace {
    try {
        const raw = localStorage.getItem(cacheKey(who));
        if (raw) {
            const p = JSON.parse(raw);
            return { ...VIDE, ...p, notifs: { ...NOTIFS_DEFAUT, ...(p.notifs || {}) } };
        }
    } catch {
        /* ignore */
    }
    return VIDE;
}
function writeCache(who: string, data: Espace) {
    try {
        localStorage.setItem(cacheKey(who), JSON.stringify(data));
    } catch {
        /* quota / privé */
    }
}

// ─── Mapping serveur → client ────────────────────────────────────────────────
const mapSuivi = (r: any): AideSuivie => ({ id: String(r.id), aideId: r.aide_id ?? undefined, nom: r.nom, statut: r.statut, action: r.action ?? undefined, echeanceISO: r.echeance ?? undefined });
const mapEch = (r: any): Echeance => ({ id: String(r.id), dateISO: r.date, label: r.label, type: r.type, detail: r.detail ?? undefined, aideId: r.suivi_aide_id ? String(r.suivi_aide_id) : undefined });
const mapDoc = (r: any): DocItem => ({ id: String(r.id), nom: r.nom, cerfa: r.cerfa ?? undefined, url: r.url ?? undefined, dateISO: r.created_at ?? new Date().toISOString() });

async function api(path: string, token: string, options: RequestInit = {}) {
    const res = await fetch(`${getApiBase()}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? null : res.json();
}

// ─── Dérivations ─────────────────────────────────────────────────────────────
export function joursRestants(dateISO: string): number {
    const d = new Date(dateISO);
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((d.getTime() - debut.getTime()) / 86400000);
}

export function alertesDerivees(e: Espace): { kind: "echeance" | "justificatif"; texte: string }[] {
    const out: { kind: "echeance" | "justificatif"; texte: string }[] = [];
    if (e.notifs.rappels) {
        for (const ech of e.echeances) {
            const j = joursRestants(ech.dateISO);
            if (j >= 0 && j <= 15) out.push({ kind: "echeance", texte: `Il vous reste ${j} jour${j > 1 ? "s" : ""} pour : ${ech.label}` });
        }
    }
    if (e.notifs.alertes) {
        for (const a of e.suivi) {
            if (a.statut === "À compléter") out.push({ kind: "justificatif", texte: `Un justificatif est requis pour « ${a.nom} »` });
        }
    }
    return out;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useEspace() {
    const [who, setWho] = useState<string>("guest");
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState<Espace>(VIDE);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const { id, token: tk } = currentUser();
        const key = id ?? "guest";
        setWho(key);
        setToken(tk);
        setData(readCache(key)); // affichage immédiat depuis le cache

        if (id && tk) {
            api("/me/espace", tk)
                .then((srv) => {
                    const next: Espace = {
                        suivi: (srv.suivi || []).map(mapSuivi),
                        echeances: (srv.echeances || []).map(mapEch),
                        documents: (srv.documents || []).map(mapDoc),
                        notifs: { ...NOTIFS_DEFAUT, ...(srv.notifs || {}) },
                    };
                    setData(next);
                    writeCache(key, next);
                })
                .catch(() => {/* hors-ligne : on garde le cache */})
                .finally(() => setReady(true));
        } else {
            setReady(true);
        }
    }, []);

    const online = !!token && who !== "guest";

    const commit = useCallback((patch: (p: Espace) => Espace) => {
        setData((prev) => {
            const next = patch(prev);
            writeCache(who, next);
            return next;
        });
    }, [who]);

    // --- Aides suivies ---
    const ajouterAide = (nom: string, statut: Statut, aideId?: number) => {
        const temp = uid();
        commit((p) => ({ ...p, suivi: [...p.suivi, { id: temp, nom, statut, aideId }] }));
        if (online && token) {
            api("/me/suivi", token, { method: "POST", body: JSON.stringify({ nom, statut, aide_id: aideId ?? null }) })
                .then((row) => commit((p) => ({ ...p, suivi: p.suivi.map((a) => (a.id === temp ? mapSuivi(row) : a)) })))
                .catch(() => {/* conservé en cache */});
        }
    };

    const changerStatut = (id: string, statut: Statut) => {
        commit((p) => ({ ...p, suivi: p.suivi.map((a) => (a.id === id ? { ...a, statut } : a)) }));
        if (online && token && /^\d+$/.test(id)) api(`/me/suivi/${id}`, token, { method: "PATCH", body: JSON.stringify({ statut }) }).catch(() => {});
    };

    const retirerAide = (id: string) => {
        commit((p) => ({ ...p, suivi: p.suivi.filter((a) => a.id !== id), echeances: p.echeances.filter((e) => e.aideId !== id) }));
        if (online && token && /^\d+$/.test(id)) api(`/me/suivi/${id}`, token, { method: "DELETE" }).catch(() => {});
    };

    // --- Échéances ---
    const ajouterEcheance = (ech: Omit<Echeance, "id">) => {
        const temp = uid();
        commit((p) => ({ ...p, echeances: [...p.echeances, { ...ech, id: temp }] }));
        if (online && token) {
            api("/me/echeances", token, { method: "POST", body: JSON.stringify({ date: ech.dateISO, label: ech.label, type: ech.type, detail: ech.detail ?? null }) })
                .then((row) => commit((p) => ({ ...p, echeances: p.echeances.map((e) => (e.id === temp ? mapEch(row) : e)) })))
                .catch(() => {});
        }
    };

    const retirerEcheance = (id: string) => {
        commit((p) => ({ ...p, echeances: p.echeances.filter((e) => e.id !== id) }));
        if (online && token && /^\d+$/.test(id)) api(`/me/echeances/${id}`, token, { method: "DELETE" }).catch(() => {});
    };

    // --- Documents ---
    const ajouterDocument = (doc: Omit<DocItem, "id" | "dateISO"> & { dateISO?: string }) => {
        const temp = uid();
        commit((p) => ({ ...p, documents: [...p.documents, { id: temp, dateISO: new Date().toISOString(), ...doc }] }));
        if (online && token) {
            api("/me/documents", token, { method: "POST", body: JSON.stringify({ nom: doc.nom, cerfa: doc.cerfa ?? null, url: doc.url ?? null }) })
                .then((row) => commit((p) => ({ ...p, documents: p.documents.map((d) => (d.id === temp ? mapDoc(row) : d)) })))
                .catch(() => {});
        }
    };

    const retirerDocument = (id: string) => {
        commit((p) => ({ ...p, documents: p.documents.filter((d) => d.id !== id) }));
        if (online && token && /^\d+$/.test(id)) api(`/me/documents/${id}`, token, { method: "DELETE" }).catch(() => {});
    };

    // --- Préférences de notification ---
    const setNotifs = (notifs: Notifs) => {
        commit((p) => ({ ...p, notifs }));
        if (online && token) api("/me/notifs", token, { method: "PUT", body: JSON.stringify(notifs) }).catch(() => {});
    };

    return {
        ready,
        online,
        data,
        alertes: alertesDerivees(data),
        ajouterAide,
        changerStatut,
        retirerAide,
        ajouterEcheance,
        retirerEcheance,
        ajouterDocument,
        retirerDocument,
        setNotifs,
    };
}
