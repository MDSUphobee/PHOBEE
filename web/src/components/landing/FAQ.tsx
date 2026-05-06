"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqCategories = [
    {
        category: "COMPRENDRE",
        subtitle: "la plateforme",
        items: [
            {
                q: "À quoi sert la plateforme ?",
                a: "La plateforme vous accompagne dans toutes vos démarches administratives.\n\nElle vous guide étape par étape, remplit vos documents automatiquement et vous aide à ne rien oublier.",
            },
            {
                q: "À qui s'adresse la plateforme ?",
                a: "PhoBee s'adresse à tous les agriculteurs, quel que soit leur type d'exploitation (Cultures, Élevage, Viticulture) ou leur forme juridique (EARL, GAEC, exploitation individuelle, etc.).",
            },
            {
                q: "Est-ce compliqué à utiliser ?",
                a: "Non, la plateforme est conçue pour être simple et intuitive. Vous répondez à des questions claires, et PhoBee s'occupe du reste : remplissage automatique, vérification et génération de vos documents.",
            },
        ],
    },
    {
        category: "LES FORMULAIRES",
        subtitle: "& documents",
        items: [
            {
                q: "Quels documents sont pris en charge ?",
                a: "PhoBee prend en charge tous les CERFA agricoles courants : déclarations PAC, demandes de subventions, contrats de travail saisonniers, déclarations sociales, et bien d'autres.",
            },
            {
                q: "Comment fonctionne le remplissage automatique ?",
                a: "Lors de votre première connexion, vous renseignez votre profil d'exploitation. PhoBee utilise ensuite ces informations pour pré-remplir automatiquement tous vos documents officiels.",
            },
            {
                q: "Puis-je modifier les informations ?",
                a: "Oui, vous pouvez modifier et vérifier toutes les informations avant de valider un document. Vous restez maître de votre dossier à chaque étape.",
            },
            {
                q: "Les documents sont-ils conformes ?",
                a: "Tous nos modèles de CERFA et contrats sont mis à jour régulièrement par des experts en droit rural pour garantir leur conformité totale avec la réglementation en vigueur.",
            },
            {
                q: "Puis-je envoyer mes documents directement ?",
                a: "Oui, certains documents peuvent être transmis directement depuis la plateforme aux organismes concernés (MSA, DDT, etc.). Pour les autres, vous téléchargez le PDF finalisé.",
            },
        ],
    },
    {
        category: "LES AIDES",
        subtitle: "& accompagnement",
        items: [
            {
                q: "Comment savoir à quelles aides j'ai droit ?",
                a: "Notre radar à aides analyse votre profil d'exploitation et scanne automatiquement toutes les subventions et aides disponibles correspondant à votre situation spécifique.",
            },
            {
                q: "Les démarches sont-elles personnalisées ?",
                a: "Absolument. Chaque parcours est adapté à votre exploitation : type de production, surface, effectif, localisation géographique. Rien de générique, tout est personnalisé.",
            },
            {
                q: "Proposez-vous un accompagnement humain ?",
                a: "Oui. En complément de la plateforme, nos experts sont disponibles pour vous accompagner sur les dossiers complexes. Vous n'êtes jamais seul face à l'administration.",
            },
        ],
    },
];

export default function FAQ() {
    const [openItem, setOpenItem] = useState<string>("0-0");

    const toggle = (key: string) => {
        setOpenItem((prev) => (prev === key ? "" : key));
    };

    return (
        <section className="py-20 bg-gradient-to-br from-white via-white to-[#EEF2FF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                {/* Categories */}
                <div className="flex flex-col gap-14">
                    {faqCategories.map((cat, ci) => (
                        <div key={ci}>
                            {/* Category header */}
                            <div className="mb-5">
                                <div className="text-3xl font-extrabold text-[#FFD700] uppercase tracking-wide leading-none">
                                    {cat.category}
                                </div>
                                <div className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                                    {cat.subtitle}
                                </div>
                            </div>

                            {/* Accordion items */}
                            <div className="flex flex-col gap-2">
                                {cat.items.map((faq, i) => {
                                    const key = `${ci}-${i}`;
                                    const isOpen = openItem === key;
                                    return (
                                        <div key={key}>
                                            <button
                                                onClick={() => toggle(key)}
                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all duration-200 ${
                                                    isOpen
                                                        ? "bg-[#0F172A] text-white shadow-md"
                                                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-500"
                                                }`}
                                            >
                                                <span className="font-semibold text-sm md:text-base">
                                                    {faq.q}
                                                </span>
                                                <span className="ml-4 shrink-0">
                                                    {isOpen ? (
                                                        <Minus className="h-5 w-5 text-[#FFD700]" />
                                                    ) : (
                                                        <Plus className="h-5 w-5 text-[#FFD700]" />
                                                    )}
                                                </span>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.22, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                            {faq.a.split("\n\n").map((para, pi) => (
                                                                <p key={pi} className={pi > 0 ? "mt-3" : ""}>
                                                                    {para}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Vous avez d&apos;autres questions ?
                    </h3>
                    <Link href="/contact">
                        <button className="rounded-full px-8 py-3 bg-[#FFD700] text-slate-900 font-bold hover:bg-[#FFC000] shadow-lg hover:shadow-xl transition-all text-base">
                            Contactez-nous
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
