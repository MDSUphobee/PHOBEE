"use client";

import { motion } from "framer-motion";

const steps = [
    {
        number: "1",
        title: "Configure ton profil",
        desc: "Réponds à 3 questions simples sur ton activité. (30 secondes chrono, promis)."
    },
    {
        number: "2",
        title: "Phobee calcule tout",
        desc: "L'algo détecte tes échéances, tes aides potentielles et tes plafonds."
    },
    {
        number: "3",
        title: "Reçois ta notif",
        desc: "On te ping uniquement quand c'est important. Le reste du temps, chill."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Simple comme bonjour.
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-300 dark:border-slate-700 -z-0" />

                    <div className="grid md:grid-cols-3 gap-20">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative flex flex-col items-center text-center z-10"
                            >
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl font-extrabold text-primary shadow-sm mb-6 group hover:border-primary transition-colors duration-300">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm px-4">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
