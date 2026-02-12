"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Jean",
        role: "Exploitant céréalier",
        content: "Avant, je repoussais toujours l'administratif. Maintenant, je sais exactement quoi faire et quand. Les rappels m'ont évité plusieurs oublis importants.",
        stars: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean"
    },
    {
        name: "Claire",
        role: "Éleveuse bovine",
        content: "Les documents pré-remplis m'ont fait gagner un temps fou. Même les CERFA que je ne comprenais pas sont devenus simples.",
        stars: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire"
    },
    {
        name: "Pierre",
        role: "Restaurateur",
        content: "Le calendrier et les rappels sont indispensables. On voit tout d'un coup d'œil, sans stress.",
        stars: 5,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Déjà + de 500 <br className="md:hidden" />
                        entrepreneurs accompagnés
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto uppercase tracking-wider font-semibold">
                        Et ils en parlent mieux que nous
                    </p>
                    <div className="h-1 w-20 bg-[#FFD700] mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-100 dark:border-slate-700">
                            <div className="absolute -top-6 right-8">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{t.name}</h4>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, idx) => (
                                    <Star key={idx} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                                ))}
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                « {t.content} »
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
