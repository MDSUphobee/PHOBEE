"use client";

import { useEffect, useState } from "react";
import { Loader2, FileX } from "lucide-react";

interface PdfViewerProps {
    blobUrl: string | null;
    filename?: string;
}

export default function PdfViewer({ blobUrl, filename = "document.pdf" }: PdfViewerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center w-full h-[700px] bg-gray-900/50 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                    <span className="text-sm font-medium">Chargement du document...</span>
                </div>
            </div>
        );
    }

    if (!blobUrl) {
        return (
            <div className="flex items-center justify-center w-full h-[700px] bg-gray-900/50 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <FileX className="w-10 h-10" />
                    <span className="text-sm font-medium">Aucun document à afficher</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gray-950">
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-900 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-400 font-mono truncate flex-1">{filename}</span>
            </div>
            <embed
                src={blobUrl}
                type="application/pdf"
                className="w-full"
                style={{ height: "700px" }}
            />
        </div>
    );
}
