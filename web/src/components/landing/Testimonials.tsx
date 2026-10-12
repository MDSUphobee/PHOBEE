"use client";

import { Star } from "lucide-react";
import Highlight from "@/components/ui/highlight";

const testimonials = [
    {
        name: "Jean",
        role: "Exploitant céréalier",
        content: "Avant, je repoussais toujours l'administratif. Maintenant, je sais exactement quoi faire et quand. Les rappels m'ont évité plusieurs oublis importants.",
        stars: 5,
        image: "/images/testimonials/jean.jpg"
    },
    {
        name: "Claire",
        role: "Éleveuse bovine",
        content: "Les documents pré-remplis m'ont fait gagner un temps fou. Même les CERFA que je ne comprenais pas sont devenus simples.",
        stars: 5,
        image: "/images/testimonials/claire.jpg"
    },
    {
        name: "Pierre",
        role: "Céréalier",
        content: "Le calendrier et les rappels sont indispensables. On voit tout d'un coup d'œil, sans stress.",
        stars: 5,
        image: "/images/testimonials/pierre.jpg"
    }
];

export default function Testimonials() {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Déjà + de 500 <br/>
                        agriculteurs <br/> <Highlight angle={-1}> accompagnés</Highlight>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-white max-w-2xl mx-auto uppercase tracking-wider font-semibold">
                        Et ils en parlent mieux que nous
                    </p>
                </div>

                <div className="grid gap-8 pt-6 md:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="relative rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:bg-slate-800 dark:shadow-none"
                        >
                            {/* Photo qui déborde en haut à droite */}
                            <div className="absolute -top-6 right-6 h-[72px] w-[72px] overflow-hidden rounded-full shadow-md ring-4 ring-white dark:ring-slate-800">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Nom (surligné crème) + rôle */}
                            <h4 className="pr-20">
                                <span className="inline-block rotate-[-1.25deg] rounded-lg bg-[#fff7d7] px-2.5 py-1 text-2xl font-bold leading-tight text-[#344256]">
                                    {t.name}
                                </span>
                            </h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {t.role}
                            </p>

                            {/* Citation */}
                            <p className="mt-5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                                « {t.content} »
                            </p>

                            {/* Étoiles */}
                            <div className="mt-6 flex gap-1">
                                {[...Array(t.stars)].map((_, idx) => (
                                    <Star key={idx} className="h-5 w-5 fill-[#FFCC00] text-[#FFCC00]" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
