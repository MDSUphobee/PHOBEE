"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../ThemeProvider";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();

    // Navbar bleue uniquement sur l'accueil ; blanche (comme le fond) sur les autres pages.
    const pathname = usePathname();
    const isHome = pathname === "/";
    // Logo clair (sur fond foncé) sur l'accueil et en dark mode ; logo foncé (sur fond blanc) ailleurs.
    const useLightLogo = isHome || theme === "dark";

    const espaceLinks = [
        { name: "Mon profil", href: "/profile" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Calendrier", href: "/calendrier" },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.assign("/");
    };

    // Ferme le menu "Mon espace" au clic extérieur / Échap
    useEffect(() => {
        if (!menuOpen) return;
        const onClick = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Masque la navbar quand on scrolle vers le bas (réapparaît en remontant) — surtout utile sur mobile
    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const currentY = window.scrollY;
            // en haut de page : toujours visible
            if (currentY < 80) {
                setHidden(false);
            } else if (currentY > lastY + 6) {
                // on descend
                setHidden(true);
            } else if (currentY < lastY - 6) {
                // on remonte
                setHidden(false);
            }
            lastY = currentY;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Future proper links, anchors for now as requested
    const navLinks = [
        { name: "Notre tarif", href: "/abonnements" },
        { name: "Le dictionnaire de l'entrepreneur", href: "/dictionary" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            <header
                suppressHydrationWarning={true}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
                    // caché seulement sur mobile ; sur md+ la navbar reste toujours visible
                    hidden ? "-translate-y-full md:translate-y-0" : "translate-y-0"
                )}
            >
                <div
                    suppressHydrationWarning={true}
                    className={cn(
                        "absolute inset-0 backdrop-blur-[6px] border-b-[0.8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
                        isHome
                            ? "bg-[#14233c] border-[rgba(30,41,59,0.6)]"
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    )}
                />

                <div suppressHydrationWarning={true} className="relative container mx-auto px-4 md:px-6 h-[80px] flex items-center gap-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src={useLightLogo
                                ? "/Logo PhoBee/Logo PhoBee/Logo-Phobee-Fond-Noir.svg"
                                : "/Logo PhoBee/Logo PhoBee/Logo-Phobee-Fond-Blanc.svg"}
                            alt="Logo Phobee"
                            className="h-32 md:h-44 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full",
                                    isHome ? "text-[#e2e8f0]" : "text-[#14233c] dark:text-[#e2e8f0]"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4 ml-auto">
                        <button
                            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
                            aria-label="Basculer le thème"
                            className={cn(
                                "p-2 rounded-full border hover:text-primary transition-all shadow-sm",
                                isHome
                                    ? "border-[#334155] bg-[rgba(30,41,59,0.8)] text-white"
                                    : "border-slate-300 bg-slate-100 text-[#14233c] dark:border-[#334155] dark:bg-[rgba(30,41,59,0.8)] dark:text-white"
                            )}
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {isLoggedIn ? (
                            <div ref={menuRef} className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                                <button
                                    onClick={() => setMenuOpen((o) => !o)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Mon Espace
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-full w-56 pt-3">
                                    <div role="menu" className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 py-2 shadow-[0_1px_10px_rgba(0,0,0,0.25)]">
                                        {espaceLinks.map((l) => (
                                            <Link
                                                key={l.href}
                                                href={l.href}
                                                role="menuitem"
                                                onClick={() => setMenuOpen(false)}
                                                className="block px-5 py-2.5 text-sm font-medium text-[#14233c] dark:text-white hover:bg-[#deeefc] dark:hover:bg-slate-700 transition-colors"
                                            >
                                                {l.name}
                                            </Link>
                                        ))}
                                        <button
                                            role="menuitem"
                                            onClick={logout}
                                            className="block w-full border-t border-[#deeefc] dark:border-slate-700 px-5 py-2.5 text-left text-sm font-medium text-[#dc2626] hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={cn(
                                        "px-4 py-2 text-base font-medium hover:text-primary transition-colors",
                                        isHome ? "text-[#f8fafc]" : "text-[#14233c] dark:text-[#f8fafc]"
                                    )}
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href="/inscription"
                                    className="px-6 py-2.5 bg-primary text-primary-foreground text-base font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile : bouton dark/light uniquement — la navigation se fait via la barre du bas */}
                    <button
                        onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
                        aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                        className={cn(
                            "md:hidden ml-auto p-2 rounded-full border hover:text-primary transition-colors",
                            isHome
                                ? "border-[#334155] bg-[rgba(30,41,59,0.8)] text-white"
                                : "border-slate-300 bg-slate-100 text-[#14233c] dark:border-[#334155] dark:bg-[rgba(30,41,59,0.8)] dark:text-white"
                        )}
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </header>
        </>
    );
}
