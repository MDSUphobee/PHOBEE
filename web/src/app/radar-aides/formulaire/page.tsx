"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

function FileUploader({ 
    id, 
    label, 
    selectedFiles = [], 
    onChange 
}: { 
    id: string, 
    label: string, 
    selectedFiles: File[], 
    onChange: (files: File[]) => void 
}) {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEvent = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragging(true);
        } else if (e.type === "dragleave" || e.type === "drop") {
            setDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDragEvent(e);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        onChange([...selectedFiles, ...newFiles]);
    };

    const removeFile = (index: number) => {
        const updated = [...selectedFiles];
        updated.splice(index, 1);
        onChange(updated);
    };

    return (
        <div className="space-y-4 w-full" suppressHydrationWarning>
            <div 
                className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${dragging ? 'bg-amber-50 border-amber-500' : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-amber-400'}`}
                onDragEnter={handleDragEvent}
                onDragOver={handleDragEvent}
                onDragLeave={handleDragEvent}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4 transition-transform ${dragging ? 'bg-amber-100 scale-110' : 'bg-white group-hover:scale-110'}`}>
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="font-semibold text-gray-900 mb-1">
                    {dragging ? "Relâchez pour ajouter vos fichiers" : "Cliquez pour téléverser ou glissez vos fichiers ici"}
                </p>
                <p className="text-sm text-gray-500">Limité à 10 Mo par fichier (PDF, JPG, PNG)</p>
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => {
                        if (e.target.files) handleFiles(Array.from(e.target.files));
                        e.target.value = ''; // reset to allow re-uploading same file
                    }}
                />
            </div>
            
            {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                    {selectedFiles.map((f, idx) => (
                        <div key={`${f.name}-${idx}`} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-amber-200 transition-colors">
                            <div className="flex items-center space-x-3 truncate">
                                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 truncate" title={f.name}>{f.name}</span>
                                <span className="text-xs text-gray-400 shrink-0">({(f.size / 1024 / 1024).toFixed(2)} Mo)</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); removeFile(idx); }} 
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
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

function FormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const aideName = searchParams.get("name");

    const [formDef, setFormDef] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<Record<string, any>>({});
    
    // UI States
    const [submitting, setSubmitting] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    useEffect(() => {
        if (!aideName) {
            setError("Aucun nom d'aide spécifié.");
            setLoading(false);
            return;
        }

        async function fetchForm() {
            try {
                const res = await fetch("/api/aides", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filters: { aide_name: aideName } })
                });

                if (!res.ok) throw new Error("Erreur serveur lors de la récupération du formulaire.");
                
                const data = await res.json();
                if (data && data.length > 0 && data[0].json_questions) {
                    let parsedContent = data[0].json_questions;
                    if (typeof parsedContent === 'string') {
                        try {
                            parsedContent = JSON.parse(parsedContent);
                        } catch (e) {
                            console.error("Erreur de parsing json_questions:", e);
                        }
                    }

                    // Save both the full structure and the ID
                    setFormDef({
                        id: data[0].id,
                        content: parsedContent
                    });
                } else {
                    throw new Error("Formulaire introuvable pour ce document.");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchForm();
    }, [aideName]);

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simuler la présence ou non d'un utilisateur
        // CHANGE THIS VALUE TO TEST DIFFERENT FLOWS
        const user_id = null; // null = génère le PDF. "123" = Sauvegarde en BDD.

        if (user_id) {
            // Utilisateur connecté -> Enregistrement en base de données via notre nouvelle API (et pas de génération de PDF simulée frontend)
            setSubmitting(true);
            try {
                const res = await fetch("/api/user-data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user_id,
                        aides_id: formDef.id,
                        json_data: formData
                    })
                });

                if (!res.ok) throw new Error("Erreur de validation. Identifiant manquant.");
                
                toast.success("Dossier validé et enregistré en base de données !");
                router.push("/radar-aides");
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setSubmitting(false);
            }
        } else {
            // Utilisateur non connecté -> Ne PAS sauvegarder en base. Simuler remplissage PDF et affichage
            console.log("Utilisateur non connecté : l'envoi en base de données a été annulé.");
            console.log("Les données qui auraient été envoyées :", { user_id, aides_id: formDef.id, json_data: formData });
            
            setPdfGenerating(true);
            
            // Simulation du remplissage du document PDF officiel
            setTimeout(() => {
                try {
                    const doc = new jsPDF();
                    doc.setFontSize(22);
                    doc.setTextColor(230, 150, 0); // Amber Phobee Color
                    doc.text(formDef.content.formulaire || "Document Pré-rempli", 20, 20);
                    
                    doc.setFontSize(11);
                    doc.setTextColor(50, 50, 50);
                    let yPosition = 35;
                    
                    Object.entries(formData).forEach(([key, value]) => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        doc.setFont("helvetica", "bold");
                        doc.text(`${key} :`, 20, yPosition);
                        doc.setFont("helvetica", "normal");
                        
                        let strValue = Array.isArray(value) ? value.join(", ") : 
                                       value === true ? "Oui" : 
                                       value === false ? "Non" : 
                                       typeof value === 'object' ? "[Fichiers joints]" : String(value);
                                       
                        doc.text(strValue, 80, yPosition);
                        yPosition += 10;
                    });
                    
                    doc.setFontSize(9);
                    doc.setTextColor(150, 150, 150);
                    doc.text("Généré par Phobee Aides-Agricoles", 20, 285);

                    const blobUrl = URL.createObjectURL(doc.output("blob"));
                    setPdfUrl(blobUrl);
                    
                    setPdfGenerating(false);
                    setPdfGenerated(true);
                } catch(e) {
                    console.error("PDF generation failed:", e);
                    toast.error("Échec lors de la génération du PDF.");
                    setPdfGenerating(false);
                }
            }, 3000); // 3 seconds delay for realism
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24" suppressHydrationWarning>
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-500">Chargement du formulaire...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 pt-32 pb-24 container mx-auto px-4 max-w-3xl text-center" suppressHydrationWarning>
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
                    <p className="font-medium mb-4">{error}</p>
                    <button onClick={() => router.back()} className="px-4 py-2 bg-white rounded-lg shadow-sm font-medium hover:bg-gray-50 border border-gray-200">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    if (!formDef) return null;

    if (pdfGenerating) {
        return (
            <div className="flex-1 flex items-center justify-center pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center" suppressHydrationWarning>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center w-full">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-amber-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                        <svg className="absolute inset-0 m-auto w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">Remplissage du PDF...</h2>
                    <p className="text-gray-500 mb-8 max-w-md">Nous intégrons vos informations dans le document officiel. Merci de patienter quelques secondes.</p>
                </div>
            </div>
        );
    }

    if (pdfGenerated) {
        return (
            <div className="flex-1 pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center" suppressHydrationWarning>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre formulaire est prêt !</h2>
                    <p className="text-gray-500 mb-8 max-w-md">Vous n'êtes pas connecté, votre dossier n'a donc pas été enregistré en base. Vous pouvez dès à présent télécharger votre PDF complété.</p>
                    
                    <a 
                        href={pdfUrl} 
                        download={`document_${aideName?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mb-6"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Télécharger le document PDF
                    </a>
                    
                    <button 
                        onClick={() => router.push('/radar-aides')} 
                        className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste des aides
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 pt-32 pb-24 container mx-auto px-4 md:px-6 max-w-4xl" suppressHydrationWarning>
            <button 
                onClick={() => router.back()} 
                className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à la liste des documents
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="mb-10 border-b border-gray-100 pb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4">
                        {formDef.content.formulaire}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Document : <span className="font-semibold text-gray-700">{aideName}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {formDef.content.sections?.map((section: any) => (
                        <div key={section.id} className="space-y-6">
                            <h2 className="text-xl font-bold text-[#111827] border-l-4 border-[#FFCC00] pl-4 py-1.5 bg-gray-50 rounded-r-lg">
                                {section.titre}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-5">
                                {section.questions?.map((q: any) => (
                                    <div key={q.id} className={`flex flex-col space-y-2 ${q.type === 'textarea' || q.type === 'file_list' ? 'md:col-span-2' : ''}`}>
                                        <label htmlFor={q.id} className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
                                            {q.label} {q.type === 'file_list' && <span className="text-[10px] font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded ml-2">Téléversement recommandé</span>}
                                        </label>
                                        
                                        {q.type === 'select' ? (
                                            <select
                                                id={q.id}
                                                required
                                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent transition-all text-gray-900"
                                                value={formData[q.id] || ''}
                                                onChange={(e) => handleInputChange(q.id, e.target.value)}
                                            >
                                                <option value="" disabled>Sélectionner une option...</option>
                                                {q.options?.map((opt: string) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : q.type === 'textarea' ? (
                                            <textarea
                                                id={q.id}
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent transition-all resize-none text-gray-900"
                                                value={formData[q.id] || ''}
                                                onChange={(e) => handleInputChange(q.id, e.target.value)}
                                            />
                                        ) : q.type === 'boolean' ? (
                                            <div className="flex items-center space-x-6 h-12">
                                                <label className="flex items-center space-x-2.5 cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <input 
                                                        type="radio" 
                                                        name={q.id} 
                                                        value="yes" 
                                                        checked={formData[q.id] === true}
                                                        onChange={() => handleInputChange(q.id, true)}
                                                        className="w-5 h-5 text-amber-500 focus:ring-amber-500 border-gray-300"
                                                    />
                                                    <span className="font-medium text-gray-900">Oui</span>
                                                </label>
                                                <label className="flex items-center space-x-2.5 cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <input 
                                                        type="radio" 
                                                        name={q.id} 
                                                        value="no" 
                                                        checked={formData[q.id] === false}
                                                        onChange={() => handleInputChange(q.id, false)}
                                                        className="w-5 h-5 text-amber-500 focus:ring-amber-500 border-gray-300"
                                                    />
                                                    <span className="font-medium text-gray-900">Non</span>
                                                </label>
                                            </div>
                                        ) : q.type === 'checkbox' ? (
                                            <div className="space-y-2 mt-2">
                                                {q.options?.map((opt: string) => (
                                                    <label key={opt} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white">
                                                        <input 
                                                            type="checkbox"
                                                            value={opt}
                                                            checked={(formData[q.id] || []).includes(opt)}
                                                            onChange={(e) => {
                                                                const current = formData[q.id] || [];
                                                                if (e.target.checked) {
                                                                    handleInputChange(q.id, [...current, opt]);
                                                                } else {
                                                                    handleInputChange(q.id, current.filter((item: string) => item !== opt));
                                                                }
                                                            }}
                                                            className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                                        />
                                                        <span className="text-gray-900 font-medium">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : q.type === 'file_list' ? (
                                            <FileUploader 
                                                id={q.id} 
                                                label={q.label} 
                                                selectedFiles={formData[q.id] || []} 
                                                onChange={(files) => handleInputChange(q.id, files)} 
                                            />
                                        ) : (
                                            <input
                                                type={q.type}
                                                id={q.id}
                                                required
                                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent transition-all text-gray-900"
                                                value={formData[q.id] || ''}
                                                onChange={(e) => handleInputChange(q.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pt-10 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || pdfGenerating}
                            className={`flex items-center px-8 py-5 rounded-xl text-[#111827] font-extrabold text-lg shadow-md transition-all ${(submitting || pdfGenerating) ? 'bg-[#FFCC00]/70 cursor-not-allowed' : 'bg-[#FFCC00] hover:bg-[#eab308] hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            {(submitting || pdfGenerating) ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    Valider mes informations
                                    <Send className="w-6 h-6 ml-3" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FormulairePage() {
    return (
        <main className="min-h-screen bg-[#F9FAFB] text-foreground flex flex-col" suppressHydrationWarning>
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24">
                    <Loader2 className="h-12 w-12 text-[#FFCC00] animate-spin mb-6" />
                    <p className="text-gray-500 font-medium text-lg">Préparation de votre dossier...</p>
                </div>
            }>
                <FormContent />
            </Suspense>
            <Footer />
        </main>
    );
}
