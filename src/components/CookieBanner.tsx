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

    return (
        <div className="fixed inset-x-4 bottom-4 z-50">
            <div className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/95 backdrop-blur shadow-xl shadow-black/5 dark:shadow-black/30">
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
