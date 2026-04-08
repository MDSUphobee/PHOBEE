"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type AideDocument = {
    id?: number;
    aide_name: string;
    description?: string;
    image_url?: string;
    [key: string]: any;
};

export default function RadarAides() {
    const [pdfs, setPdfs] = useState<AideDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPdfs() {
            try {
                const res = await fetch("/aides");
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des documents.");
                }
                const json = await res.json();
                
                if (Array.isArray(json)) {
                    setPdfs(json.filter((item: any) => item && item.aide_name));
                } else if (json.data && Array.isArray(json.data)) {
                    // Parfois l'API renvoie { data: [...] }
                    setPdfs(json.data.map((item: any) => {
                        if (typeof item === 'string') return { aide_name: item };
                        return item;
                    }).filter((item: any) => item && item.aide_name));
                } else {
                    setPdfs([]);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPdfs();
    }, []);

    const filteredPdfs = useMemo(() => {
        if (!searchQuery) return pdfs;
        const lowerQ = searchQuery.toLowerCase();
        return pdfs.filter(pdf => pdf.aide_name.toLowerCase().includes(lowerQ));
    }, [pdfs, searchQuery]);

    const formatTitle = (filename: string) => {
        return filename.replace(/\.pdf$/i, "");
    };

    return (
        <main suppressHydrationWarning={true} className="min-h-screen bg-[#F9FAFB] text-foreground flex flex-col">
            <Navbar />

            <div suppressHydrationWarning={true} className="flex-1 pt-[120px] pb-24 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
                        Radar à <span className="text-[#eab308]">Documents</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Retrouvez facilement les déclarations et formulaires nécessaires à vos démarches.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <div suppressHydrationWarning={true} className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé..."
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
                        <span className="text-amber-500">{loading ? '...' : filteredPdfs.length}</span> documents trouvés
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredPdfs.length > 0 ? (
                        filteredPdfs.map((pdf, idx) => (
                            <Link key={idx} href={`/radar-aides/formulaire?name=${encodeURIComponent(formatTitle(pdf.aide_name))}`} passHref>
                                <div className="bg-white flex-col h-full cursor-pointer rounded-[1.25rem] shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex relative overflow-hidden group">
                                    {pdf.image_url && (
                                        <div className="w-full h-44 shrink-0 overflow-hidden relative bg-gray-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={pdf.image_url}
                                                alt={formatTitle(pdf.aide_name)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* L'overlay subtil */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-start gap-4 mb-3">
                                            {!pdf.image_url && (
                                                <div className="w-12 h-12 shrink-0 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 text-amber-500">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div className="flex-1 pt-1 break-words">
                                                <h3 className="text-lg font-bold text-[#111827] leading-tight group-hover:text-amber-500 transition-colors">
                                                    {formatTitle(pdf.aide_name)}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {pdf.description && (
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                                                {pdf.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun document trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos termes de recherche.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
