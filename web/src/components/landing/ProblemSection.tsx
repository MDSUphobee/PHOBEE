"use client";

import { motion } from "framer-motion";

const VARIANTS = {
    yellow: "bg-[#FFD700] text-slate-900",
    dark: "bg-[#0F172A] text-white",
    light: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white",
} as const;

type Label = {
    text: string;
    variant: keyof typeof VARIANTS;
    mobile: string;
    desktop: string;
    delay: number;
};

const LABELS: Label[] = [
    { text: "Trop de papiers, trop de règles",         variant: "yellow", mobile: "self-start",  desktop: "top-[75px] left-[5%]",   delay: 0.2 },
    { text: "Des dates importantes oubliées",          variant: "dark",   mobile: "self-end",    desktop: "top-[86px] left-[50%]",  delay: 0.1 },
    { text: "Du temps perdu loin de votre métier",     variant: "dark",   mobile: "self-start",  desktop: "top-[180px] left-[25%]", delay: 0.35 },
    { text: "Des formulaires incompréhensibles",       variant: "yellow", mobile: "self-end",    desktop: "top-[160px] left-[64%]", delay: 0.25 },
    { text: "Peur de faire une erreur administrative", variant: "light",  mobile: "self-center", desktop: "top-[290px] left-[52%]", delay: 0.4 },
];

const IMAGE = { src: "/images/image2.png", alt: "Bureau en désordre avec des papiers administratifs" };
const BADGE = "/images/badge-doc-rempli-auto.svg";
const TITLE = "Vous vous reconnaissez ?";

export default function ProblemSection() {
    return (
        <section className="relative pt-[5em] lg:pt-[18em] bg-[#F9FAFB] dark:bg-slate-900/50 overflow-hidden">

            {/* ── MOBILE / TABLETTE (< lg) ── */}
            <div className="lg:hidden relative overflow-hidden rounded-[24px] bg-[#deeefc] dark:bg-slate-800/40 px-4 py-10 mx-3 mb-2">
                <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                    {TITLE}
                </h2>

                <div className="relative mx-auto mt-8 w-full max-w-[440px] sm:max-w-[520px]">
                    <img {...IMAGE} decoding="async" className="w-full h-auto rounded-[1.5rem] object-cover" />
                    <img src={BADGE} alt="" aria-hidden className="absolute -top-4 -left-4 size-[130px] object-contain drop-shadow-lg -rotate-6" />
                </div>

                <div className="relative z-20 -mt-[16em] flex flex-col gap-3.5 font-bold text-sm">
                    {LABELS.map(({ text, variant, mobile }) => (
                        <span key={text} className={`${mobile} ${VARIANTS[variant]} px-4 py-2 rounded-md shadow-lg`}>
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── DESKTOP (lg+) ── */}
            <div className="hidden lg:block absolute bottom-[3.5em] left-[10em] z-10 -rotate-1 w-full max-w-[450px]">
                <img {...IMAGE} decoding="async" className="w-full h-auto object-cover" />
                <img src={BADGE} alt="" aria-hidden className="absolute -top-8 -left-8 size-[130px] object-contain drop-shadow-xl -rotate-3" />
            </div>

            <div className="hidden lg:block relative rounded-[32px] bg-[#deeefc] dark:bg-slate-800/40 px-16 pb-16 pt-4 mx-[3em] mb-2 min-h-[380px]">
                <h2 className="w-1/2 ml-auto text-center text-3xl font-extrabold text-[#0F172A] dark:text-white leading-tight">
                    {TITLE}
                </h2>

                {LABELS.map(({ text, variant, desktop, delay }) => (
                    <motion.span
                        key={text}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay, duration: 0.4 }}
                        className={`absolute ${desktop} z-20 whitespace-nowrap ${VARIANTS[variant]} font-bold text-lg px-5 py-2 rounded-md shadow-lg`}
                    >
                        {text}
                    </motion.span>
                ))}
            </div>
        </section>
    );
}
