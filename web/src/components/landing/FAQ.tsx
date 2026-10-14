// web/src/components/landing/FAQ.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        q: "La plateforme prend-elle en compte ma situation spécifique ?",
        a: "Absolument. Chaque parcours est adapté à votre exploitation : type de production, surface, effectif, localisation géographique. Rien de générique, tout est personnalisé.",
    },
    {
        q: "Mes données sont-elles partagées ?",
        a: "Non. Vos données restent confidentielles et chiffrées. Nous ne les revendons pas et ne les partageons avec aucun tiers sans votre accord.",
    },
    {
        q: "Les documents sont-ils conformes et officiels ?",
        a: "Tous nos modèles de CERFA et contrats sont mis à jour régulièrement par des experts en droit rural pour garantir leur conformité totale avec la réglementation en vigueur.",
    },
    {
        q: "Puis-je résilier quand je veux ?",
        a: "Oui, sans engagement. Vous pouvez résilier votre abonnement à tout moment, en quelques clics, directement depuis votre espace.",
    },
];

export default function FAQ() {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const toggle = (i: number) => setOpenItem((prev) => (prev === i ? null : i));

    return (
        <section className="bg-[#f7f6fe] py-20 dark:bg-slate-900">
            <div className="container mx-auto max-w-3xl px-4 md:px-6">
                <h2 className="mb-10 text-center text-3xl font-bold text-[#344256] dark:text-white">
                    Questions Fréquentes
                </h2>

                <div>
                    {faqs.map((faq, i) => {
                        const isOpen = openItem === i;
                        return (
                            <div
                                key={i}
                                className="border-b border-slate-200/80 dark:border-slate-700/60"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                                >
                                    <span className="text-[17px] font-bold text-[#344256] md:text-lg dark:text-white">
                                        {faq.q}
                                    </span>
                                    <Plus
                                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    />
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
                                            <p className="pb-6 pr-10 text-[15px] leading-relaxed text-slate-500 dark:text-slate-300">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* CTA : voir toute la FAQ (comme la maquette) */}
                <div className="mt-12 flex flex-col items-center gap-4 text-center">
                    <Link
                        href="/faq"
                        className="inline-block rounded-full bg-[#FFCC00] px-7 py-3 text-lg font-medium text-[#0f1729] transition-all hover:bg-[#FFC000]"
                    >
                        Consulter toute la FAQ
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Vous ne trouvez pas votre réponse ?{" "}
                        <Link href="/contact" className="font-semibold text-[#344256] underline underline-offset-2 hover:text-[#14233c] dark:text-slate-200">
                            Contactez-nous
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
