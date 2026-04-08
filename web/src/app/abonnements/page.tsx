"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Zap, TrendingUp } from "lucide-react";
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
                        On ne gagne que si <span className="text-[#FFD700]">vous gagnez</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Fini les abonnements mensuels qui pèsent sur votre trésorerie.
                        PhoBee devient votre partenaire de croissance, sans frais fixes.
                    </p>
                </div>

                {/* Main Pricing Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative border-2 border-[#FFD700] rounded-[2.5rem] p-8 md:p-12 bg-card shadow-2xl overflow-hidden">
                        {/* Décoration d'arrière-plan */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl -z-10" />

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Le Modèle PhoBee</h2>
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-3 text-lg">
                                        <div className="mt-1 bg-green-500/10 p-1 rounded-full">
                                            <Check className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span><strong>0€ / mois</strong> : Aucun frais fixe, jamais.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-lg">
                                        <div className="mt-1 bg-green-500/10 p-1 rounded-full">
                                            <Check className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span>Accès illimité à toutes les aides et formulaires.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-lg">
                                        <div className="mt-1 bg-green-500/10 p-1 rounded-full">
                                            <Check className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span>Rappels automatiques et calendrier inclus.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] text-center border border-slate-200 dark:border-slate-800">
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Commission unique</span>
                                <div className="my-4">
                                    <span className="text-6xl font-black text-slate-900 dark:text-white">2.5%</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                                    Uniquement si vous dépassez <br />
                                    <strong>1 000€ d'aides perçues / an</strong>.
                                </p>
                                <Link href="/signup">
                                    <Button className="w-full h-14 text-lg font-bold bg-[#FFD700] hover:bg-[#FFD700]/90 text-slate-900 rounded-full">
                                        Commencer maintenant
                                    </Button>
                                </Link>
                                <p className="mt-4 text-[10px] text-slate-400">
                                    En dessous de 1000€ perçus, l'outil est 100% gratuit.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center p-6">
                            <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                            <h4 className="font-bold mb-2">Risque Zéro</h4>
                            <p className="text-sm text-muted-foreground">Si vous ne recevez pas d'aide, vous ne payez rien.</p>
                        </div>
                        <div className="text-center p-6">
                            <TrendingUp className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                            <h4 className="font-bold mb-2">Alignement Total</h4>
                            <p className="text-sm text-muted-foreground">On se bat pour vous trouver le maximum d'aides possibles.</p>
                        </div>
                        <div className="text-center p-6">
                            <Zap className="w-10 h-10 mx-auto mb-4 text-[#FFD700]" />
                            <h4 className="font-bold mb-2">Tout Inclus</h4>
                            <p className="text-sm text-muted-foreground">Accès immédiat à toutes les fonctionnalités premium sans attendre.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}