"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, MessageCircle, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function MobileBottomBar() {
    const { theme, toggleTheme } = useTheme();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const btn =
        "flex h-12 w-12 items-center justify-center rounded-full bg-[#4a3416] text-[#FFCC00] transition-colors active:scale-95";

    return (
        <nav
            aria-label="Navigation mobile"
            className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden"
        >
            <div className="flex items-center gap-3 rounded-full border border-white/5 bg-[#161616] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                {/* Dark / light mode */}
                <button
                    type="button"
                    onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
                    aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                    className={btn}
                >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* Contact */}
                <Link href="/contact" aria-label="Contact" className={btn}>
                    <MessageCircle className="h-5 w-5" />
                </Link>

                {/* Compte */}
                <Link
                    href={isLoggedIn ? "/profile" : "/login"}
                    aria-label={isLoggedIn ? "Mon compte" : "Se connecter"}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFCC00] text-[#161616] transition-colors active:scale-95"
                >
                    <User className="h-5 w-5" />
                </Link>
            </div>
        </nav>
    );
}
