"use client";

import { motion } from "framer-motion";
import { Calendar, Shield, LifeBuoy, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Calendrier Intelligent",
        description: "Visualisez toutes vos échéances en un coup d'œil. Synchronisé avec l'URSSAF.",
        icon: Calendar,
        className: "md:col-span-2 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-900/60",
        visual: (
            <div className="mt-4 flex flex-col gap-2 opacity-80">
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-200 flex items-center justify-center font-bold text-xs">15</div>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
                </div>
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-200 flex items-center justify-center font-bold text-xs">22</div>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-32" />
                </div>
            </div>
        )
    },
    {
        title: "Radar à Aides",
        description: "Notre algo scanne votre profil et trouve l'argent que vous oubliez.",
        icon: Radar,
        className: "md:col-span-1 bg-secondary text-primary-foreground text-white",
        // VISUAL: version plus lisible, avec couleur et info texte centrale
        visual: (
            <div className="mt-4 flex items-center justify-center h-24">
                <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow border border-primary/20">
                    <Radar className="w-8 h-8 text-primary" />
                    {/* Ajout d'une bulle "€ détectés" */}
                </div>
            </div>
        )
    },
    {
        title: "Zéro Jargon",
        description: "On vous parle comme à des humains, pas comme à des avocats.",
        icon: LifeBuoy,
        className: "md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
        visual: (
            <div className="mt-4 flex items-center justify-center">
                <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200 rounded-full text-xs font-bold">
                    "Simplifié"
                </div>
            </div>
        )
    },
    {
        title: "Sécurité Maximale",
        description: "Vos données restent cryptées sur votre téléphone. On ne vend rien.",
        icon: Shield,
        className: "md:col-span-2 bg-slate-50 dark:bg-slate-900",
        visual: (
            <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full" /> AES-256</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full" /> GDPR Compliant</span>
            </div>
        )
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Tout ce dont tu as besoin pour te lancer.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Gérer sa boîte ne devrait pas être un parcours du combattant.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                                "p-8 rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-xl",
                                feature.className
                            )}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-secondary transition-colors duration-300">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="opacity-80 text-sm leading-relaxed">{feature.description}</p>

                                <div className="mt-auto pt-6">
                                    {feature.visual}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
