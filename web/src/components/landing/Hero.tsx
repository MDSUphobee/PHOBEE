"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Highlight from "@/components/ui/highlight";

export default function Hero() {
    return (
        <section className="relative pt-28 md:pt-44 pb-16 lg:pb-20 overflow-x-clip bg-[#F9FAFB] dark:bg-slate-900/50">
            {/* Yellow radial gradient bottom-right */}
            <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_bottom_right,_#FEF3C7_0%,_transparent_60%)] -z-20 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-[55%_45%] lg:gap-8 items-center">

                    {/* ═══════════════ ZONE 1 — Bloc texte ═══════════════ */}
                    <div data-zone="texte">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-start text-left"
                        >
                            <h1 className="text-[2.6rem] md:text-[3.5rem] lg:text-[56px] font-[800] tracking-tight text-[#111827] dark:text-white leading-[1.1]">
                                On <Highlight angle={-2}>évite</Highlight> les erreurs qui coûtent cher et on{" "}
                                <Highlight angle={-2}>enlève</Highlight> la charge mentale
                            </h1>

                            <p className="mt-6 text-[17px] text-slate-600 dark:text-slate-300 font-normal max-w-[520px] leading-relaxed">
                                Nous accompagnons les agriculteurs pas à pas dans toutes leurs démarches administratives : documents, aides, contrats, déclarations, sans stress ni oubli.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-8">
                                <Link
                                    href="/radar-aides"
                                    className="group inline-flex items-center gap-2 px-7 py-4 text-[15px] font-bold text-[#111827] bg-[#FFD700] rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Commencer ensemble
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center px-7 py-4 text-[15px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Comment ça marche
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                    {/* ─────────────── fin ZONE 1 ─────────────── */}

                    {/* ═══════════════ ZONE 2 — Bloc image + labels autour ═══════════════ */}
                    <div data-zone="visuel" className="mx-auto w-full max-w-[440px] mt-10 lg:mt-16 px-3 md:px-0">

                        {/*
                          Mobile / tablette : image seule (les 3 badges d'info sont masqués), on garde juste la certif.
                          lg+ : les badges flottent autour de l'image (maquette).
                        */}
                        <div className="relative isolate">

                            {/* Carte sombre décalée */}
                            <div className="absolute inset-0 translate-x-3 translate-y-3 lg:translate-x-6 lg:translate-y-6 bg-[#111827] rounded-[1.5rem] lg:rounded-[2rem] -z-10 shadow-[0_30px_60px_rgba(17,24,39,0.35)]" />

                            {/* Image principale */}
                            <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden z-10 shadow-xl">
                                <img
                                    src="/images/hero-farmer.png"
                                    alt="Agriculteur souriant utilisant son téléphone"
                                    className="w-full h-auto object-cover object-center"
                                    style={{ aspectRatio: "447/376" }}
                                />
                            </div>

                            {/* ── BADGE: ACRE validée — masqué en mobile ── */}
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.45 }}
                                className="hidden lg:block lg:absolute lg:-top-16 lg:right-20 z-30"
                            >
                                <div className="bg-[#0F172A] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 whitespace-nowrap">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-bold text-[13px] text-green-400">ACRE validée</span>
                                        <span className="text-white/60 text-[11px]">+3000€ économisés</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── BADGE: Nouveau (pill) — masqué en mobile ── */}
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.4 }}
                                className="hidden lg:block lg:absolute lg:-top-2 lg:-right-4 z-40 whitespace-nowrap"
                            >
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                                    <span className="font-semibold text-[11px] text-slate-700 dark:text-white">
                                        Nouveau : Le radar à aides est disponible
                                    </span>
                                </div>
                            </motion.div>

                            {/* ── BADGE: Rappel (carte blanche) — masqué en mobile ── */}
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1, duration: 0.45 }}
                                className="hidden lg:block lg:absolute lg:-top-8 lg:-left-12 lg:w-[220px] z-30"
                            >
                                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 flex gap-3 items-start">
                                    <div className="bg-orange-50 dark:bg-amber-900/30 p-2 rounded-lg shrink-0">
                                        <Bell className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-[12px]">Rappel</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                                            Déclare tes ressources avant demain (J-1). 🚨
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── Badge certification (bas gauche, incliné) — visible partout ── */}
                            <div className="absolute -bottom-10 -left-2 lg:-bottom-16 lg:left-6 z-30 -rotate-12">
                                <img
                                    src="/images/badge-conforme-exigence.svg"
                                    className="w-[105px] h-[105px] lg:w-[130px] lg:h-[130px] object-contain drop-shadow-xl"
                                    alt="Badge certifié"
                                />
                            </div>

                        </div>
                    </div>
                    {/* ─────────────── fin ZONE 2 ─────────────── */}

                </div>
            </div>
        </section>
    );
}