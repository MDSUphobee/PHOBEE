import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, FileCheck } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: Aides & Subventions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileCheck className="h-6 w-6 text-primary" />
                            Aides & Subventions
                        </CardTitle>
                        <CardDescription>
                            Identifiez et demandez les aides auxquelles vous êtes éligible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/questionnaire">
                            <Button className="w-full">Accéder aux formulaires</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Module 2: Calendrier & Rappels */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-primary" />
                            Calendrier & Rappels
                        </CardTitle>
                        <CardDescription>
                            Visualisez vos prochaines échéances administratives et fiscales.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" disabled>
                            À venir
                        </Button>
                    </CardContent>
                </Card>

                {/* Module 3: Espace Personnel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" />
                            Espace Personnel
                        </CardTitle>
                        <CardDescription>
                            Gérez votre profil, votre entreprise et votre abonnement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/profile">
                            <Button variant="outline" className="w-full">Gérer mon profil</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Module 4: Documents Automatiques */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Documents Automatiques
                        </CardTitle>
                        <CardDescription>
                            Générez vos documents et envoyez-les en recommandé (API Poste).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Link to a future documents page, using /facture for now as placeholder or creating new */}
                        <Link href="/facture">
                            <Button variant="outline" className="w-full">Générer un document</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
