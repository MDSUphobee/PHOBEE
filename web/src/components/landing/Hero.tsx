"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell, Calendar, CheckCircle2, Sprout, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-blue-50/50 dark:bg-slate-900/20 rounded-bl-[100px] -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center space-y-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-white">
                                Nouveau : Le radar à aides est disponible 🚀
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            L'administratif, enfin{" "}
                            <span className="relative inline-block text-foreground">
                                simple.
                                <span className="absolute bottom-2 left-0 w-full h-4 bg-[#FFD700] -z-10 rounded-sm -rotate-1"></span>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                            Nous accompagnons les entreprises pas à pas dans toutes leurs démarches administratives : documents, aides, contrats, déclarations, sans stress ni oubli.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 w-full justify-center md:justify-start">
                            <Link
                                href="/signup"
                                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-slate-900 transition-all duration-300 bg-[#FFD700] rounded-full shadow-lg hover:shadow-xl hover:bg-[#FFC000] hover:-translate-y-0.5 active:scale-95 focus:outline-none"
                            >
                                <span className="relative flex items-center gap-2">
                                    Commencer gratuitement
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Comment ça marche
                            </Link>
                        </div>

                        <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p>Déjà <span className="font-bold text-secondary">1,200+</span> utilisateurs rassurés</p>
                        </div>
                    </motion.div>

                    {/* Hero Image / Visual Content */}
                    <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                        {/* Dark Blue Blob Shape Background - Positioned to match mockup */}
                        <div className="absolute top-8 right-0 w-[95%] h-[95%] bg-[#0F172A] rounded-[2.5rem] -z-10 translate-x-6 translate-y-6" />

                        {/* Main Image */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                            <img
                                src="/images/image1.png"
                                alt="Entrepreneuse souriante travaillant sur ordinateur"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Floating Notification - URSSAF */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="hidden md:block absolute bottom-[15%] -left-8 z-30 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800 max-w-[220px]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-full shrink-0">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                </div>
                                <div className="space-y-1">
                                    <div className="h-2 w-16 bg-slate-200 rounded" />
                                    <div className="h-2 w-24 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Notification - Warning */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="absolute -top-6 left-12 z-30 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3"
                        >
                            <div className="text-xl">⚠️</div>
                            <div className="text-xs font-medium">
                                <span className="block text-slate-400">Attention !</span>
                                <span className="block text-slate-800 font-bold">TVA à déclarer</span>
                            </div>
                        </motion.div>

                        {/* Floating Notification - ACRE */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.4, duration: 0.4 }}
                            className="absolute top-[-30px] right-10 z-30 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2"
                        >
                            <div className="bg-orange-100 p-1 rounded">
                                <span className="text-lg">📄</span>
                            </div>
                            <div className="text-[10px] leading-tight text-slate-500">
                                Document<br />validé
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
