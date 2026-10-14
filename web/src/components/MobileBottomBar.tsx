"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    Tag,
    BookOpen,
    MessageCircle,
    User,
    LayoutDashboard,
    CalendarDays,
    LogOut,
    LogIn,
    UserPlus,
    X,
    type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = { href: string; label: string; icon: LucideIcon; match: (p: string) => boolean };

// Pages qui font partie de l'espace "Compte"
const ACCOUNT_PATHS = ["/profile", "/dashboard", "/calendrier", "/mes-aides", "/radar-aides", "/login", "/inscription", "/signup"];

export default function MobileBottomBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // La barre vit dans le layout racine (montée une seule fois). On relit donc le token
    // à chaque navigation (pathname) + sur l'événement storage, sinon l'état "connecté"
    // reste figé après un login en navigation côté client.
    useEffect(() => {
        const sync = () => {
            try {
                setIsLoggedIn(!!localStorage.getItem("token"));
            } catch {
                setIsLoggedIn(false);
            }
        };
        sync();
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, [pathname]);

    // Ferme la feuille à chaque changement de page.
    // Feuille ouverte = vraie modale : focus dedans, Tab piégé, Échap ferme, focus rendu au bouton "Compte".
    useEffect(() => setSheetOpen(false), [pathname]);
    useEffect(() => {
        if (!sheetOpen) return;
        const trigger = triggerRef.current;
        const focusables = () =>
            Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
        focusables()[0]?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") return setSheetOpen(false);
            if (e.key !== "Tab") return;
            const els = focusables();
            if (!els.length) return;
            const first = els[0];
            const last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            trigger?.focus();
        };
    }, [sheetOpen]);

    const logout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch {
            /* WebView */
        }
        setSheetOpen(false);
        window.location.assign("/");
    };

    const tabs: Tab[] = [
        { href: "/", label: "Accueil", icon: Home, match: (p) => p === "/" },
        { href: "/abonnements", label: "Tarif", icon: Tag, match: (p) => p.startsWith("/abonnements") },
        { href: "/dictionary", label: "Dico", icon: BookOpen, match: (p) => p.startsWith("/dictionary") },
        { href: "/contact", label: "Contact", icon: MessageCircle, match: (p) => p.startsWith("/contact") },
    ];

    const accountActive = sheetOpen || ACCOUNT_PATHS.some((p) => pathname.startsWith(p));

    // Liens affichés dans la feuille
    const accountLinks = isLoggedIn
        ? [
              { href: "/profile", label: "Mon profil", icon: User },
              { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
              { href: "/calendrier", label: "Calendrier", icon: CalendarDays },
          ]
        : [
              { href: "/login", label: "Se connecter", icon: LogIn },
              { href: "/inscription", label: "S'inscrire", icon: UserPlus },
          ];

    const tabClass = (active: boolean) =>
        `flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full transition-colors active:scale-95 ${
            active ? "bg-[#FFCC00] text-[#14233c]" : "text-[#FFCC00]/80 hover:text-[#FFCC00]"
        }`;

    return (
        <>
            {/* ───────── Feuille "Compte" ───────── */}
            <AnimatePresence>
                {sheetOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSheetOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            ref={sheetRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mon espace"
                            className="fixed inset-x-0 bottom-0 z-[65] rounded-t-3xl bg-[#14233c] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-3 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.45)] md:hidden"
                        >
                            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
                            <div className="mb-2 flex items-center justify-between px-2">
                                <span className="text-base font-bold">Mon espace</span>
                                <button
                                    type="button"
                                    onClick={() => setSheetOpen(false)}
                                    aria-label="Fermer"
                                    className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <nav className="flex flex-col">
                                {accountLinks.map((l) => {
                                    const Icon = l.icon;
                                    return (
                                        <Link
                                            key={l.href}
                                            href={l.href}
                                            onClick={() => setSheetOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                                        >
                                            <Icon className="h-5 w-5 text-[#FFCC00]" />
                                            {l.label}
                                        </Link>
                                    );
                                })}

                                {isLoggedIn && (
                                    <button
                                        onClick={logout}
                                        className="mt-1 flex items-center gap-3 rounded-xl border-t border-white/10 px-3 py-3.5 text-left text-[15px] font-medium text-red-400 transition-colors hover:bg-white/10"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Déconnexion
                                    </button>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ───────── Barre d'onglets ───────── */}
            <nav
                aria-label="Navigation mobile"
                className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden"
            >
                <div className="flex items-center gap-1 rounded-full border border-white/5 bg-[#14233c] px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                    {tabs.map((tab) => {
                        const active = tab.match(pathname);
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                aria-label={tab.label}
                                aria-current={active ? "page" : undefined}
                                className={tabClass(active)}
                            >
                                <Icon className="h-[22px] w-[22px]" />
                                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                            </Link>
                        );
                    })}

                    {/* Onglet Compte : ouvre la feuille de l'espace */}
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => setSheetOpen((o) => !o)}
                        aria-label="Mon compte"
                        aria-haspopup="dialog"
                        aria-expanded={sheetOpen}
                        className={tabClass(accountActive)}
                    >
                        <User className="h-[22px] w-[22px]" />
                        <span className="text-[10px] font-medium leading-none">Compte</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
