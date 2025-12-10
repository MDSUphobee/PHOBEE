"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-secondary/5 to-white/0">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                                Nouveau : Le radar à aides est disponible 🚀
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-secondary leading-[1.1]">
                            Fini la{" "}
                            <span className="relative inline-block text-secondary">
                                phobie
                                <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-primary/40 -z-10 rounded-sm -rotate-1"></span>
                            </span>{" "}
                            administrative.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                            L'assistant qui notifie tes échéances URSSAF et détecte tes aides oubliées.
                            Dors tranquille, on veille au grain.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 w-full justify-center lg:justify-start">
                            <Link href="/audit" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary-foreground transition-all duration-200 bg-primary rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 focus:outline-none ring-offset-2 focus:ring-2 ring-primary">
                                Lancer mon audit
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link href="/demo" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-700 transition-colors bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-secondary">
                                Voir la démo
                            </Link>
                        </div>

                        <div className="pt-4 flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p>Déjà <span className="font-bold text-secondary">1,200+</span> utilisateurs rassurés</p>
                        </div>
                    </motion.div>

                    {/* Graphic/Mockup Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000"
                    >
                        {/* Floating Elements Animation Container */}
                        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center">

                            {/* Background decorative blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-3xl rounded-full" />

                            {/* Main Phone Mockup */}
                            <motion.div
                                animate={{ y: [-15, 15] }}
                                transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, ease: "easeInOut" }}
                                className="relative z-10 w-[280px] xs:w-[300px] bg-secondary rounded-[40px] p-3 shadow-2xl border-4 border-slate-800"
                            >
                                <div className="h-full w-full bg-white rounded-[32px] overflow-hidden flex flex-col">
                                    {/* Fake App Header */}
                                    <div className="bg-slate-50 p-4 border-b flex items-center justify-between">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-primary text-xs">P</span>
                                        </div>
                                        <div className="w-20 h-2 bg-slate-200 rounded-full" />
                                    </div>
                                    {/* Fake App Body */}
                                    <div className="p-4 space-y-4">
                                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="h-2 w-1/3 bg-blue-200 rounded mb-2" />
                                            <div className="h-2 w-2/3 bg-blue-100 rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-10 w-full bg-slate-50 rounded-lg flex items-center px-3">
                                                <div className="h-4 w-4 bg-slate-200 rounded-full mr-2" />
                                                <div className="h-2 w-1/2 bg-slate-200 rounded" />
                                            </div>
                                            <div className="h-10 w-full bg-slate-50 rounded-lg flex items-center px-3">
                                                <div className="h-4 w-4 bg-slate-200 rounded-full mr-2" />
                                                <div className="h-2 w-1/2 bg-slate-200 rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAB */}
                                    <div className="mt-auto m-4 flex justify-center">
                                        <div className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Notification Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute top-[20%] right-0 md:-right-12 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-[240px]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-full shrink-0">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Rappel URSSAF</p>
                                        <p className="text-xs text-slate-500 mt-1">Déclare ton chiffre d'affaires avant demain (J-1). 🚨</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Another Floating Element (Success) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.4, duration: 0.4 }}
                                className="absolute bottom-[20%] left-0 md:-left-8 z-20 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">ACRE validée</p>
                                    <p className="text-xs text-green-600 font-medium">+3000€ économisés</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
