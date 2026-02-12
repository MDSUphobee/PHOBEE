"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Bell, Shield, ArrowRight } from "lucide-react";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Une plateforme qui vous guide, <br />
                        <span className="relative inline-block">
                            étape par étape
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-[#FFD700] -z-10 transform -rotate-1 opacity-80"></span>
                        </span>
                    </h2>
                </div>

                {/* Steps Container */}
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 items-start">
                    {/* Dotted Line (Desktop only) */}
                    <div className="hidden md:block absolute top-8 left-[10%] w-[80%] h-0.5 border-t-2 border-dashed border-slate-300 dark:border-slate-700 -z-0" />

                    {/* Bee Icon Flying Animation */}
                    <motion.div
                        className="hidden md:block absolute top-[28%] z-20 w-16 pointer-events-none"
                        initial={{ left: "10%" }}
                        animate={{
                            left: ["10%", "36%", "62%", "88%"],
                            y: [0, -20, 0, -10],
                            rotate: [0, 5, -5, 10]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }}
                    >
                        <img src="/images/abeille.png" alt="Abeille Phobee" className="w-full h-auto drop-shadow-lg" />
                    </motion.div>

                    {[
                        { num: 1, title: "Vous indiquez votre situation", desc: "Répondez à quelques questions simples sur votre activité. (30s chrono, promis)." },
                        { num: 2, title: "PhoBee liste vos obligations", desc: "Nous détectons vos échéances, vos aides potentielles et vos plafonds." },
                        { num: 3, title: "Rappel avant chaque date importante", desc: "Seulement l'essentiel, sans vous déranger inutilement." },
                        { num: 4, title: "On remplit et envoie vos documents officiels", desc: "D'un simple clic, générez vos factures et déclarations." },
                    ].map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center z-10 group">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:border-[#FFD700] group-hover:text-[#FFD700] transition-colors duration-300 md:mb-6 mb-4 shadow-sm">
                                {step.num}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Phone Mockup Feature */}
                <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    {/* Phone Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full lg:w-1/2 flex justify-center perspective-1000"
                    >
                        {/* Decorative Background for Phone */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/20 to-purple-500/20 blur-[60px] rounded-full opacity-50" />

                        <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                            {/* Mockup Screen Content */}
                            <div className="w-full h-full bg-slate-950 p-6 flex flex-col relative">
                                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 flex justify-center">
                                    <div className="w-32 h-4 bg-slate-800 rounded-b-xl" />
                                </div>

                                <div className="mt-8 mb-6">
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl mb-4 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-white/50" />
                                    </div>
                                    <h4 className="text-white text-xl font-bold">Radar à Aides</h4>
                                    <p className="text-slate-400 text-sm">Notre algo scanne votre profil...</p>
                                </div>

                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-40 h-40 rounded-full border-4 border-[#FFD700] flex items-center justify-center relative">
                                        <RadarIcon className="w-16 h-16 text-[#FFD700] animate-pulse" />
                                        <div className="absolute inset-0 border-4 border-[#FFD700]/30 rounded-full animate-ping" />
                                    </div>
                                </div>

                                {/* Floating Card on Phone */}
                                <div className="absolute bottom-10 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <span className="font-bold text-slate-900 text-sm">Sécurité Maximale</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Vos données restent cryptées sur votre téléphone.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Side Text */}
                    <div className="w-full lg:w-1/2 space-y-6 lg:pl-10">
                        <div className="w-16 h-16 bg-[#FFD700]/10 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">🐝</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Tout est centralisé.
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Plus besoin de jongler entre le site de l'URSSAF, vos fichiers Excel et vos notes.
                            PhoBee regroupe tout ce qui compte pour votre activité dans une interface pensée pour les humains.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                "Synchronisation automatique URSSAF",
                                "Génération de factures conformes",
                                "Veille juridique personnalisée"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

function RadarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
            <path d="M4 6h.01" />
            <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
            <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
            <path d="M12 18h.01" />
            <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
            <circle cx="12" cy="12" r="2" />
            <path d="m13.41 10.59 5.66-5.66" />
        </svg>
    )
}
