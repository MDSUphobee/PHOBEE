"use client";

import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-20 pb-10">


            <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-white/10 pb-12">
                <div className="col-span-2 md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-4">
                        <img
                            src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-ToutBlanc.svg"
                            alt="Logo Phobee"
                            className="h-9 w-auto"
                        />
                        <span className="text-xl font-bold tracking-tight text-white">Phobee</span>
                    </Link>
                    <p className="text-slate-400 text-sm">
                        L'assistant administratif intelligent pour les micro-entrepreneurs.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Produit</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Tarifs</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Témoignages</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Ressources</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Guide URSSAF</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Simulateur</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-primary">Légal</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Confidentialité</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">CGV</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                <p>© 2024 Phobee. Tous droits réservés.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                </div>
            </div>
        </footer>
    );
}
