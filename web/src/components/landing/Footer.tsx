"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800 pb-16 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            <img
                                src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-ToutBlanc.svg"
                                alt="Logo Phobee"
                                className="h-36 w-36 object-contain"
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            L'assistant administratif intelligent pensé pour les micro-entrepreneurs.
                            Gagnez du temps, évitez les erreurs.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h4 className="font-bold mb-6 text-[#FFD700]">Nos services</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            {/* <li><Link href="/calculateur" className="hover:text-white transition-colors">Calculateur</Link></li> */}
                            <li><Link href="/facture" className="hover:text-white transition-colors">Générer une facture</Link></li>
                            <li><Link href="/profile" className="hover:text-white transition-colors">Profil</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-6 text-[#FFD700]">Ressources</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/dictionary" className="hover:text-white transition-colors">Dictionnaire</Link></li>
                            <li><Link href="/guide" className="hover:text-white transition-colors">Guide de survie</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold mb-6 text-[#FFD700]">Légal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
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
