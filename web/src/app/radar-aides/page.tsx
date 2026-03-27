"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, FileText } from "lucide-react";
import Link from "next/link";

export default function RadarAides() {
    const [pdfs, setPdfs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPdfs() {
            try {
                const res = await fetch("/api/aides");
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des documents.");
                }
                const json = await res.json();
                
                // Mettre à jour l'état avec un tableau de strings "aide_name"
                if (Array.isArray(json)) {
                    const names = json.map((item: any) => item.aide_name).filter(Boolean);
                    setPdfs(names);
                } else if (json.data && Array.isArray(json.data)) {
                    setPdfs(json.data.map((item: any) => item.aide_name || item).filter(Boolean));
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
        return pdfs.filter(pdf => pdf.toLowerCase().includes(lowerQ));
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
                            <Link key={idx} href={`/radar-aides/formulaire?name=${encodeURIComponent(formatTitle(pdf))}`} passHref>
                                <div className="bg-white cursor-pointer rounded-[1.25rem] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 flex flex-col h-full relative overflow-hidden group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 shrink-0 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 text-amber-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 pt-1 break-words">
                                            <h3 className="text-lg font-bold text-[#111827] leading-tight group-hover:text-amber-500 transition-colors">
                                                {formatTitle(pdf)}
                                            </h3>
                                        </div>
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
