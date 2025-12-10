"use client";

import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-20 pb-10">

            {/* CTA Final */}
            <div className="container mx-auto px-4 md:px-6 mb-20">
                <div className="bg-primary rounded-3xl p-12 text-center md:text-left md:flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500" />

                    <div className="relative z-10 mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Prêt à tuer la phobie ?</h2>
                        <p className="text-secondary/80 font-medium">Rejoins les 1200+ indépendants sereins.</p>
                    </div>

                    <div className="relative z-10">
                        <Link href="/signup" className="inline-block bg-secondary text-white px-8 py-4 rounded-full font-bold hover:scale-105 hover:shadow-xl transition-all duration-300">
                            Commencer maintenant
                        </Link>
                    </div>
                </div>
            </div>

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
