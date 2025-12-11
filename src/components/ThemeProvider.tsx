"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    // Synchronise avec le stockage et le media query.
    useEffect(() => {
        const stored = (typeof window !== "undefined" && (localStorage.getItem("theme") as Theme | null)) ?? null;
        const prefersDark =
            typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = stored ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
    }, []);

    // Applique la classe sur <html> et persiste.
    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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

