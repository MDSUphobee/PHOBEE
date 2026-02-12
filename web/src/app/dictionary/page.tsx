"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Search, BookOpen } from "lucide-react";

interface Definition {
    term: string;
    definition: string;
}

interface LetterSection {
    letter: string;
    definitions: Definition[];
}

const DICTIONARY_DATA: LetterSection[] = [
    {
        letter: "A",
        definitions: [
            { term: "Abattement", definition: "Une réduction automatique qu'appliquent les impôts sur ton chiffre d'affaires pour estimer tes frais pro. En gros, ils font semblant que tu as gagné moins pour te taxer moins." },
            { term: "Acompte", definition: "Une partie de la somme (souvent 30%) que ton client te paie avant que tu commences le travail. Toujours utile pour sécuriser la mission !" },
            { term: "ACRE", definition: "Le super bonus de début. C'est une aide qui réduit tes cotisations sociales de 50% pendant ta première année (environ 11% au lieu de 22%)." },
            { term: "Activité mixte", definition: "Quand tu fais à la fois de la vente d'objets et du service (ex: un plombier qui vend le robinet et facture la pose)." },
            { term: "ARCE", definition: "Une aide de Pôle Emploi. Au lieu de toucher ton chômage tous les mois, ils te versent une grosse somme (60% de tes droits restants) en deux fois pour lancer ta boite." },
            { term: "ARE", definition: "L'Allocation de Retour à l'Emploi. C'est le nom technique de tes indemnités chômage mensuelles." },
            { term: "Assujetti à la TVA", definition: "Le moment où tu dois commencer à facturer la TVA à tes clients (quand tu dépasses les seuils)." },
            { term: "Avenant", definition: "Une modification d'un contrat ou d'un devis déjà signé. \"On change une règle en cours de route\"." },
            { term: "Ayant droit", definition: "Tes enfants ou ton conjoint s'ils sont rattachés à ta carte vitale." },
        ]
    },
    {
        letter: "B",
        definitions: [
            { term: "Bénéfice", definition: "Ce qu'il te reste dans la poche une fois que tu as payé toutes tes charges et tes frais. (Attention : en micro, on te taxe sur le CA, pas le bénéfice !)." },
            { term: "BIC", definition: "Bénéfices Industriels et Commerciaux. La catégorie d'impôt pour les commerçants et artisans." },
            { term: "BNC", definition: "Bénéfices Non Commerciaux. La catégorie d'impôt pour les professions libérales (consultants, graphistes, dév...)." },
        ]
    },
    {
        letter: "C",
        definitions: [
            { term: "CA (Chiffre d'Affaires)", definition: "La somme totale de toutes tes factures encaissées. C'est le chiffre sacré à déclarer à l'URSSAF." },
            { term: "Cessation d'activité", definition: "Fermer ta micro-entreprise." },
            { term: "CFE (Cotisation Foncière)", definition: "La \"taxe d'habitation\" de ton entreprise. À payer chaque année en décembre (sauf la première année civile où tu es exonéré !)." },
            { term: "CGV (Conditions Générales de Vente)", definition: "Le document (souvent écrit en tout petit) qui définit tes règles : délais de paiement, pénalités, etc. Obligatoire pour la vente aux particuliers." },
            { term: "CIPAV", definition: "La caisse de retraite pour certaines professions libérales (architectes, moniteurs de ski...). La plupart des autres sont au régime général maintenant." },
            { term: "Code APE (ou NAF)", definition: "Un code de 4 chiffres et 1 lettre (ex: 6201Z) qui dit à l'État quel est ton métier principal." },
            { term: "Compte bancaire dédié", definition: "Un compte séparé de ton compte perso pour tes activités pro. Pas obligé d'être un compte \"Professionnel\" payant, un compte courant classique suffit." },
            { term: "Cotisations Sociales", definition: "L'argent que tu verses à l'URSSAF. Ça paie ta sécu, ta retraite, tes allocations familiales." },
        ]
    },
    {
        letter: "D",
        definitions: [
            { term: "Date d'échéance", definition: "La date limite pour payer (une facture ou une cotisation). Après cette date, les ennuis (ou pénalités) commencent." },
            { term: "Débours", definition: "Quand tu achètes quelque chose pour le compte exact de ton client (ex: un nom de domaine) et qu'il te rembourse l'euro près. Ça ne compte pas dans ton CA." },
            { term: "Déclaration de CA", definition: "Le rituel mensuel ou trimestriel où tu dis à l'URSSAF combien tu as gagné." },
            { term: "Devis", definition: "Une proposition de prix écrite. Une fois signé par le client, ça devient un contrat officiel." },
            { term: "Domiciliation", definition: "L'adresse officielle de ton entreprise (souvent chez toi au début)." },
        ]
    },
    {
        letter: "E",
        definitions: [
            { term: "Exercice comptable", definition: "Ton année de travail. Pour les micro-entrepreneurs, c'est simple : du 1er janvier au 31 décembre." },
            { term: "Exigibilité", definition: "Le moment où une taxe ou une somme doit être payée." },
        ]
    },
    {
        letter: "F",
        definitions: [
            { term: "Facture", definition: "La preuve d'achat. Obligatoire entre professionnels. Elle doit comporter des mentions légales précises (ton SIRET, la mention TVA, etc.)." },
            { term: "Frais professionnels", definition: "Tes dépenses (ordi, essence, resto). En micro-entreprise, tu ne peux pas les déduire de tes impôts, mais c'est bien de les suivre pour savoir si tu es rentable." },
            { term: "Franchise en base de TVA", definition: "Le régime magique des micro-entrepreneurs qui permet de ne pas facturer la TVA. Tu es 20% moins cher que les grosses boites !" },
        ]
    },
    {
        letter: "G",
        definitions: [
            { term: "Guichet Unique", definition: "Le nouveau site internet de l'INPI (depuis 2023) où l'on doit faire toutes les démarches de création et modification d'entreprise." },
        ]
    },
    {
        letter: "I",
        definitions: [
            { term: "Immatriculation", definition: "L'acte de naissance de ton entreprise. C'est ce qui te donne ton numéro SIRET." },
            { term: "Impôt sur le Revenu (IR)", definition: "L'impôt annuel sur ce que tu gagnes." },
            { term: "Indemnités kilométriques", definition: "Un barème pour calculer ce que coûte l'utilisation de ta voiture perso pour le travail." },
        ]
    },
    {
        letter: "K",
        definitions: [
            { term: "KBIS", definition: "La carte d'identité de ton entreprise (pour les commerçants). Pour les artisans, c'est l'extrait D1. C'est la preuve que tu existes." },
        ]
    },
    {
        letter: "L",
        definitions: [
            { term: "Livre des recettes", definition: "Un cahier (ou fichier Excel) obligatoire où tu notes chronologiquement tout ce que tu gagnes (Date, Client, Montant, Mode de paiement)." },
        ]
    },
    {
        letter: "M",
        definitions: [
            { term: "Majoration", definition: "La punition si tu paies en retard (+5% ou +10% sur la somme due)." },
            { term: "Mentions obligatoires", definition: "Les infos qui doivent absolument figurer sur tes factures (SIRET, date, \"TVA non applicable...\", etc.)." },
            { term: "Mensuel / Trimestriel", definition: "Le rythme auquel tu as choisi de payer tes charges." },
        ]
    },
    {
        letter: "N",
        definitions: [
            { term: "Note de frais", definition: "Un document qui justifie une dépense pro payée avec ton argent perso." },
        ]
    },
    {
        letter: "P",
        definitions: [
            { term: "Plafond de CA", definition: "La limite à ne pas dépasser pour rester micro-entrepreneur (environ 77k€ pour les services, 188k€ pour la vente)." },
            { term: "Prélèvement libératoire", definition: "Une option qui te permet de payer ton impôt sur le revenu en même temps que tes cotisations sociales (un petit % en plus chaque mois), pour ne pas avoir de surprise à la fin de l'année." },
            { term: "Prestation de service", definition: "Quand tu vends ton temps ou ton savoir-faire (pas un objet physique)." },
        ]
    },
    {
        letter: "R",
        definitions: [
            { term: "Radiation", definition: "La suppression de ton entreprise des registres officiels." },
            { term: "RC Pro (Responsabilité Civile Professionnelle)", definition: "Une assurance qui te couvre si tu casses quelque chose chez un client ou si tu fais une grosse erreur. Obligatoire pour certains métiers (BTP, santé), recommandée pour les autres." },
            { term: "Recouvrement", definition: "L'action d'aller réclamer l'argent qu'on te doit." },
        ]
    },
    {
        letter: "S",
        definitions: [
            { term: "Seuils de TVA", definition: "Le montant de CA (environ 36 800€ en service) à partir duquel tu perds la franchise et dois commencer à facturer la TVA." },
            { term: "SIE (Service des Impôts des Entreprises)", definition: "Ton interlocuteur pour la CFE et la TVA. Ce ne sont pas les mêmes gens que pour tes impôts perso !" },
            { term: "SIREN", definition: "Ton numéro d'identification à 9 chiffres (il ne change jamais)." },
            { term: "SIRET", definition: "Ton numéro SIREN + 5 chiffres qui identifient ton adresse (il change si tu déménages)." },
            { term: "SSI (Sécurité Sociale des Indépendants)", definition: "C'est ta sécu. Avant c'était le RSI (l'enfer), maintenant c'est rattaché au régime général (comme les salariés), c'est beaucoup mieux." },
        ]
    },
    {
        letter: "T",
        definitions: [
            { term: "Taux de cotisation", definition: "Le pourcentage de ton CA que l'URSSAF te prend. (Environ 12.3% pour la vente, 21.2% pour les services)." },
            { term: "Télédéclaration", definition: "Faire ses papiers sur internet au lieu de par courrier. C'est obligatoire maintenant." },
            { term: "TVA non applicable", definition: "La phrase magique à écrire sur tes factures tant que tu es en dessous des seuils : \"TVA non applicable, art. 293 B du CGI\"." },
        ]
    }
];

