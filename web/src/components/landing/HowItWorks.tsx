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

    const currentStepIndex = useTransform(smoothProgress, [0, 0.3, 0.6, 0.9], [1, 2, 3, 4]);
    const [activeStep, setActiveStep] = useState(1);

    // Bee Movement: Horizontal X from 0% to ~90% of the timeline width
    const beeX = useTransform(smoothProgress, [0, 1], ["0%", "92%"]);
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
        if (step === 2) scrollTarget = sectionTop + (sectionHeight - windowHeight) * 0.3;
        if (step === 3) scrollTarget = sectionTop + (sectionHeight - windowHeight) * 0.6;
        if (step === 4) scrollTarget = sectionTop + (sectionHeight - windowHeight) * 0.9;

        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    };

    return (
        <section ref={containerRef} id="how-it-works" className="relative h-[300vh] bg-white dark:bg-slate-950">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">

                    {/* Header */}
                    <div className="text-left mb-8 max-w-4xl pt-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white mb-2 leading-tight">
                            Une plateforme qui vous guide, <br />
                            <span className="relative inline-block">
                                étape par étape
                                {/* Highlight bg */}
                                <span className="absolute bottom-2 left-0 w-full h-5 bg-[#FFD700] -z-10 opacity-100"></span>
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                        {/* LEFT: Steps Timeline */}
                        <div className="w-full lg:w-3/5 relative">
                            {/* Dotted Line */}
                            <div className="absolute top-[2.5rem] left-[5%] right-[5%] h-0.5 border-t-2 border-dotted border-slate-300 dark:border-slate-700 -z-10 translate-y-[-1px]" />

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
                            <div className="grid grid-cols-4 gap-4 md:gap-8">
                                {[
                                    { num: 1, title: "Vous indiquez votre situation", desc: "Répondez à quelques questions simples sur votre activité. (30s chrono, promis)." },
                                    { num: 2, title: "PhoBee liste vos obligations et vos aides disponibles", desc: "Nous détectons vos échéances, vos aides potentielles et vos plafonds." },
                                    { num: 3, title: "On demande à votre place vos aides", desc: "Nous remplissons le document. Vous vérifiez en quelques minutes." },
                                    { num: 4, title: "Rappel avant chaque date importante", desc: "Seulement l'essentiel, sans vous déranger inutilement." }
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
                                                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] flex items-center justify-center text-2xl md:text-3xl font-normal bg-white dark:bg-slate-900 transition-colors duration-300 mb-6 z-20 shadow-lg ${isCurrent ? 'text-slate-900 border-[#FFD700]' : 'text-slate-400 border-slate-200'}`}
                                            >
                                                {step.num}
                                            </motion.div>
                                            <h3 className="text-xs md:text-sm font-bold text-[#0F172A] dark:text-white mb-2 leading-tight min-h-[3rem]">
                                                {step.title}
                                            </h3>
                                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-white leading-relaxed max-w-[150px] mx-auto hidden sm:block">
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
                                    <div className="absolute top-0 w-full h-8 z-40 flex justify-center">
                                        <div className="w-32 h-6 bg-slate-900 rounded-b-xl" />
                                    </div>

                                    {/* Swappable Content Area */}
                                    <div className="flex-1 pt-12 px-6 pb-6 relative flex flex-col">
                                        
                                        {/* Logo/Header in phone */}
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                                 <img src="/Logo PhoBee/Logo PhoBee/Abeille-Seule-CouleurOn.svg" className="w-5 h-5" alt="" />
                                            </div>
                                            <h4 className="text-white font-bold text-lg">Radar à Aides</h4>
                                        </div>

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
                                                    <div className="space-y-4">
                                                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                                            <p className="text-slate-200 text-sm">Bonjour ! Quelle est votre situation ?</p>
                                                        </div>
                                                        <div className="bg-[#FFD700] p-4 rounded-2xl rounded-tr-none max-w-[85%] self-end">
                                                            <p className="text-slate-900 font-medium text-sm">Je suis agriculteur 🚜</p>
                                                        </div>
                                                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                                            <p className="text-slate-200 text-sm">Très bien. Quelles sont vos cultures principales ?</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto mb-4">
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
                                                        <p className="text-white text-sm">Notre algo scanne votre profil et trouve l'argent que vous méritez.</p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                                                            <div className="h-2 w-24 bg-slate-600 rounded mb-1" />
                                                            <CheckCircle2 className="text-green-500 w-5 h-5 ml-auto" />
                                                        </div>
                                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                                                            <div className="h-2 w-20 bg-slate-600 rounded mb-1" />
                                                            <AlertCircle className="text-orange-500 w-5 h-5 ml-auto" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* SCREEN 3: FILLING */}
                                            {activeStep === 3 && (
                                                <motion.div
                                                    key="screen-3"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex flex-col h-full justify-center items-center text-center"
                                                >
                                                    <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full flex items-center justify-center mb-6">
                                                        <FileText className="text-[#FFD700] w-10 h-10" />
                                                    </div>
                                                    <h4 className="text-white font-bold text-xl mb-2">Dossier en cours</h4>
                                                    <p className="text-slate-400 text-sm">Nous remplissons vos formulaires automatiquement.</p>
                                                </motion.div>
                                            )}

                                            {/* SCREEN 4: NOTIFICATION */}
                                            {activeStep === 4 && (
                                                <motion.div
                                                    key="screen-4"
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

                                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg flex items-start gap-4 transform rotate-1">
                                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">Rappel Important</h5>
                                                            <p className="text-xs text-slate-500 dark:text-white mt-1">Échéance demain !</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Bottom Blur Effect */}
                                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />
                                </div>
                            </motion.div>

                            {/* Floating "Sécurité Maximale" Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-[10%] -left-12 z-20 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl max-w-[260px] flex items-start gap-4 border border-slate-100 dark:border-slate-800"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Sécurité Maximale</h5>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                                        Vos données restent cryptées sur votre téléphone. On ne vend rien.
                                    </p>
                                </div>
                            </motion.div>
                             
                             {/* Floating Certification Badge */}
                            <div className="absolute top-[80%] -right-8 z-30 transform rotate-12">
                                <img src="/images/badge-certif.png" className="w-24 h-24" alt="Certifié" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
