import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from 'next/link';
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AbonnementsPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="container mx-auto py-24 flex-grow">
                <h1 className="text-4xl font-bold text-center mb-4">Nos Offres</h1>
                <p className="text-center text-muted-foreground mb-12">Choisissez le plan adapté à votre activité.</p>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Offre Gratuite */}
                    <div className="border rounded-xl p-6 flex flex-col bg-card">
                        <h3 className="text-xl font-bold mb-2">Découverte</h3>
                        <div className="text-3xl font-bold mb-4">Gratuit</div>
                        <p className="text-sm text-muted-foreground mb-6">Pour découvrir les aides disponibles.</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Questionnaire d'éligibilité</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Liste des aides (restreinte)</li>
                        </ul>
                        <Link href="/signup">
                            <Button variant="outline" className="w-full">Commencer gratuitement</Button>
                        </Link>
                    </div>

                    {/* Offre Standard */}
                    <div className="border border-primary rounded-xl p-6 flex flex-col bg-card relative shadow-lg">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">Populaire</div>
                        <h3 className="text-xl font-bold mb-2">Essentiel</h3>
                        <div className="text-3xl font-bold mb-4">9€<span className="text-sm font-normal">/mois</span></div>
                        <p className="text-sm text-muted-foreground mb-6">L'assistant complet pour votre sérénité.</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Tout du plan Découverte</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Accès complet aux aides</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Calendrier & Rappels illimités</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> 1 Envoi recommandé / mois offert</li>
                        </ul>
                        <Link href="/signup?plan=essentiel">
                            <Button className="w-full">Choisir Essentiel</Button>
                        </Link>
                    </div>

                    {/* Offre Pro */}
                    <div className="border rounded-xl p-6 flex flex-col bg-card">
                        <h3 className="text-xl font-bold mb-2">Premium</h3>
                        <div className="text-3xl font-bold mb-4">19€<span className="text-sm font-normal">/mois</span></div>
                        <p className="text-sm text-muted-foreground mb-6">Pour les entrepreneurs exigeants.</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Tout du plan Essentiel</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Support prioritaire</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> 3 Envois recommandés / mois</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Assistance juridique (IA)</li>
                        </ul>
                        <Link href="/signup?plan=premium">
                            <Button variant="outline" className="w-full">Choisir Premium</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
