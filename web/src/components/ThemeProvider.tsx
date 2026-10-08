"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    /** Bascule le thème. Passe les coordonnées du clic pour l'animation circulaire. */
    toggleTheme: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const themeRef = useRef<Theme>("light");

    // Synchronise avec le stockage et le media query.
    useEffect(() => {
        const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
        const prefersDark =
            typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
    }, []);

    // Applique la classe sur <html> et persiste.
    useEffect(() => {
        if (typeof document === "undefined") return;
        themeRef.current = theme;
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = (origin?: { x: number; y: number }) => {
        const next: Theme = themeRef.current === "dark" ? "light" : "dark";

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Pas de View Transitions (navigateur non compatible ou motion réduit) → bascule simple.
        if (
            typeof document === "undefined" ||
            typeof (document as Document & { startViewTransition?: unknown }).startViewTransition !== "function" ||
            prefersReducedMotion
        ) {
            setTheme(next);
            return;
        }

        // Point d'origine du cercle : le clic, sinon le centre de l'écran.
        const x = origin?.x ?? window.innerWidth / 2;
        const y = origin?.y ?? window.innerHeight / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const root = document.documentElement;

        const transition = (document as Document & {
            startViewTransition: (cb: () => void) => { ready: Promise<void> };
        }).startViewTransition(() => {
            // On applique le thème de façon synchrone pour que le snapshot "new" soit déjà dans le bon thème.
            root.classList.toggle("dark", next === "dark");
            flushSync(() => setTheme(next));
        });

        transition.ready.then(() => {
            root.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 550,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme doit être utilisé à l'intérieur de ThemeProvider");
    }
    return context;
}
