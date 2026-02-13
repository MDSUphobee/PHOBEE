"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Bell, Check, FileText, Shield, Calendar, AlertCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const currentStepIndex = useTransform(smoothProgress, [0, 0.45, 0.9], [1, 2, 3]);
    const [activeStep, setActiveStep] = useState(1);

    // Bee Movement: Horizontal X from 0% to ~90% of the timeline width
    const beeX = useTransform(smoothProgress, [0, 1], ["0%", "90%"]);
    // Simple bobbing Y or Zig Zag can be purely CSS animation on the bee itself, or transform
    const beeY = useTransform(smoothProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [0, -10, 0, 10, 0, -10, 0, 10, 0, -5, 0]
    );

    useEffect(() => {
        const unsubscribe = currentStepIndex.on("change", (v) => {
            setActiveStep(Math.round(v));
        });
        return () => unsubscribe();
    }, [currentStepIndex]);

    const scrollToStep = (step: number) => {
        if (!containerRef.current) return;
        const sectionHeight = containerRef.current.offsetHeight;
        const sectionTop = containerRef.current.offsetTop;
        const windowHeight = window.innerHeight;

        let scrollTarget = sectionTop;
        if (step === 2) scrollTarget = sectionTop + (sectionHeight - windowHeight) * 0.45;
        if (step === 3) scrollTarget = sectionTop + (sectionHeight - windowHeight) * 0.9;

        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    };

    return (
        <section ref={containerRef} id="how-it-works" className="relative h-[250vh] bg-white dark:bg-slate-950">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">

                    {/* Header */}
                    <div className="text-left mb-8 max-w-4xl pt-4">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white mb-2 leading-tight">
                            Une plateforme qui vous guide, <br />
                            <span className="relative inline-block">
                                étape par étape
                                <span className="absolute bottom-3 left-0 w-full h-4 bg-[#FFD700] -z-10 transform -rotate-1 opacity-100"></span>
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                        {/* LEFT: Steps Timeline */}
                        <div className="w-full lg:w-3/5 relative">
                            {/* Dotted Line */}
                            <div className="absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 border-t-2 border-dotted border-slate-300 dark:border-slate-700 -z-10 translate-y-[-1px]" />

                            {/* Bee Animation */}
                            <motion.div
                                className="absolute top-[0.5rem] z-30 pointer-events-none drop-shadow-xl"
                                style={{
                                    left: beeX,
                                    y: beeY,
                                    x: "-50%"
                                }}
                            >
                                <img src="/images/abeille.png" alt="Abeille" className="w-12 md:w-16 h-auto transform rotate-12" />
                            </motion.div>

                            {/* Steps Row */}
                            <div className="grid grid-cols-3 gap-8">
                                {[
                                    { num: 1, title: "Vous indiquez votre situation", desc: "Répondez à quelques questions simples sur votre activité. (30s chrono, promis)." },
                                    { num: 2, title: "PhoBee liste vos obligations", desc: "Nous détectons vos échéances, vos aides potentielles et vos plafonds." },
                                    { num: 3, title: "Rappel avant chaque date importante", desc: "Seulement l'essentiel, sans vous déranger inutilement." }
                                ].map((step, idx) => {
                                    const stepNum = idx + 1;
                                    const isCurrent = activeStep === stepNum;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => scrollToStep(stepNum)}
                                            className="relative flex flex-col items-center text-center group cursor-pointer"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: isCurrent ? 1.1 : 1,
                                                    borderColor: isCurrent ? '#FFD700' : '#E2E8F0',
                                                    backgroundColor: isCurrent ? '#ffffff' : '#ffffff'
                                                }}
                                                className={`w-20 h-20 rounded-full border-[3px] flex items-center justify-center text-3xl font-normal bg-white dark:bg-slate-900 transition-colors duration-300 mb-6 z-20 shadow-lg ${isCurrent ? 'text-slate-900 border-[#FFD700]' : 'text-slate-400 border-slate-200'}`}
                                            >
                                                {step.num}
                                            </motion.div>
                                            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-3 leading-tight min-h-[3.5rem]">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto hidden md:block">
                                                {step.desc}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* RIGHT: Phone Mockup */}
                        <div className="w-full lg:w-2/5 flex justify-center relative perspective-1000">
                            {/* The Phone */}
                            <motion.div
                                className="relative w-[300px] h-[600px] bg-[#0F172A] rounded-[3rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 z-10"
                                initial={{ rotateY: -10, rotateX: 5 }}
                                animate={{ rotateY: -10, rotateX: 5 }}
                            >
                                {/* Screen Content */}
                                <div className="w-full h-full bg-[#0F172A] relative flex flex-col overflow-hidden">

                                    {/* Top Bar (Notch area) */}
                                    <div className="absolute top-0 w-full h-8 z-30 flex justify-center">
                                        <div className="w-32 h-6 bg-slate-900 rounded-b-xl" />
                                    </div>

                                    {/* Swappable Content Area */}
                                    <div className="flex-1 pt-12 px-6 pb-6 relative">
                                        <AnimatePresence mode="wait">

                                            {/* SCREEN 1: FORM */}
                                            {activeStep === 1 && (
                                                <motion.div
                                                    key="screen-1"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex flex-col h-full"
                                                >
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                                            <div className="w-6 h-6 rounded-full bg-[#FFD700]" />
                                                        </div>
                                                        <div>
                                                            <div className="h-2 w-20 bg-slate-700 rounded mb-1" />
                                                            <div className="h-2 w-12 bg-slate-800 rounded" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                                            <p className="text-slate-200 text-sm">Bonjour ! Quel est votre statut ?</p>
                                                        </div>
                                                        <div className="bg-[#FFD700] p-4 rounded-2xl rounded-tr-none max-w-[85%] self-end">
                                                            <p className="text-slate-900 font-medium text-sm">Je suis Auto-entrepreneur 🛠️</p>
                                                        </div>
                                                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                                            <p className="text-slate-200 text-sm">Super. Vous faites de la vente ou du service ?</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <div className="w-full h-12 bg-slate-800 rounded-full border border-slate-700 flex items-center px-4">
                                                            <span className="text-slate-500 text-sm">Écrivez votre réponse...</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* SCREEN 2: LIST / RADAR */}
                                            {activeStep === 2 && (
                                                <motion.div
                                                    key="screen-2"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex flex-col h-full"
                                                >
                                                    <div className="text-center mb-6">
                                                        <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#FFD700] animate-pulse">
                                                            <Zap className="text-[#FFD700] w-8 h-8" />
                                                        </div>
                                                        <h4 className="text-white font-bold text-lg">Analyse Terminée</h4>
                                                        <p className="text-slate-400 text-xs">2 obligations détectées</p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-purple-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="h-2 w-24 bg-slate-600 rounded mb-1" />
                                                                <div className="h-2 w-16 bg-slate-700 rounded" />
                                                            </div>
                                                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                                                        </div>

                                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                                <Shield className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="h-2 w-20 bg-slate-600 rounded mb-1" />
                                                                <div className="h-2 w-32 bg-slate-700 rounded" />
                                                            </div>
                                                            <AlertCircle className="text-orange-500 w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* SCREEN 3: NOTIFICATION / CALENDAR */}
                                            {activeStep === 3 && (
                                                <motion.div
                                                    key="screen-3"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex flex-col h-full"
                                                >
                                                    <div className="mt-8 mb-6">
                                                        <h4 className="text-white font-bold text-xl mb-1">Octobre</h4>
                                                        <p className="text-slate-400 text-sm">Vos prochaines échéances</p>
                                                    </div>

                                                    {/* Calendar Widget */}
                                                    <div className="bg-slate-800 p-4 rounded-2xl mb-6">
                                                        <div className="grid grid-cols-7 gap-2 mb-2">
                                                            {[12, 13, 14, 15, 16, 17, 18].map(d => (
                                                                <div key={d} className={`text-center py-2 rounded-lg text-xs ${d === 15 ? 'bg-[#FFD700] text-slate-900 font-bold' : 'text-slate-400'}`}>
                                                                    {d}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Notification Card */}
                                                    <div className="bg-white rounded-xl p-4 shadow-lg flex items-start gap-4 transform rotate-1">
                                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 text-sm">Déclaration URSSAF</h5>
                                                            <p className="text-xs text-slate-500 mt-1">N'oubliez pas ! Échéance demain à 12:00.</p>
                                                        </div>
                                                    </div>

                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="mx-auto mt-8 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                                    >
                                                        <Check className="text-white w-8 h-8" />
                                                    </motion.div>

                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Bottom Blur Effect */}
                                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
                                </div>
                            </motion.div>

                            {/* Floating "Sécurité Maximale" Card - Outside Phone */}
                            <motion.div
                                initial={{ opacity: 0, x: -20, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-[10%] -left-12 z-20 bg-white rounded-2xl p-4 shadow-2xl max-w-[260px] flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-slate-900" />
                                </div>
                                <div>
                                    <h5 className="font-extrabold text-slate-900 text-base">Sécurité Maximale</h5>
                                    <p className="text-xs text-slate-500 mt-1 leading-tight">
                                        Vos données restent cryptées sur votre téléphone. On ne vend rien.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
