"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
    FileText, Search, ChevronRight, Loader2, ArrowLeft,
    Download, Eye, CheckCircle, RefreshCcw, AlertTriangle,
    X, Send, FilePlus
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PdfInfo {
    filename: string;
    name?: string;
    description?: string;
    fields?: string[];
}

type PageStep = "list" | "form" | "loading" | "result";

// ─── PDF List Card ────────────────────────────────────────────────────────────

function PdfCard({
    pdf,
    onSelect,
}: {
    pdf: PdfInfo;
    onSelect: (pdf: PdfInfo) => void;
}) {
    const displayName = pdf.name || pdf.filename.replace(/\.[^.]+$/, "").replace(/_/g, " ");
    return (
        <button
            onClick={() => onSelect(pdf)}
            className="group w-full text-left bg-gray-900/60 hover:bg-gray-800/80 border border-white/10 hover:border-amber-400/30 rounded-2xl p-6 flex items-start gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/5 hover:-translate-y-0.5"
        >
            <div className="w-14 h-14 shrink-0 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-amber-400/20 group-hover:border-amber-400/40">
                <FileText className="w-7 h-7 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {displayName}
                </h3>
                <p className="text-sm text-gray-500 font-mono truncate">{pdf.filename}</p>
                {pdf.fields && pdf.fields.length > 0 && (
                    <p className="text-xs text-amber-400/70 mt-2">
                        {pdf.fields.length} champ{pdf.fields.length > 1 ? "s" : ""} à remplir
                    </p>
                )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
        </button>
    );
}

// ─── Field Label Formatter ─────────────────────────────────────────────────────

function formatFieldLabel(key: string): string {
    return key
        .replace(/^asking_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function guessInputType(key: string): string {
    if (key.includes("date") || key.includes("born")) return "date";
    if (key.includes("tel") || key.includes("phone")) return "tel";
    if (key.includes("email")) return "email";
    if (key.includes("number") || key.includes("siret") || key.includes("siren")) return "text";
    return "text";
}

// ─── Form Step ────────────────────────────────────────────────────────────────

const inputClass =
    "w-full px-4 py-3.5 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/50 transition-all font-mono text-sm";
const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block";

function FormStep({
    pdf,
    onBack,
    onResult,
}: {
    pdf: PdfInfo;
    onBack: () => void;
    onResult: (blobUrl: string, filename: string) => void;
}) {
    const [fields, setFields] = useState<string[]>(pdf.fields || []);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loadingFields, setLoadingFields] = useState(!pdf.fields);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const displayName =
        pdf.name || pdf.filename.replace(/\.[^.]+$/, "").replace(/_/g, " ");

    // If we don't already know the fields, fetch the PDF to derive them
    useEffect(() => {
        if (pdf.fields && pdf.fields.length > 0) return;

        // Use commonly expected cerfa fields as a sensible fallback
        const guessedFields = [
            "asking_family_name",
            "asking_usage_name",
            "asking_surname",
            "asking_born_date",
        ];
        setFields(guessedFields);
        setLoadingFields(false);
    }, [pdf]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const pdfParam = pdf.filename.replace(/\.[^.]+$/, ""); // strip extension
            const res = await fetch(`/api/pdfs/fill?pdf=${encodeURIComponent(pdfParam)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mapping: formData,
                    flatten: false,
                }),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => null);
                throw new Error(
                    errJson?.error || `Erreur ${res.status} lors de la génération.`
                );
            }

            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            onResult(blobUrl, `${pdfParam}_rempli.pdf`);
        } catch (err: any) {
            setError(err.message || "Échec de la génération du PDF.");
            setSubmitting(false);
        }
    };

    if (loadingFields) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
                <p className="font-medium">Chargement des champs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-200 mb-8 transition-colors font-medium text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste
            </button>

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
            )}

            {/* Form card */}
            <div
                className={`bg-gray-900 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 ${submitting ? "opacity-60 pointer-events-none" : ""}`}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {displayName}
                            </h2>
                            <p className="text-gray-500 text-sm font-mono mt-1">{pdf.filename}</p>
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <h3 className="flex items-center gap-3 text-base font-bold text-white mb-6">
                            <span className="flex-1 border-t border-white/5" />
                            <span className="px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-sm">
                                Informations à remplir
                            </span>
                            <span className="flex-1 border-t border-white/5" />
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((key) => (
                                <div key={key}>
                                    <label className={labelClass}>{formatFieldLabel(key)}</label>
                                    <input
                                        type={guessInputType(key)}
                                        value={formData[key] || ""}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className={inputClass}
                                        placeholder={formatFieldLabel(key)}
                                    />
                                </div>
                            ))}
                        </div>

                        {fields.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <FilePlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>Aucun champ détecté pour ce formulaire.</p>
                                <p className="text-sm mt-1">Vous pouvez quand même générer le PDF.</p>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-wait text-gray-900 font-extrabold text-base rounded-2xl shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 transition-all duration-200 min-w-[220px] justify-center"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    Valider et générer le PDF
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Result Step ──────────────────────────────────────────────────────────────

function ResultStep({
    blobUrl,
    filename,
    onRestart,
}: {
    blobUrl: string;
    filename: string;
    onRestart: () => void;
}) {
    const [isMounted, setIsMounted] = useState(false);
    const pdfName = filename.replace(/\.[^.]+$/, "").replace(/_/g, " ");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start"
            style={{ animation: "fadeSlideIn 0.4s ease both" }}
        >
            {/* Left — PDF Viewer */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs">
                        <Eye className="w-3.5 h-3.5" />
                    </span>
                    Aperçu du document
                </h2>

                <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gray-950">
                    {/* Fake browser bar */}
                    <div className="flex items-center gap-3 px-5 py-3 bg-gray-900 border-b border-white/10">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-gray-400 font-mono truncate flex-1">
                            {filename}
                        </span>
                    </div>

                    {isMounted ? (
                        <embed
                            src={blobUrl}
                            type="application/pdf"
                            className="w-full"
                            style={{ height: "780px" }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mr-3" />
                            Chargement du PDF...
                        </div>
                    )}
                </div>
            </div>

            {/* Right — Download panel */}
            <div className="lg:sticky lg:top-28">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs">
                        <Download className="w-3.5 h-3.5" />
                    </span>
                    Téléchargement
                </h2>

                <div className="flex flex-col bg-gray-900 rounded-3xl border border-white/10 p-8 shadow-2xl gap-6">
                    {/* Success badge */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-5">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-400" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-extrabold text-white leading-tight">
                            Votre formulaire <span className="text-amber-400">est prêt&nbsp;!</span>
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                            Le PDF a été rempli avec vos informations et est disponible immédiatement.
                        </p>
                    </div>

                    {/* Doc info */}
                    <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                                Document généré
                            </p>
                            <p className="text-white font-semibold text-sm truncate">{pdfName}</p>
                            <p className="text-gray-500 text-xs mt-0.5 font-mono">{filename}</p>
                        </div>
                    </div>

                    {/* Download */}
                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold text-base rounded-2xl shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        <Download className="w-5 h-5" />
                        Télécharger le PDF
                    </button>

                    {/* Open in tab */}
                    <button
                        onClick={() => window.open(blobUrl, "_blank", "noopener,noreferrer")}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 transition-all duration-200"
                    >
                        <Eye className="w-4 h-4" />
                        Ouvrir dans un nouvel onglet
                    </button>

                    {/* Restart */}
                    <div className="border-t border-white/5 pt-4">
                        <button
                            onClick={onRestart}
                            className="w-full flex items-center justify-center gap-2.5 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Remplir un autre formulaire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormulairesPage() {
    const [pdfs, setPdfs] = useState<PdfInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [step, setStep] = useState<PageStep>("list");
    const [selectedPdf, setSelectedPdf] = useState<PdfInfo | null>(null);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [resultFilename, setResultFilename] = useState("formulaire_rempli.pdf");

    // Cleanup blob on unmount
    useEffect(() => {
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    // Fetch PDF list
    useEffect(() => {
        async function fetchPdfs() {
            try {
                const res = await fetch("/api/pdfs");
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const data = await res.json();

                // Normalise the response — can be array of strings or objects
                let list: PdfInfo[] = [];
                if (Array.isArray(data)) {
                    list = data.map((item: any) => {
                        if (typeof item === "string") return { filename: item };
                        return {
                            filename: item.filename || item.name || String(item),
                            name: item.name,
                            description: item.description,
                            fields: item.fields,
                        };
                    });
                } else if (data && typeof data === "object") {
                    // maybe { pdfs: [...] } or { data: [...] }
                    const arr = data.pdfs || data.data || data.files || [];
                    list = arr.map((item: any) => {
                        if (typeof item === "string") return { filename: item };
                        return {
                            filename: item.filename || item.name || String(item),
                            name: item.name,
                            description: item.description,
                            fields: item.fields,
                        };
                    });
                }

                setPdfs(list);
            } catch (err: any) {
                setLoadError(err.message || "Impossible de récupérer les formulaires.");
            } finally {
                setLoading(false);
            }
        }
        fetchPdfs();
    }, []);

    const filteredPdfs = pdfs.filter((p) => {
        const q = search.toLowerCase();
        const name = (p.name || p.filename).toLowerCase();
        return name.includes(q);
    });

    const handleSelectPdf = (pdf: PdfInfo) => {
        setSelectedPdf(pdf);
        setStep("form");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleResult = (url: string, filename: string) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        setBlobUrl(url);
        setResultFilename(filename);
        setStep("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRestart = () => {
        if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }
        setSelectedPdf(null);
        setStep("list");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-[#0b0f1a] text-white flex flex-col">
            <Navbar />

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeSlideIn 0.5s ease both;
                }
            ` }} />

            <div className="flex-1 pt-[120px] pb-24 container mx-auto px-4 md:px-6">

                {/* ── Header (always visible) ── */}
                {step === "list" && (
                    <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in">
                        {/* Pill badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
                            <FileText className="w-3.5 h-3.5" />
                            Formulaires officiels
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                            Remplissez vos{" "}
                            <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                                CERFA
                            </span>{" "}
                            en ligne
                        </h1>

                        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                            Sélectionnez un formulaire, renseignez vos informations et téléchargez votre PDF prêt à déposer.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher un formulaire (ex: cerfa, déclaration)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-14 pr-5 py-4 bg-gray-900/80 border border-white/10 rounded-2xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/30 transition-all shadow-xl"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Step: LIST ── */}
                {step === "list" && (
                    <div className="animate-fade-in">
                        {/* Count */}
                        <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                            <h2 className="text-sm font-bold text-gray-400 border-l-4 border-amber-400 pl-3">
                                <span className="text-amber-400">{loading ? "..." : filteredPdfs.length}</span>{" "}
                                formulaire{filteredPdfs.length !== 1 ? "s" : ""} disponible{filteredPdfs.length !== 1 ? "s" : ""}
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-28 text-gray-500">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                                    </div>
                                </div>
                                <p className="font-medium text-gray-400">
                                    Chargement des formulaires disponibles...
                                </p>
                            </div>
                        ) : loadError ? (
                            <div className="max-w-xl mx-auto flex items-start gap-4 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Impossible de charger les formulaires</p>
                                    <p className="text-sm opacity-80">{loadError}</p>
                                    <p className="text-sm opacity-60 mt-1">Vérifiez que le serveur Laravel est bien démarré sur http://127.0.0.1:8000</p>
                                </div>
                            </div>
                        ) : filteredPdfs.length === 0 ? (
                            <div className="max-w-xl mx-auto text-center py-20 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold text-lg text-gray-300 mb-2">
                                    {search ? "Aucun résultat" : "Aucun formulaire disponible"}
                                </p>
                                <p className="text-sm">
                                    {search
                                        ? `Aucun formulaire ne correspond à "${search}".`
                                        : "Aucun PDF n'est disponible pour le moment."}
                                </p>
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="mt-4 text-amber-400 hover:underline text-sm font-medium"
                                    >
                                        Effacer la recherche
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl mx-auto">
                                {filteredPdfs.map((pdf) => (
                                    <PdfCard key={pdf.filename} pdf={pdf} onSelect={handleSelectPdf} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step: FORM ── */}
                {step === "form" && selectedPdf && (
                    <div className="animate-fade-in">
                        <FormStep
                            pdf={selectedPdf}
                            onBack={() => setStep("list")}
                            onResult={handleResult}
                        />
                    </div>
                )}

                {/* ── Step: RESULT ── */}
                {step === "result" && blobUrl && (
                    <div className="animate-fade-in">
                        {/* Breadcrumb */}
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-200 mb-8 transition-colors font-medium text-sm max-w-7xl mx-auto w-full"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la liste des formulaires
                        </button>
                        <ResultStep
                            blobUrl={blobUrl}
                            filename={resultFilename}
                            onRestart={handleRestart}
                        />
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
