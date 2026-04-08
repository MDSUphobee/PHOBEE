import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/landing/Navbar";

export default function FAQPage() {
    return (

        <div className="container mx-auto py-12 max-w-3xl">
            <Navbar/>
            <h1 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes</h1>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Comment Phobee détecte-t-il mes aides ?</AccordionTrigger>
                    <AccordionContent>
                        Phobee analyse votre profil d'entrepreneur (statut, chiffre d'affaires, secteur) via notre questionnaire intelligent et le compare à notre base de données d'aides et subventions mises à jour en temps réel.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Est-ce que mes données sont sécurisées ?</AccordionTrigger>
                    <AccordionContent>
                        Absolument. Vos données sont chiffrées et stockées sur des serveurs sécurisés. Nous ne vendons jamais vos données à des tiers.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Comment fonctionne l'envoi recommandé ?</AccordionTrigger>
                    <AccordionContent>
                        Nous sommes connectés directement à l'API de La Poste. Lorsque vous validez un document, nous l'envoyons électroniquement à La Poste qui l'imprime, le met sous pli et le distribue en Lettre Recommandée avec Accusé de Réception.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Puis-je annuler mon abonnement à tout moment ?</AccordionTrigger>
                    <AccordionContent>
                        Oui, nos offres sont sans engagement. Vous pouvez stopper votre abonnement depuis votre Espace Personnel en un clic.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
