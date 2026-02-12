"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AlertCircle, Lightbulb, ChevronDown, ChevronUp, Rocket, Landmark, ShieldCheck, BrainCircuit, Search } from "lucide-react";
import Link from "next/link";

// --- Components ---

const AlertDanger = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg my-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-red-700 text-sm">{children}</div>
    </div>
);

const AlertSuccess = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-slate-700 text-sm">{children}</div>
    </div>
);

const AccordionItem = ({ title, tag, children }: { title: string, tag?: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
            >
                <div>
                    {tag && <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md mb-2 tracking-wide uppercase">{tag}</span>}
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/30 text-slate-600 leading-relaxed space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

// --- Content Data ---

const categories = [
    {
        id: "launch",
        title: "Le Lancement",
        subtitle: "De 0 à 1",
        icon: Rocket,
        color: "text-blue-500 bg-blue-50",
        content: [
            {
                title: "🛑 3 choses à vérifier AVANT de t'inscrire",
                tag: "#Urgent",
                body: (
                    <>
                        <p>Avant de te lancer tête baissée, vérifie ces 3 points vitaux :</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Le bon site (Le seul, l'unique) :</strong> Attention aux arnaques ! L'inscription est 100% GRATUITE. Si on te demande ta carte bleue, fuis. Le seul site officiel est : <a href="https://autoentrepreneur.urssaf.fr" target="_blank" rel="noreferrer" className="text-blue-600 underline">autoentrepreneur.urssaf.fr</a>.</li>
                            <li><strong>Le choix du versement :</strong> On va te demander si tu veux le "Versement Libératoire".</li>
                        </ul>
                        <AlertSuccess>
                            <strong>Conseil PhoBee :</strong> Si tu n'es pas imposable aujourd'hui, ne coche PAS cette case. Sinon tu vas payer un impôt que tu ne devrais pas payer.
                        </AlertSuccess>
                        <p><strong>La fréquence :</strong> Choisis la déclaration MENSUELLE. C'est plus simple pour gérer ton budget que de payer une grosse somme tous les 3 mois.</p>
                    </>
                )
            },
            {
                title: "💸 L'ACRE : Comment payer -50% de charges ?",
                tag: "#BonPlan",
                body: (
                    <>
                        <p>C'est le cadeau de bienvenue de l'État. L'ACRE (Aide à la Création d'Entreprise) te permet de payer environ 11% de charges au lieu de 22% pendant ta première année.</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Pour qui ?</strong> Les demandeurs d'emploi, les moins de 26 ans, les bénéficiaires du RSA...</li>
                            <li><strong>Comment ?</strong> Pour la plupart, c'est automatique ! Mais vérifie bien sur le site de l'Urssaf si tu dois envoyer un formulaire.</li>
                        </ul>
                        <AlertSuccess>
                            <strong>Astuce :</strong> Essaie de créer ton entreprise en début de trimestre (Janvier, Avril, Juillet, Octobre) pour en profiter le plus longtemps possible.
                        </AlertSuccess>
                    </>
                )
            },
            {
                title: "🏦 Ai-je besoin d'un compte \"Pro\" ?",
                tag: "#Débutant",
                body: (
                    <>
                        <p>Non, pas obligatoirement ! La loi t'oblige seulement à avoir un compte DÉDIÉ à ton activité (séparé de ton compte perso pour acheter tes courses).</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Option 0€ :</strong> Tu peux ouvrir un compte courant classique dans une banque en ligne (Boursorama, Revolut, N26) et ne l'utiliser que pour ton business.</li>
                            <li><strong>Option Confort :</strong> Les comptes Pros (Shine, Qonto) coûtent environ 10€/mois mais offrent des outils de facturation intégrés. À toi de voir !</li>
                        </ul>
                    </>
                )
            }
        ]
    }, // End Launch
    {
        id: "money",
        title: "L'Argent",
        subtitle: "Factures & Urssaf",
        icon: Landmark,
        color: "text-primary bg-primary/10",
        content: [
            {
                title: "🚨 J'ai gagné 0€ ce mois-ci, je fais quoi ?",
                tag: "#Danger",
                body: (
                    <>
                        <p>C'est le piège n°1 des débutants. Tu dois ABSOLUMENT déclarer "0" sur le site de l'Urssaf.</p>
                        <AlertDanger>
                            <strong>Attention :</strong> Si tu oublies de déclarer (même si c'est zéro), tu auras une pénalité de retard d'environ 52€. Ne jette pas ton argent par la fenêtre !
                        </AlertDanger>
                    </>
                )
            },
            {
                title: "🧮 Dois-je facturer la TVA ?",
                tag: "#Facturation",
                body: (
                    <>
                        <p>Au début : NON. C'est l'avantage de la micro-entreprise ("Franchise en base de TVA").</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Tu factures tes clients en "Hors Taxe".</li>
                            <li>Sur tes factures, tu n'affiches pas de ligne TVA.</li>
                        </ul>
                        <p className="mt-2 font-semibold">OBLIGATOIRE : Tu dois écrire cette phrase magique en bas de toutes tes factures : "TVA non applicable, article 293 B du CGI".</p>
                    </>
                )
            },
            {
                title: "💰 Combien je dois garder pour l'Urssaf ?",
                tag: "#Finance",
                body: (
                    <>
                        <p>Quand tu reçois 100€, cet argent n'est pas entièrement à toi. L'État va te demander sa part le mois suivant.</p>
                        <p className="font-semibold mt-2">La Règle PhoBee : Mets immédiatement 25% de côté sur un livret.</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>22%</strong> pour l'Urssaf.</li>
                            <li><strong>3%</strong> pour la sécurité (CFE, imprévus). Ne touche jamais à cette cagnotte avant d'avoir payé tes charges !</li>
                        </ul>
                    </>
                )
            }
        ]
    }, // End Money
    {
        id: "security",
        title: "La Sécurité",
        subtitle: "Assurances & Arnaques",
        icon: ShieldCheck,
        color: "text-red-500 bg-red-50",
        content: [
            {
                title: "☠️ J'ai reçu un courrier me réclamant 200€ !",
                tag: "#Urgent",
                body: (
                    <>
                        <p>Tu viens de t'inscrire et tu reçois un courrier officiel avec des drapeaux bleu-blanc-rouge te demandant de payer pour un "Registre" ou une "Insertion légale" ?</p>
                        <AlertDanger>
                            <strong>C'EST UNE ARNAQUE.</strong> Ces sociétés épluchent les nouvelles créations d'entreprises pour envoyer de fausses factures. Vérifie toujours les petits caractères en bas de page. Si tu vois "Offre facultative à des fins publicitaires" : POUBELLE DIRECTE.
                        </AlertDanger>
                    </>
                )
            },
            {
                title: "🏚️ C'est quoi la CFE (Cotisation Foncière) ?",
                tag: "#Impots",
                body: (
                    <>
                        <p>C'est une taxe que tu paies parce que tu as une entreprise, même si tu travailles chez toi sur ton canapé !</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>La bonne nouvelle :</strong> Tu ne la paies pas l'année de ta création (Année 1).</li>
                            <li><strong>À savoir :</strong> Elle tombe en fin d'année (Novembre). Pense à créer ton compte "Professionnel" sur le site impots.gouv.fr pour recevoir l'avis de paiement. Elle varie entre 100€ et 500€ selon ta ville.</li>
                        </ul>
                    </>
                )
            }
        ]
    }, // End Security
    {
        id: "mindset",
        title: "Le Mindset",
        subtitle: "Organisation & Peurs",
        icon: BrainCircuit,
        color: "text-purple-500 bg-purple-50",
        content: [
            {
                title: "🧘‍♂️ \"J'ai peur de me tromper dans les papiers\"",
                tag: "#Coaching",
                body: (
                    <>
                        <p>Respire. C'est normal. L'administration française fait peur. Mais souviens-toi :</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>L'erreur est humaine :</strong> L'Urssaf a un "Droit à l'erreur". Si tu te trompes de bonne foi et que tu les contactes, ils ne te couperont pas la tête.</li>
                            <li><strong>Tu n'es pas seul :</strong> La communauté PhoBee est là. En cas de doute, pose la question sur la Ruche avant de valider quoi que ce soit.</li>
                        </ul>
                    </>
                )
            },
            {
                title: "🏷️ Comment fixer mon prix sans rougir ?",
                tag: "#Vente",
                body: (
                    <>
                        <p>Arrête de calculer ton prix comme si tu étais salarié ! Un salarié coûte 2x son salaire à son patron. Toi, tu dois tout payer (Urssaf, Congés, Matériel, Retraite).</p>
                        <AlertSuccess>
                            <strong>Calcul Rapide :</strong> Prends le salaire net que tu aimerais avoir. Multiplie-le par 2. Divise par le nombre de jours travaillés (max 15 jours par mois, car le reste du temps tu fais de la compta et de la prospection !). C'est ton TJM (Taux Journalier Moyen) minimum.
                        </AlertSuccess>
                    </>
                )
            }
        ]
    } // End Mindset
];

export default function SurvivalManualPage() {
    const [activeTab, setActiveTab] = useState("launch");

    const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col mt-16 font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pb-12 pt-16 md:pt-24 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFCC00]/15 text-[#af8c00] dark:text-[#FFD54F] text-xs font-bold tracking-wide uppercase mb-6">
                        Documentation Développeur
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight">
                        Manuel de Survie <span className="text-[#FFCC00]">PhoBee</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Le guide ultime pour survivre à la jungle administrative. Tout ce qu'on aurait aimé savoir avant de se lancer.
                    </p>

                    {/* Search Bar Placeholder */}
                    <div className="mt-8 max-w-lg mx-auto relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-[#FFCC00] transition-colors" />
                        <input
                            type="text"
                            placeholder="Ex: TVA, Facture, Peur..."
                            className="w-full h-12 pl-12 pr-4 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:border-[#FFCC00] focus:ring-4 focus:ring-[#FFCC00]/10 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                    <div className="sticky top-24 space-y-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group
                                        ${isActive
                                            ? 'bg-slate-900 text-white shadow-md transform scale-[1.02]'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }
                                    `}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : cat.color}`}>
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{cat.title}</div>
                                        <div className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400 dark:text-slate-400'}`}>{cat.subtitle}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-3 rounded-2xl ${activeCategory.color}`}>
                                <activeCategory.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-foreground">{activeCategory.title}</h2>
                                <p className="text-muted-foreground">{activeCategory.subtitle}</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {activeCategory.content.map((article, idx) => (
                                <AccordionItem key={idx} title={article.title} tag={article.tag}>
                                    {article.body}
                                </AccordionItem>
                            ))}
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-12 p-8 bg-slate-900 dark:bg-slate-800 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Besoin d'aller plus loin ?</h3>
                                <p className="text-slate-300 text-sm">Simplifiez votre gestion avec nos outils dédiés.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10">
                                    📥 Télécharger ce modèle
                                </button>
                                <Link href="/calculateur" className="px-6 py-3 rounded-xl bg-[#FFCC00] text-slate-900 font-bold hover:bg-[#F0B400] transition-colors shadow-lg shadow-yellow-500/20 text-center">
                                    🧮 Lancer le simulateur
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-slate-400 text-xs mt-8">
                            ⚠️ Ces informations sont données à titre indicatif. PhoBee t'aide à comprendre, mais tu restes capitaine de ton navire.
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
