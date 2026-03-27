"use client";

export default function SocialProof() {
    return (
        <section className="py-16 bg-[#FFD700] text-slate-900 border-y border-amber-400">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-xl md:text-2xl font-extrabold font-heading">
                            Ils nous ont fait <span className="bg-white px-2 py-1 rounded-sm inline-block transform -rotate-2 shadow-sm border border-slate-900">confiance</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8 opacity-90 mix-blend-multiply">
                        {/* Placeholder Logos with text for now as we don't have SVG assets */}
                        <div className="text-2xl font-black font-serif opacity-80 uppercase tracking-widest text-slate-900">La Ferme des Granges</div>
                        <div className="text-2xl font-black font-mono tracking-tighter opacity-80 text-slate-900">LE MAIL</div>
                        <div className="text-2xl font-black font-sans italic opacity-80 text-slate-900">Anthony Coiffure</div>
                        <div className="text-2xl font-black font-serif uppercase tracking-widest opacity-80 text-slate-900">Ferme du Domaine</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
