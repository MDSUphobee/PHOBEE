"use client";

import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-20 pb-20">


            <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
                <div className="col-span-2 md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-4">
                        <img
                            src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-ToutBlanc.svg"
                            alt="Logo Phobee"
                            className="h-32 w-auto"
                        />
                        {/* <span className="text-xl font-bold tracking-tight text-white">Phobee</span> */}
                    </Link>
                    <p className="text-slate-400 text-sm">
                        L'assistant administratif intelligent pour les micro-entrepreneurs.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Nos services</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/calculateur" className="hover:text-white transition-colors">Calculateur</Link></li>
                        <li><Link href="/facture" className="hover:text-white transition-colors">Générer une facture</Link></li>
                        <li><Link href="/profile" className="hover:text-white transition-colors">Profil</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Ressources</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/dictionary" className="hover:text-white transition-colors">Dictionnaire</Link></li>
                        <li><Link href="/guide" className="hover:text-white transition-colors">Guide de survie</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Légal</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                <p>© 2024 Phobee. Tous droits réservés.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    {/* <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link> */}
                    <Link
                        href="https://www.instagram.com/phobee.fr/?utm_source=ig_web_button_share_sheet"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        aria-label="Instagram Phobee"
                    >
                        <Instagram className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </footer >
    );
}
