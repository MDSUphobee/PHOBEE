"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-[120px] pb-32 lg:pb-40 overflow-hidden bg-[#F9FAFB] dark:bg-slate-900/50">
            {/* Radial gradient fading from #FEF3C7 to transparent towards bottom-right */}
            <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_bottom_right,_#FEF3C7_0%,_transparent_60%)] -z-20 pointer-events-none" />

            {/* Truncated block bottom left - moved under z-10 container */}
            {/*<motion.div
                {/*    initial={{ opacity: 0, x: -50, y: 50 }}*/}
                {/*}    animate={{ opacity: 1, x: 0, y: 0 }}*/}
                {/*}    transition={{ delay: 0.5, duration: 0.8 }}*/}
                {/*}    className="absolute -bottom-24 -left-24 w-[320px] h-[320px] md:w-[460px] md:h-[460px] rounded-[2rem] overflow-hidden shadow-2xl z-0 hidden sm:block pointer-events-none"*/}
                {/*}>*/}
                {/*}    <img src="/images/image2.png" alt="Fournitures de bureau" className="w-full h-full object-cover" />*/}
                {/*}</motion.div>*/}

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-[55%_45%] gap-16 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-start text-left"
                    >
                        <h1 className="text-[3.5rem] md:text-[4rem] lg:text-[64px] font-[800] tracking-tight text-[#111827] dark:text-white leading-[1.05]">
                            L'administratif,<br />
                            enfin <span className="relative inline-block text-[#111827] dark:text-white">
                                simple.
                                {/* Thick drawn-like underline #FFCC00 */}
                                <span className="absolute bottom-[6px] md:bottom-2 left-0 w-full h-[8px] md:h-[12px] bg-[#FFCC00] -z-10 rounded-full"></span>
                            </span>
                        </h1>

                        <p className="mt-8 text-[18px] text-[#4B5563] font-normal max-w-[560px] leading-relaxed">
                            Nous accompagnons les entreprises pas à pas dans toutes leurs démarches administratives : documents, aides, contrats, déclarations, sans stress ni oubli.
                        </p>

                        <div className="flex flex-wrap items-center justify-start mt-10 gap-4 w-full">
                            <Link
                                href="/radar-aides"
                                className="group relative inline-flex items-center justify-center px-8 py-4 text-[16px] font-semibold text-[#111827] transition-all duration-300 bg-[#FFCC00] rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <span className="relative flex items-center gap-2">
                                    Commencer gratuitement
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="inline-flex items-center justify-center px-8 py-4 text-[16px] font-medium text-[#4B5563] dark:text-white bg-transparent border border-[#D1D5DB] rounded-full hover:bg-slate-50  transition-colors"
                            >
                                Comment ça marche
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Image / Visual Content */}
                    <div className="relative mx-auto w-full max-w-[500px] mt-32 lg:mt-0 mb-16 lg:mb-0">
                        {/* Dark Blue background card */}
                        <div className="absolute top-8 left-8 right-[-2rem] bottom-[-2rem] bg-[#111827] rounded-[2rem] -z-10 shadow-[0_30px_60px_rgba(17,24,39,0.3)]" />

                        {/* Main Image */}
                        <div className="relative rounded-[2rem] overflow-hidden z-20 aspect-square md:aspect-[4/5] object-cover bg-white shadow-xl">
                            <img
                                src="/images/image1.png"
                                alt="Entrepreneuse souriante travaillant sur ordinateur"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                        {/* Floating Notification - ACRE Validée */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="absolute -top-16 right-4 lg:-top-12 lg:right-6 z-30"
                        >
                            <div className="bg-white/90 backdrop-blur-md text-[#111827] px-6 py-4 rounded-[1.25rem] shadow-[0_12px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 border border-white/40 whitespace-nowrap">
                                <div className="p-0.5 rounded-full border-[3px] border-[#2ecc71]/20 shrink-0">
                                    <CheckCircle2 className="w-[20px] h-[20px] text-[#2ecc71] stroke-[2.5]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[15px] md:text-[16px] text-[#2ecc71] tracking-wide">ACRE validée</span>
                                    <span className="text-[#2ecc71]/80 text-[13px] md:text-[14px] font-medium">+3000€ économisés</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Notification - Nouveau Radar */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="absolute -top-4 -right-12 lg:-top-2 lg:-right-24 z-40 whitespace-nowrap"
                        >
                            <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-xl px-5 py-2 md:px-6 md:py-2.5 rounded-full flex items-center gap-3">
                                <span className="relative inline-flex rounded-full h-[8px] w-[8px] bg-[#eab308] shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
                                {/*<span className="font-light text-[13px] md:text-[14px] text-[#4B5563]">*/}
                                {/*    Nouveau : Le radar à aides est disponible*/}
                                {/*}</span>*/}
                            </div>
                        </motion.div>

                        {/* Floating Notification - Rappel URSSAF */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute top-1/2 -translate-y-1/2 -left-8 md:-left-20 z-40 w-[260px] md:w-[300px]"
                        >
                            <div className="bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-[1.25rem] shadow-xl border border-white/60">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#fef3c7] p-2.5 rounded-full shrink-0 flex items-center justify-center">
                                        <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#d97706] stroke-[2]" />
                                    </div>
                                    <div className="space-y-1 mt-0.5">
                                        <p className="font-bold text-[#111827] text-[15px] md:text-[16px]">Rappel URSSAF</p>
                                        <p className="text-[13px] md:text-[14px] text-[#4B5563] leading-snug inline-flex items-center flex-wrap">
                                            Déclare ton chiffre d'affaires avant demain (J-1). <Calendar className="w-3.5 h-3.5 ml-1 text-red-500 inline" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
