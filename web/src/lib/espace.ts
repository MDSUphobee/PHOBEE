"use client";

/**
 * Espace personnel — stockage par utilisateur (localStorage).
 *
 * Approche "mix pragmatique" :
 *  - aides en cours : noms réels tirés de l'API /aides, suivi + statut gérés par l'utilisateur ;
 *  - calendrier / échéances : persistées, ajout manuel + échéances dérivées des aides suivies ;
 *  - documents : CERFA générés / ajoutés par l'utilisateur ;
 *  - alertes : dérivées (statuts + échéances proches), filtrées par les préférences de notification ;
 *  - notifications : préférences.
 *
 * Tout est rattaché à l'utilisateur connecté (clé phobee:espace:v1:<userId>).
 */

import { useCallback, useEffect, useState } from "react";

export type Statut = "À compléter" | "En cours" | "Acceptée";
export const STATUTS: Statut[] = ["À compléter", "En cours", "Acceptée"];

export type TypeEcheance = "Déclaration" | "Aide" | "Justificatif";
export const TYPES_ECHEANCE: TypeEcheance[] = ["Déclaration", "Aide", "Justificatif"];

export type AideSuivie = {
    id: string;
    aideId?: number;
    nom: string;
    statut: Statut;
    action?: string;
    echeanceISO?: string; // échéance éventuelle liée à l'aide
};

export type Echeance = {
    id: string;
    dateISO: string;
    label: string;
    type: TypeEcheance;
    detail?: string;
    aideId?: string; // id d'une AideSuivie si dérivée
};

export type DocItem = {
    id: string;
    nom: string;
    cerfa?: string;
    dateISO: string;
    url?: string; // lien de téléchargement si disponible (ex. CERFA généré)
};

export type Notifs = { rappels: boolean; aides: boolean; alertes: boolean };

export type Espace = {
    suivi: AideSuivie[];
    echeances: Echeance[];
    documents: DocItem[];
    notifs: Notifs;
};

export const NOTIFS_DEFAUT: Notifs = { rappels: true, aides: true, alertes: true };

const VIDE: Espace = { suivi: [], echeances: [], documents: [], notifs: NOTIFS_DEFAUT };

export const uid = () =>
    (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`);

function currentUserId(): string | null {
    try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        return u?.id != null ? String(u.id) : null;
    } catch {
        return null;
    }
}

function storageKey(userId: string) {
    return `phobee:espace:v1:${userId}`;
}

function read(userId: string): Espace {
    try {
        const raw = localStorage.getItem(storageKey(userId));
        if (raw) {
            const parsed = JSON.parse(raw);
            return { ...VIDE, ...parsed, notifs: { ...NOTIFS_DEFAUT, ...(parsed.notifs || {}) } };
        }
    } catch {
        /* ignore */
    }
    // Migration douce depuis l'ancienne clé "notifications" du profil.
    let notifs = NOTIFS_DEFAUT;
    try {
        const old = JSON.parse(localStorage.getItem("notifications") || "null");
        if (old) notifs = { ...NOTIFS_DEFAUT, ...old };
    } catch {
        /* ignore */
    }
    return { ...VIDE, notifs };
}

function write(userId: string, data: Espace) {
    try {
        localStorage.setItem(storageKey(userId), JSON.stringify(data));
    } catch {
        /* quota / mode privé : on ignore */
    }
}

/** Échéance proche = dans les `jours` prochains jours (par défaut 15). */
export function joursRestants(dateISO: string): number {
    const d = new Date(dateISO);
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((d.getTime() - debut.getTime()) / 86400000);
}

/** Alertes dérivées de l'état (suivi + échéances), filtrées par préférences. */
export function alertesDerivees(e: Espace): { kind: "echeance" | "justificatif" | "aide"; texte: string }[] {
    const out: { kind: "echeance" | "justificatif" | "aide"; texte: string }[] = [];

    if (e.notifs.rappels) {
        for (const ech of e.echeances) {
            const j = joursRestants(ech.dateISO);
            if (j >= 0 && j <= 15) {
                out.push({ kind: "echeance", texte: `Il vous reste ${j} jour${j > 1 ? "s" : ""} pour : ${ech.label}` });
            }
        }
    }
    if (e.notifs.alertes) {
        for (const a of e.suivi) {
            if (a.statut === "À compléter") {
                out.push({ kind: "justificatif", texte: `Un justificatif est requis pour « ${a.nom} »` });
            }
        }
    }
    return out;
}

/** Hook principal : état + mutateurs persistés, rattaché à l'utilisateur connecté. */
export function useEspace() {
    const [userId, setUserId] = useState<string | null>(null);
    const [data, setData] = useState<Espace>(VIDE);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const id = currentUserId();
        setUserId(id);
        if (id) setData(read(id));
        setReady(true);
    }, []);

    const update = useCallback(
        (patch: Partial<Espace> | ((prev: Espace) => Espace)) => {
            setData((prev) => {
                const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
                if (userId) write(userId, next);
                return next;
            });
        },
        [userId],
    );

    // --- Mutateurs métier ---
    const ajouterAide = (nom: string, statut: Statut, aideId?: number) =>
        update((p) => ({ ...p, suivi: [...p.suivi, { id: uid(), nom, statut, aideId }] }));

    const changerStatut = (id: string, statut: Statut) =>
        update((p) => ({ ...p, suivi: p.suivi.map((a) => (a.id === id ? { ...a, statut } : a)) }));

    const retirerAide = (id: string) =>
        update((p) => ({
            ...p,
            suivi: p.suivi.filter((a) => a.id !== id),
            echeances: p.echeances.filter((e) => e.aideId !== id),
        }));

    const ajouterEcheance = (ech: Omit<Echeance, "id">) =>
        update((p) => ({ ...p, echeances: [...p.echeances, { ...ech, id: uid() }] }));

    const retirerEcheance = (id: string) =>
        update((p) => ({ ...p, echeances: p.echeances.filter((e) => e.id !== id) }));

    const ajouterDocument = (doc: Omit<DocItem, "id" | "dateISO"> & { dateISO?: string }) =>
        update((p) => ({
            ...p,
            documents: [...p.documents, { id: uid(), dateISO: new Date().toISOString(), ...doc }],
        }));

    const retirerDocument = (id: string) =>
        update((p) => ({ ...p, documents: p.documents.filter((d) => d.id !== id) }));

    const setNotifs = (notifs: Notifs) => {
        update((p) => ({ ...p, notifs }));
        try {
            localStorage.setItem("notifications", JSON.stringify(notifs)); // compat ancienne clé
        } catch {
            /* ignore */
        }
    };

    return {
        ready,
        userId,
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
