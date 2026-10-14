"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentStatus = "accepted" | "rejected";

const STORAGE_KEY = "phobee_cookie_consent_v1";

const getStoredConsent = (): ConsentStatus | null => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
};

export function CookieBanner() {
    const [consent, setConsent] = useState<ConsentStatus | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setConsent(getStoredConsent());
        setMounted(true);
    }, []);

    const handleChoice = (choice: ConsentStatus) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, choice);
        }
        setConsent(choice);
    };

    if (!mounted || consent) return null;

    // Sur mobile, on remonte le bandeau au-dessus de la MobileBottomBar (z-[55], fixée en bas)
    // pour que les boutons restent cliquables ; sur desktop (barre masquée) il reste en bas.
    return (
        <div className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[56] md:bottom-4">
            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl shadow-black/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                <div className="flex flex-col gap-4 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm sm:text-base font-semibold text-foreground">Gestion des cookies</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Nous utilisons des cookies pour améliorer votre expérience et mesurer l&apos;audience. Vous pouvez refuser si vous le
                            souhaitez. En savoir plus dans nos{" "}
                            <Link href="/mentions-legales" className="font-semibold text-primary hover:underline">
                                mentions légales
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => handleChoice("rejected")}
                            className="rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                        >
                            Refuser
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChoice("accepted")}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                        >
                            Accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
