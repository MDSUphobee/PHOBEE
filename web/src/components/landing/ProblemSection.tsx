"use client";

import { motion } from "framer-motion";

export default function ProblemSection() {
    return (
        /*<section className="py-32 bg-[#E0F2FE] dark:bg-slate-900/50 overflow-hidden">*/
        <section className="py-32 bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden">

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Visual - Messy Desk */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transform rotate-[-3deg] border-[6px] border-white dark:border-slate-800 z-0">
                            <img
                                src="/images/image2.png"
                                alt="Bureau en désordre"
                                className="object-cover w-full h-auto"
                            />
                        </div>

                        {/* Floating Tags - Exact Match from Mockup */}
                        {/* "Trop de papiers, trop de règles" - Left side, yellow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-[40%] -left-8 bg-[#FFD700] text-slate-900 font-extrabold px-3 py-2 rounded-sm shadow-lg transform -rotate-3 z-20 text-xs md:text-sm"
                        >
                            Trop de papiers, trop de règles
                        </motion.div>

                        {/* "Du temps perdu..." - Center/Bottom, dark */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-[10%] left-[10%] bg-[#0F172A] text-white font-extrabold px-3 py-2 rounded-sm shadow-lg transform -rotate-1 z-20 text-xs md:text-sm"
                        >
                            Du temps perdu loin de votre métier
                        </motion.div>

                        {/* "Peur de faire une erreur..." - Bottom Right, white */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="absolute bottom-[5%] -right-4 bg-white text-slate-900 font-extrabold px-3 py-2 rounded-sm shadow-lg transform rotate-2 z-20 text-xs md:text-sm"
                        >
                            Peur de faire une erreur administrative
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white leading-tight mb-8">
                            Vous vous reconnaissez ?
                        </h2>
                        <div className="space-y-6">
                            {/* Item 1 - Dark */}
                            <div className="flex items-center gap-4">
                                <span className="bg-[#0F172A] text-white px-4 py-2 rounded-md font-bold text-sm transform -rotate-1 shadow-md">
                                    Des dates importantes oubliées
                                </span>
                            </div>
                            {/* Item 2 - Yellow */}
                            <div className="flex items-center gap-4 justify-end md:justify-start md:pl-12">
                                <span className="bg-[#FFD700] text-slate-900 px-4 py-2 rounded-md font-bold text-sm transform rotate-1 shadow-md">
                                    Des formulaires incompréhensibles
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
