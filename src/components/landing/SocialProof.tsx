"use client";

import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Thomas D.",
        role: "Freelance Dev",
        content: "Avant je paniquais à chaque courrier de l'URSSAF. Maintenant je reçois une notif la veille, je clique, c'est payé.",
        stars: 5
    },
    {
        name: "Sarah L.",
        role: "Graphiste",
        content: "Phobee m'a trouvé une aide régionale dont j'ignorais l'existence. L'abo est rentabilisé pour 10 ans. 😅",
        stars: 5
    },
    {
        name: "Marc R.",
        role: "Consultant Marketing",
        content: "L'interface est dingue. C'est la première fois que je prends du plaisir à faire de l'admin.",
        stars: 5
    }
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                        Ils dorment mieux depuis qu'ils ont Phobee.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-slate-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, idx) => (
                                    <Star key={idx} className="w-5 h-5 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-slate-700 italic mb-6">"{t.content}"</p>
                            <div>
                                <p className="font-bold text-secondary">{t.name}</p>
                                <p className="text-sm text-slate-500">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Vu sur</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake Logos */}
                        <div className="text-xl font-bold font-serif">TechCrunch</div>
                        <div className="text-xl font-bold font-sans tracking-tighter">Station F</div>
                        <div className="text-xl font-bold font-mono">MaddyNess</div>
                        <div className="text-xl font-bold italic">Les Echos</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