export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = DICTIONARY_DATA.map(section => ({
        ...section,
        definitions: section.definitions.filter(def =>
            def.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            def.definition.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(section => section.definitions.length > 0);

    return (
        <main className="min-h-screen bg-background flex flex-col mt-16">
            <Navbar />

            <div className="flex-grow">
                {/* Hero Section */}
                <div className="bg-[#0F172A] text-white py-16 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F172A]"></div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
                            <BookOpen className="w-5 h-5 text-[#FFCC00]" />
                            <span className="text-sm font-medium text-[#FFCC00] uppercase tracking-wider">Le Dico-Décodeur Phobee (V1)</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Ne parlez plus chinois, parlez administratif.</h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                            L'administration a son propre langage. Voici la traduction pour les humains normaux.
                            De "Abattement" à "TVA", on t'explique tout simplement.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-4 rounded-xl border-0 ring-1 ring-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#FFCC00] focus:bg-white/20 transition-all shadow-lg"
                                placeholder="Rechercher une définition (ex: SIRET, TVA...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 md:px-8 py-16">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">Aucune définition trouvée pour "{searchTerm}".</p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-12">
                            {filteredData.map((section) => (
                                <div key={section.letter} className="relative">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Letter Sticky */}
                                        <div className="md:w-24 flex-shrink-0">
                                            <div className="sticky top-24 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFCC00] text-slate-900 font-bold text-2xl shadow-lg shadow-yellow-500/20">
                                                {section.letter}
                                            </div>
                                        </div>

                                        {/* Definitions List */}
                                        <div className="flex-1 space-y-6">
                                            {section.definitions.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-[#FFCC00]/50 hover:shadow-md transition-all duration-300"
                                                >
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#FFCC00] transition-colors">
                                                        {item.term}
                                                    </h3>
                                                    <p className="text-slate-600 leading-relaxed">
                                                        {item.definition}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Section Divider */}
                                    <div className="mt-12 border-b border-slate-100"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
