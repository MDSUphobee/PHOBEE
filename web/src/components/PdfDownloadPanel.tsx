"use client";

import { CheckCircle, Download, RefreshCcw, FileText } from "lucide-react";

interface PdfDownloadPanelProps {
    blobUrl: string | null;
    filename?: string;
    aideName?: string | null;
    onRestart: () => void;
}

export default function PdfDownloadPanel({
    blobUrl,
    filename = "aide.pdf",
    aideName,
    onRestart,
}: PdfDownloadPanelProps) {
    const handleDownload = () => {
        if (!blobUrl) return;
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* En-tête succès */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
                    Votre dossier <span className="text-amber-400">est prêt&nbsp;!</span>
                </h2>
                <p className="text-gray-400 text-base max-w-xs leading-relaxed">
                    Le document officiel a été rempli avec vos informations et est immédiatement disponible.
                </p>
            </div>

            {/* Infos document */}
            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-5 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Document généré</p>
                    <p className="text-white font-semibold text-sm truncate" title={aideName || filename}>
                        {aideName || filename}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{filename}</p>
                </div>
            </div>

            {/* Bouton principal téléchargement */}
            <button
                onClick={handleDownload}
                disabled={!blobUrl}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/40 disabled:cursor-not-allowed text-gray-900 font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mb-4"
            >
                <Download className="w-5 h-5" />
                Télécharger le PDF
            </button>

            {/* Bouton secondaire — ouvrir onglet */}
            {blobUrl && (
                <button
                    onClick={() => window.open(blobUrl, "_blank", "noopener,noreferrer")}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 transition-all duration-200 mb-8"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ouvrir dans un nouvel onglet
                </button>
            )}

            {/* Séparateur */}
            <div className="border-t border-white/5 pt-6 mt-auto">
                <button
                    onClick={onRestart}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Remplir un nouveau formulaire
                </button>
            </div>
        </div>
    );
}
