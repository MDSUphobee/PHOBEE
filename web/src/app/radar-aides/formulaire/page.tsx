"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AideFormStepper from "@/components/AideFormStepper";

export default function FormulairePage() {
    return (
        <main
            className="min-h-screen bg-gray-950 text-foreground flex flex-col"
            suppressHydrationWarning
            style={{ colorScheme: "dark" }}
        >
            {/* Ambient gradient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-3xl" />
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
                const res = await fetch("/aides", {
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
                const res = await fetch("/user-data", {
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

            <div className="relative z-10 flex flex-col flex-1">
                <Navbar />
                <Suspense
                    fallback={
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-32 pb-24">
                            <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                            <p className="text-gray-500 font-medium">Préparation de votre dossier...</p>
                        </div>
                    }
                >
                    <AideFormStepper />
                </Suspense>
                <Footer />
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}
