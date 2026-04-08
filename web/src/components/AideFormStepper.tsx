"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import PdfViewer from "@/components/PdfViewer";
import PdfDownloadPanel from "@/components/PdfDownloadPanel";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "form" | "loading" | "result";

interface Question {
    id: string;
    label: string;
    type: "text" | "select" | "date" | "tel" | "email" | "number" | "textarea" | "checkbox" | "boolean" | "file_list";
    options?: string[];
    required?: boolean;
}

interface Section {
    id: string;
    titre: string;
    questions: Question[];
}

interface FormDef {
    id: number;
    content: {
        formulaire: string;
        sections: Section[];
    };
}

// ─── Drag-and-drop File Uploader ─────────────────────────────────────────────

function FileUploader({
    id, label, selectedFiles = [], onChange,
}: {
    id: string; label: string; selectedFiles: File[]; onChange: (files: File[]) => void;
}) {
    const [dragging, setDragging] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleDragEvent = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragging(e.type === "dragenter" || e.type === "dragover");
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragging(false);
        if (e.dataTransfer.files.length > 0)
            onChange([...selectedFiles, ...Array.from(e.dataTransfer.files)]);
    };
    const removeFile = (i: number) => {
        const updated = [...selectedFiles]; updated.splice(i, 1); onChange(updated);
    };

    return (
        <div className="space-y-3 w-full">
            <div
                className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all ${dragging ? "bg-amber-950/30 border-amber-500/60" : "bg-gray-800/40 border-gray-700 hover:border-amber-500/40 hover:bg-gray-800/60"}`}
                onDragEnter={handleDragEvent} onDragOver={handleDragEvent}
                onDragLeave={handleDragEvent} onDrop={handleDrop}
                onClick={() => ref.current?.click()}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform ${dragging ? "bg-amber-500/20 scale-110" : "bg-gray-700/60"}`}>
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="font-semibold text-gray-200 mb-1">{dragging ? "Relâchez pour ajouter" : "Cliquez ou glissez vos fichiers"}</p>
                <p className="text-xs text-gray-500">Limité à 10 Mo par fichier (PDF, JPG, PNG)</p>
                <input type="file" multiple className="hidden" ref={ref}
                    onChange={(e) => { if (e.target.files) { onChange([...selectedFiles, ...Array.from(e.target.files)]); e.target.value = ""; } }} />
            </div>
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    {selectedFiles.map((f, i) => (
                        <div key={`${f.name}-${i}`} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-xl">
                            <span className="text-sm text-gray-300 truncate flex-1">{f.name}</span>
                            <span className="text-xs text-gray-500 mx-3">{(f.size / 1024 / 1024).toFixed(2)} Mo</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Field Renderer ───────────────────────────────────────────────────────────

const inputClass = "w-full px-4 py-3.5 rounded-xl bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/50 transition-all";
const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block";

function FieldRenderer({ q, value, onChange, disabled }: { q: Question; value: any; onChange: (v: any) => void; disabled: boolean }) {
    if (q.type === "select") return (
        <select disabled={disabled} value={value || ""} onChange={e => onChange(e.target.value)} className={`${inputClass} disabled:opacity-50`}>
            <option value="" disabled>Sélectionner...</option>
            {q.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
    if (q.type === "textarea") return (
        <textarea disabled={disabled} rows={4} value={value || ""} onChange={e => onChange(e.target.value)}
            className={`${inputClass} resize-none disabled:opacity-50`} placeholder={q.label} />
    );
    if (q.type === "boolean") return (
        <div className="flex items-center gap-4 h-12">
            {[{ label: "Oui", val: true }, { label: "Non", val: false }].map(({ label, val }) => (
                <label key={String(val)} className={`flex items-center gap-2.5 cursor-pointer px-5 py-2.5 rounded-xl border transition-all ${value === val ? "bg-amber-400/10 border-amber-400/40 text-amber-300" : "bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-600"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <input type="radio" name={q.id} value={String(val)} checked={value === val}
                        onChange={() => onChange(val)} className="sr-only" />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${value === val ? "border-amber-400 bg-amber-400" : "border-gray-600"}`}>
                        {value === val && <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />}
                    </span>
                    <span className="font-semibold text-sm">{label}</span>
                </label>
            ))}
        </div>
    );
    if (q.type === "checkbox") return (
        <div className={`space-y-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
            {q.options?.map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-gray-700 bg-gray-800/40 hover:bg-gray-800 hover:border-gray-600 transition-all">
                    <input type="checkbox" value={opt} checked={(value || []).includes(opt)}
                        onChange={e => onChange(e.target.checked ? [...(value || []), opt] : (value || []).filter((i: string) => i !== opt))}
                        className="w-4 h-4 rounded border-gray-600 text-amber-400 bg-gray-800 focus:ring-amber-400/50" />
                    <span className="text-gray-300 text-sm font-medium">{opt}</span>
                </label>
            ))}
        </div>
    );
    if (q.type === "file_list") return (
        <FileUploader id={q.id} label={q.label} selectedFiles={value || []} onChange={onChange} />
    );
    return (
        <input type={q.type} disabled={disabled} value={value || ""} onChange={e => onChange(e.target.value)}
            className={`${inputClass} disabled:opacity-50`} placeholder={q.label} />
    );
}

// ─── Main Stepper ─────────────────────────────────────────────────────────────

export default function AideFormStepper() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const aideName = searchParams.get("name");

    // Data states
    const [formDef, setFormDef] = useState<FormDef | null>(null);
    const [loadingDef, setLoadingDef] = useState(true);
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Workflow states
    const [step, setStep] = useState<Step>("form");
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState("aide.pdf");
    const [backendError, setBackendError] = useState<string | null>(null);

    // Revoke blob URL on cleanup
    useEffect(() => {
        return () => { if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl); };
    }, [pdfBlobUrl]);

    // Fetch form definition
    useEffect(() => {
        if (!aideName) { setLoadingDef(false); return; }
        async function fetchForm() {
            try {
                const res = await fetch("/api/aides", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filters: { aide_name: aideName } }),
                });
                if (!res.ok) throw new Error("Erreur lors de la récupération du formulaire.");
                const data = await res.json();
                if (!data?.length || !data[0].json_questions) throw new Error("Formulaire introuvable.");
                let content = data[0].json_questions;
                if (typeof content === "string") content = JSON.parse(content);
                setFormDef({ id: data[0].id, content });
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoadingDef(false);
            }
        }
        fetchForm();
    }, [aideName]);

    const handleFieldChange = (id: string, value: any) =>
        setFormData(prev => ({ ...prev, [id]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formDef) return;
        setStep("loading");
        setBackendError(null);

        try {
            const res = await fetch('/api/aides/fill-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aides_id: formDef.id, json_data: formData }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || `Erreur ${res.status} lors de la génération.`);
            }

            // Decode Base64 → Blob URL (client safe)
            const bytes = Uint8Array.from(atob(data.pdf_base64), c => c.charCodeAt(0));
            const blob = new Blob([bytes], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);

            if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(blobUrl);
            setFilename(data.filename || "aide.pdf");
            setStep("result");
        } catch (err: any) {
            setBackendError(err.message);
            setStep("form");
            toast.error(err.message || "Échec de la génération du PDF.");
        }
    };

    const handleRestart = () => {
        if (pdfBlobUrl) { URL.revokeObjectURL(pdfBlobUrl); setPdfBlobUrl(null); }
        setBackendError(null);
        setStep("form");
    };

    // ── Loading def ──
    if (loadingDef) return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-32 pb-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="font-medium">Chargement du formulaire...</p>
        </div>
    );

    if (!formDef) return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-32 pb-24 text-gray-400">
            <p className="font-medium">Formulaire introuvable pour ce document.</p>
            <button onClick={() => router.back()} className="text-sm text-amber-400 hover:underline">Retour</button>
        </div>
    );

    // ── Step: RESULT ──
    if (step === "result") return (
        <div className="flex-1 pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-7xl">
            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                style={{ animation: "fadeSlideIn 0.4s ease both" }}
            >
                {/* Left — PDF Viewer */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-mono">✓</span>
                        Aperçu du document
                    </h2>
                    <PdfViewer blobUrl={pdfBlobUrl} filename={filename} />
                </div>
                {/* Right — Download */}
                <div className="lg:sticky lg:top-28">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-mono">↓</span>
                        Téléchargement
                    </h2>
                    <PdfDownloadPanel
                        blobUrl={pdfBlobUrl}
                        filename={filename}
                        aideName={aideName}
                        onRestart={handleRestart}
                    />
                </div>
            </div>
        </div>
    );

    // ── Step: FORM or LOADING ──
    const isLoading = step === "loading";

    return (
        <div className="flex-1 pt-28 pb-16 container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-200 mb-8 transition-colors font-medium text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour
            </button>

            {/* Backend error banner */}
            {backendError && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">{backendError}</p>
                </div>
            )}

            {/* Form card */}
            <div className={`bg-gray-900 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
                {/* Card header */}
                <div className="px-8 pt-8 pb-6 border-b border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {formDef.content.formulaire}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">{aideName}</p>
                        </div>
                    </div>
                </div>

                {/* Form body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-12">
                    {formDef.content.sections?.map((section) => (
                        <div key={section.id}>
                            <h2 className="flex items-center gap-3 text-base font-bold text-white mb-6">
                                <span className="flex-1 border-t border-white/5" />
                                <span className="px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-sm">
                                    {section.titre}
                                </span>
                                <span className="flex-1 border-t border-white/5" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.questions?.map((q) => (
                                    <div key={q.id} className={q.type === "textarea" || q.type === "file_list" ? "md:col-span-2" : ""}>
                                        <label className={labelClass}>
                                            {q.label}
                                            {q.type === "file_list" && (
                                                <span className="ml-2 text-[10px] font-normal text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                                                    Téléversement
                                                </span>
                                            )}
                                        </label>
                                        <FieldRenderer q={q} value={formData[q.id]} onChange={v => handleFieldChange(q.id, v)} disabled={isLoading} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Submit */}
                    <div className="pt-6 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 disabled:cursor-wait text-gray-900 font-extrabold text-base rounded-2xl shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 transition-all duration-200 min-w-[200px] justify-center"
                        >
                            {isLoading ? (
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
