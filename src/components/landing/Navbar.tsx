"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Future proper links, anchors for now as requested
    const navLinks = [
        // { name: "Fonctionnalités", href: "#features" },

        { name: "Dictionnaire", href: "/dictionary" },
        { name: "Guide de Survie", href: "/guide" },
        { name: "Calculateur", href: "/calculateur" },
        { name: "Générateur de facture", href: "/facture" },
        // { name: "Guide Aides", href: "/guide" },
        { name: "Contact", href: "/contact" },
        // { name: "La Ruche", href: "#community" },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm" />

                <div className="relative container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-Fond-Blanc.svg"
                            alt="Logo Phobee"
                            className="h-48 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* <span className="text-xl font-bold text-secondary tracking-tight">Phobee</span> */}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop GTA */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <Link
                                href="/profile"
                                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Mon Espace
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    S'enregistrer
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 text-secondary hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-xs bg-white shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-4 flex items-center justify-between border-b">
                                <span className="text-lg font-bold text-secondary">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium text-slate-700 hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-auto pt-6 border-t flex flex-col gap-4">
                                    {isLoggedIn ? (
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                        >
                                            Mon Espace
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-3 text-center font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                            >
                                                Se connecter
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full py-3 text-center font-bold text-primary-foreground bg-primary rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                            >
                                                S'enregistrer
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence >
        </>
    );
}
