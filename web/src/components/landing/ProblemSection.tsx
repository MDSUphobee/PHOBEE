"use client";

import { motion } from "framer-motion";

export default function ProblemSection() {
    return (
        <section className="py-24 md:py-32 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* ── LEFT: Image with floating labels ── */}
                    <div className="relative order-2 lg:order-1 flex justify-center">
                        {/* Image */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transform rotate-[-3deg] border-[6px] border-white dark:border-slate-800 w-full max-w-[420px]">
                            <img
                                src="/images/image2.png"
                                alt="Bureau en désordre avec des papiers administratifs"
                                className="object-cover w-full h-auto"
                            />
                        </div>

                        {/* Badge PhoBee (top-left, circle) */}
                        <div className="absolute top-[-1rem] left-[-1rem] z-20 w-[72px] h-[72px]">
                            <img
                                src="/images/badge-certif.png"
                                className="w-full h-full object-contain drop-shadow-lg"
                                alt="Badge"
                            />
                        </div>

                        {/* Label: Trop de papiers, trop de règles — yellow, left */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-[35%] -left-4 md:-left-10 bg-[#FFD700] text-slate-900 font-extrabold px-4 py-2 rounded-md shadow-xl transform -rotate-2 z-20 text-sm whitespace-nowrap"
                        >
                            Trop de papiers, trop de règles
                        </motion.div>

                        {/* Label: Du temps perdu loin de votre métier — dark, center-bottom */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 }}
                            className="absolute bottom-[22%] left-[18%] bg-[#0F172A] text-white font-extrabold px-4 py-2 rounded-md shadow-xl transform -rotate-1 z-20 text-sm whitespace-nowrap"
                        >
                            Du temps perdu loin de votre métier
                        </motion.div>

                        {/* Label: Peur de faire une erreur — white, bottom-right */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-[6%] right-[-0.5rem] md:right-[-1rem] bg-white text-slate-900 font-extrabold px-4 py-2 rounded-md shadow-xl border border-slate-100 transform rotate-1 z-20 text-sm whitespace-nowrap"
                        >
                            Peur de faire une erreur administrative
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Title + labels ── */}
                    <div className="order-1 lg:order-2 flex flex-col gap-7">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                            Vous vous reconnaissez ?
                        </h2>

                        {/* Label 1 — dark */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="inline-block bg-[#0F172A] text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg">
                                Des dates importantes oubliées
                            </span>
                        </motion.div>

                        {/* Label 2 — yellow */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.25 }}
                        >
                            <span className="inline-block bg-[#FFD700] text-slate-900 px-6 py-3 rounded-lg font-bold text-base shadow-lg ml-8 md:ml-16">
                                Des formulaires incompréhensibles
                            </span>
                        </motion.div>

                        {/* Label 3 — white outlined */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="inline-block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-bold text-base shadow-lg">
                                Peur de faire une erreur administrative
                            </span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
