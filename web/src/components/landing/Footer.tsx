"use client";

import Link from "next/link";
import { Instagram, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };

    const FooterSection = ({ id, title, links }: { id: string, title: string, links: { name: string, href: string }[] }) => {
        const isOpen = openSection === id;
        return (
            <div className="md:col-span-2 text-center sm:text-left border-b border-slate-800 md:border-none last:border-none py-2 md:py-0">
                <button
                    onClick={() => toggleSection(id)}
                    className="flex items-center justify-between w-full md:cursor-default"
                >
                    <h4 className="font-bold mb-0 md:mb-6 text-[#FFD700] text-sm md:text-base py-2 md:py-0">
                        {title}
                    </h4>
                    <ChevronDown className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="hidden md:block">
                    <ul className="space-y-3 text-xs md:text-sm text-slate-400">
                        {links.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="pt-2 pb-4 space-y-3 text-sm text-slate-400">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} onClick={() => setOpenSection(null)} className="hover:text-white transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <footer className="bg-[#0F172A] text-white pt-12 md:pt-16 pb-8 md:pb-12 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-8 md:pb-16 mb-8 md:mb-12">
                    {/* Brand */}
                    <div className="md:col-span-4 space-y-4 md:space-y-6 text-center sm:text-left">
                        <Link href="/" className="inline-block">
                            <img
                                src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-ToutBlanc.svg"
                                alt="Logo Phobee"
                                className="h-20 md:h-32 w-auto object-contain mx-auto sm:mx-0"
                            />
                        </Link>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                            L'assistant administratif intelligent pensé pour les micro-entrepreneurs.
                        </p>
                    </div>

                    {/* Links */}
                    <FooterSection
                        id="services"
                        title="Nos services"
                        links={[
                            { name: "Générer une facture", href: "/facture" },
                            { name: "Profil", href: "/profile" },
                        ]}
                    />

                    <FooterSection
                        id="ressources"
                        title="Ressources"
                        links={[
                            { name: "Dictionnaire", href: "/dictionary" },
                            { name: "Guide de survie", href: "/guide" },
                            { name: "Contact", href: "/contact" },
                        ]}
                    />

                    <FooterSection
                        id="legal"
                        title="Légal"
                        links={[
                            { name: "Mentions Légales", href: "/mentions-legales" },
                        ]}
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 text-center md:text-left">
                    <p>© 2024 Phobee. Tous droits réservés.</p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="https://www.instagram.com/phobee.fr/?utm_source=ig_web_button_share_sheet"
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#FFD700] hover:text-slate-900 transition-all"
                            aria-label="Instagram Phobee"
                        >
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer >
    );
}
