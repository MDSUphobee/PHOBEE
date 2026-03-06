"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, Calendar } from "lucide-react";

interface Aid {
    id: number;
    name: string;
    description: string;
    submission_deadline: string | null;
    financers_full: { id: number; logo: string | null; name: string }[];
    url: string;
    application_url?: string;
    slug?: string;
    targeted_audiences?: string[];
    agriThemes?: string[];
    agriFilieres?: string[];
    relevanceScore?: number;
}

export default function RadarAides() {
    const [aids, setAids] = useState<Aid[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAids() {
            try {
                const res = await fetch("/api/aides");
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des aides.");
                }
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setAids(data.results || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAids();
    }, []);

    const filteredAids = useMemo(() => {
        if (!searchQuery) return aids;

        const lowerQ = searchQuery.toLowerCase();
        return aids.filter(aid => {
            const cleanDesc = aid.description?.replace(/<[^>]*>?/gm, '') || "";
            return aid.name.toLowerCase().includes(lowerQ) || cleanDesc.toLowerCase().includes(lowerQ);
        });
    }, [aids, searchQuery]);

    const cleanHTML = (htmlStr: string) => {
        if (!htmlStr) return "";
        return htmlStr.replace(/<[^>]*>?/gm, '');
    };

    const extractDocuments = (htmlStr: string) => {
        if (!htmlStr) return [];
        const text = htmlStr.toLowerCase();
        const docs = new Set<string>();

        if (text.includes('rib') || text.includes('relevé d\'identité bancaire')) docs.add('RIB');
        if (text.includes('siret') || text.includes('kbis')) docs.add('SIRET / KBIS');
        if (text.includes('devis')) docs.add('Devis');
        if (text.includes('msa') || text.includes('attestation msa') || text.includes('affiliation msa')) docs.add('Attestation MSA');
        if (text.includes('bilan') || text.includes('liasse fiscale')) docs.add('Bilan comptable');
        if (text.includes('plan d\'entreprise') || text.includes('pe')) docs.add('Plan d\'entreprise');

        return Array.from(docs);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR');
    };

    return (
        <main suppressHydrationWarning={true} className="min-h-screen bg-[#F9FAFB] text-foreground flex flex-col">
            <Navbar />

            <div suppressHydrationWarning={true} className="flex-1 pt-[120px] pb-24 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
                        Radar à Aides <span className="text-[#eab308]">Agricoles</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Découvrez les subventions et aides disponibles pour vous accompagner dans votre développement agricole.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <div suppressHydrationWarning={true} className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé (ex: Vigne, Bio, Matériel)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full text-[16px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-[#FFCC00] shadow-sm transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-center text-red-600 bg-red-50 p-4 rounded-xl mb-8 max-w-2xl mx-auto border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3">
                        <span className="text-amber-500">{loading ? '...' : filteredAids.length}</span> aides trouvées pour votre exploitation
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredAids.length > 0 ? (
                        filteredAids.map((aid) => (
                            <div key={aid.id} className="bg-white rounded-[1.25rem] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 flex flex-col h-full relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="w-[72px] h-[72px] shrink-0 bg-white rounded-lg flex items-center justify-center p-2 border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                                        {aid.financers_full && aid.financers_full[0]?.logo ? (
                                            <img
                                                src={aid.financers_full[0].logo}
                                                alt={aid.financers_full[0].name}
                                                className="max-w-full max-h-full object-contain"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium text-center leading-tight">Aucun<br />logo</span>
                                        )}
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-[#f8fafc] text-slate-700 border border-slate-200 shadow-sm">
                                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                        {aid.submission_deadline ? formatDate(aid.submission_deadline) : "Permanent"}
                                    </div>
                                </div>

                                {/* Thematic and Filière Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Filières */}
                                    {aid.agriFilieres && aid.agriFilieres.length > 0 && aid.agriFilieres.map(filiere => (
                                        <span key={filiere} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            {filiere}
                                        </span>
                                    ))}

                                    {/* Themes */}
                                    {aid.agriThemes && aid.agriThemes.map(theme => {
                                        let bgColor = "bg-gray-100 text-gray-700 border-gray-200";
                                        if (theme === "Urgence / Trésorerie") bgColor = "bg-red-50 text-red-700 border-red-100";
                                        else if (theme === "Installation / Transmission") bgColor = "bg-blue-50 text-blue-700 border-blue-100";
                                        else if (theme === "Transition Écologique") bgColor = "bg-green-50 text-green-700 border-green-100";
                                        else if (theme === "Investissement") bgColor = "bg-purple-50 text-purple-700 border-purple-100";

                                        return (
                                            <span key={theme} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${bgColor}`}>
                                                {theme}
                                            </span>
                                        );
                                    })}
                                </div>

                                <h3 className="text-lg font-bold text-[#111827] mb-3 line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
                                    {aid.name}
                                </h3>

                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 opacity-90">
                                    {cleanHTML(aid.description)}
                                </p>

                                {/* Pièces à fournir */}
                                {extractDocuments(aid.description).length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Pièces à fournir :</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {extractDocuments(aid.description).map(doc => (
                                                <span key={doc} className="text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200 text-slate-600 bg-slate-50">
                                                    {doc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <a
                                        href={aid.application_url || (aid.slug ? `https://aides-territoires.beta.gouv.fr/aides/${aid.slug}/` : aid.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 text-sm group-hover:underline"
                                    >
                                        Voir les détails sur Aides-Territoires
                                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos termes de recherche avec d'autres mots-clés.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
