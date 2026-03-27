"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { FileText, Search, ExternalLink } from "lucide-react";

interface Notice {
    id: string;
    label: string;
    url: string;
    date: string;
    organization: string;
}

const DocumentCard = ({ notice }: { notice: Notice }) => {
    return (
        <div className="bg-white rounded-[1.25rem] shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 flex flex-col h-full relative overflow-hidden group">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center p-2 border border-blue-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#111827] mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {notice.label}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 truncate">
                        {notice.organization}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                    Mis à jour le {new Date(notice.date).toLocaleDateString('fr-FR')}
                </span>
                <a
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 font-semibold text-blue-700 rounded-full text-sm transition-colors group-hover:shadow-sm"
                >
                    Ouvrir le document
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
            </div>
        </div>
    );
};

export default function RadarNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchNotices() {
            try {
                const [res1, res2] = await Promise.all([
                    fetch("https://www.data.gouv.fr/api/1/datasets/?q=agriculture&page_size=50"),
                    fetch("https://www.data.gouv.fr/api/1/datasets/?q=PAC+notice")
                ]);

                const data1 = await res1.json();
                const data2 = await res2.json();

                // Concatenate both responses
                const allDatasets = [...(data1.data || []), ...(data2.data || [])];

                // Deduplicate sets by ID
                const uniqueDatasetsMap = new Map();
                allDatasets.forEach(d => uniqueDatasetsMap.set(d.id, d));
                const uniqueDatasets = Array.from(uniqueDatasetsMap.values());

                // User provided filter logic
                const processResources = (datasets: any[]) => {
                    return datasets.flatMap(dataset => {
                        return (dataset.resources || [])
                            .filter((res: any) => {
                                const title = (res.title || "").toLowerCase();
                                const isDoc = title.includes('notice') ||
                                    title.includes('guide') ||
                                    title.includes('formulaire') ||
                                    title.includes('cerfa');
                                const format = (res.format || "").toLowerCase();
                                // On accepte le PDF en priorité, mais aussi le DOCX si c'est un formulaire
                                return isDoc && (format === 'pdf' || format === 'docx');
                            })
                            .map((res: any) => ({
                                id: res.id,
                                label: res.title,
                                url: res.url,
                                date: res.last_modified,
                                organization: dataset.organization?.name || "Source officielle"
                            }));
                    });
                };

                const processedNotices = processResources(uniqueDatasets);

                // Deduplicate resources by ID
                const uniqueNoticesMap = new Map();
                processedNotices.forEach(n => uniqueNoticesMap.set(n.id, n));
                setNotices(Array.from(uniqueNoticesMap.values()));

            } catch (err) {
                console.error("Failed to fetch notices:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchNotices();
    }, []);

    const filteredNotices = useMemo(() => {
        if (!searchQuery) return notices;
        const lowerQ = searchQuery.toLowerCase();
        return notices.filter(n =>
            n.label.toLowerCase().includes(lowerQ) ||
            n.organization.toLowerCase().includes(lowerQ)
        );
    }, [notices, searchQuery]);

    return (
        <main suppressHydrationWarning={true} className="min-h-screen bg-[#F9FAFB] text-foreground flex flex-col">
            <Navbar />

            <div suppressHydrationWarning={true} className="flex-1 pt-[120px] pb-24 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6">
                        Notices & <span className="text-blue-600">Formulaires</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Retrouvez facilement les notices, guides et formulaires officiels (Cerfa, PDF, Word) correspondants aux aides et démarches agricoles.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un guide, un formulaire (ex: PAC, Bio)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full text-[16px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
                        <span className="text-blue-600">{loading ? '...' : filteredNotices.length}</span> documents trouvés
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Recherche de formulaires et notices en cours...</h3>
                            <p className="text-gray-500">Veuillez patienter pendant que nous interrogeons les sources officielles de data.gouv.fr.</p>
                        </div>
                    ) : filteredNotices.length > 0 ? (
                        filteredNotices.map((notice) => (
                            <DocumentCard key={notice.id} notice={notice} />
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Recherche de formulaires et notices en cours...</h3>
                            <p className="text-gray-500">Aucune notice ou formulaire ne correspond à votre recherche actuelle.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
