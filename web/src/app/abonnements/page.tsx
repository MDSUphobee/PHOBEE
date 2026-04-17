"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap, TrendingUp, FileText, Landmark } from "lucide-react";
import Link from 'next/link';
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AbonnementsPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="container mx-auto py-24 flex-grow px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Notre <span className="text-[#FFD700]">Business Model</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Un accompagnement sur mesure, adapté à la réalité de votre exploitation.
                        On ne gagne que si <span className="font-bold text-foreground">vous gagnez</span>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Model 1: CERFA */}
                    <div className="relative border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 bg-card shadow-xl overflow-hidden flex flex-col h-full hover:border-[#FFD700] transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-[#FFD700]/10 p-3 rounded-2xl">
                                <FileText className="h-8 w-8 text-[#FFD700]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Model 1</h2>
                                <p className="text-[#FFD700] font-bold">Génération de CERFA</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">Principe :</h3>
                            <p className="text-muted-foreground">L'agriculteur paie uniquement à la génération du CERFA, selon la complexité du formulaire.</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
                            <h3 className="font-bold text-lg">Tarification :</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="font-medium">CERFA Simple</span>
                                    <span className="text-2xl font-black text-[#FFD700]">5€</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="font-medium">CERFA Standard</span>
                                    <span className="text-2xl font-black text-[#FFD700]">10€</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-[#FFD700] shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium">CERFA Complexe*</span>
                                        <span className="text-[10px] text-muted-foreground italic">*Ex: Déclaration MSA</span>
                                    </div>
                                    <span className="text-2xl font-black text-[#FFD700]">15€</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/signup" className="w-full">
                            <Button className="w-full h-12 font-bold bg-[#FFD700] hover:bg-[#FFD700]/90 text-slate-900 rounded-full">
                                Générer un document
                            </Button>
                        </Link>
                    </div>

                    {/* Model 2: Subventions */}
                    <div className="relative border-2 border-[#FFD700] rounded-[2.5rem] p-8 md:p-10 bg-card shadow-2xl overflow-hidden flex flex-col h-full">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl -z-10" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-[#FFD700]/20 p-3 rounded-2xl">
                                <Landmark className="h-8 w-8 text-[#FFD700]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Model 2</h2>
                                <p className="text-[#FFD700] font-bold">Aides & Subventions</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">Principe :</h3>
                            <p className="text-muted-foreground">L'agriculteur nous verse un pourcentage d'€ selon l'argent gagné grâce à la subvention.</p>
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
                            <h3 className="font-bold text-lg">Grille tarifaire :</h3>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#FFD700]/10 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3 font-bold">Montant de l'aide</th>
                                            <th className="px-4 py-3 font-bold text-right">Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                        <tr>
                                            <td className="px-4 py-3">&lt; 1 000€</td>
                                            <td className="px-4 py-3 text-right text-green-600 font-bold">0%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">1 000 - 5 000€</td>
                                            <td className="px-4 py-3 text-right font-black">10%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">5 001 - 15 000€</td>
                                            <td className="px-4 py-3 text-right font-black">7%</td>
                                        </tr>
                                        <tr className="bg-[#FFD700]/5">
                                            <td className="px-4 py-3">&gt; 15 000€</td>
                                            <td className="px-4 py-3 text-right font-black text-[#FFD700]">5%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Link href="/radar-aides" className="w-full">
                            <Button className="w-full h-14 text-lg font-bold bg-[#FFD700] hover:bg-[#FFD700]/90 text-slate-900 rounded-full">
                                Optimiser mes aides
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
                    <div className="text-center p-6">
                        <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                        <h4 className="font-bold mb-2">Risque Zéro</h4>
                        <p className="text-sm text-muted-foreground">Si vous ne recevez pas de subvention, vous ne payez rien pour le montage.</p>
                    </div>
                    <div className="text-center p-6">
                        <TrendingUp className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                        <h4 className="font-bold mb-2">Alignement Total</h4>
                        <p className="text-sm text-muted-foreground">Nous optimisons chaque dossier pour décrocher le montant maximum.</p>
                    </div>
                    <div className="text-center p-6">
                        <Zap className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                        <h4 className="font-bold mb-2">100% Agriculteur</h4>
                        <p className="text-sm text-muted-foreground">Une expertise pointue sur les spécificités de votre métier.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}