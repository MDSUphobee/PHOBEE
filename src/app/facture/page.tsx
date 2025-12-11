"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { jsPDF } from "jspdf";
import {
    CalendarDays,
    CheckCircle2,
    Download,
    Info,
    Plus,
    ShieldCheck,
    Sparkles,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

type LineItem = {
    description: string;
    quantity: number;
    unitPrice: number;
    tvaRate: number;
};

const LEGAL_MENTION_DEFAULT =
    "En cas de retard de paiement, application d’une indemnité forfaitaire pour frais de recouvrement de 40€ (art. D. 441-5 du code de commerce) et d'une pénalité de retard au taux directeur de la BCE majoré de 10 points.";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value || 0);

const noBreak = (value: string) => value.replace(/\s/g, "\u00a0");

const formatDate = (value: string) => {
    if (!value) return "";
    return new Intl.DateTimeFormat("fr-FR").format(new Date(value));
};

const todayIso = () => new Date().toISOString().split("T")[0];

const addDays = (date: string, days: number) => {
    const base = new Date(date);
    base.setDate(base.getDate() + days);
    return base.toISOString().split("T")[0];
};

export default function InvoiceBuilderPage() {
    const [issuerName, setIssuerName] = useState("");
    const [issuerAddress, setIssuerAddress] = useState("");
    const [issuerEmail, setIssuerEmail] = useState("");
    const [issuerPhone, setIssuerPhone] = useState("");
    const [siret, setSiret] = useState("");
    const [savedSiret, setSavedSiret] = useState("");
    const [isSiretPending, setIsSiretPending] = useState(false);
    const [tvaNumber, setTvaNumber] = useState("");

    const [clientName, setClientName] = useState("");
    const [clientAddress, setClientAddress] = useState("");

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [issueDate, setIssueDate] = useState(todayIso());
    const [dueOption, setDueOption] = useState<"reception" | "30j">("reception");

    const [isTvaEnabled, setIsTvaEnabled] = useState(false);
    const [lines, setLines] = useState<LineItem[]>([
        { description: "", quantity: 1, unitPrice: 0, tvaRate: 20 },
    ]);

    const [logoData, setLogoData] = useState<string | null>(null);

    const [bankDetails, setBankDetails] = useState("");
    const [legalMention, setLegalMention] = useState(LEGAL_MENTION_DEFAULT);

    const [showModal, setShowModal] = useState(false);
    const [checklist, setChecklist] = useState({ clientAddress: false, rib: false, amounts: false });
    const [formError, setFormError] = useState<string | null>(null);

    const dueDate = useMemo(
        () => (dueOption === "reception" ? issueDate : addDays(issueDate, 30)),
        [issueDate, dueOption],
    );

    const totals = useMemo(() => {
        const totalHT = lines.reduce((acc, line) => acc + (line.quantity || 0) * (line.unitPrice || 0), 0);
        const totalTVA = isTvaEnabled
            ? lines.reduce(
                (acc, line) => acc + (line.quantity || 0) * (line.unitPrice || 0) * (line.tvaRate || 0) / 100,
                0,
            )
            : 0;
        return { totalHT, totalTVA, totalTTC: totalHT + totalTVA };
    }, [lines, isTvaEnabled]);

    const handleLineChange = <K extends keyof LineItem>(index: number, field: K, value: LineItem[K]) => {
        setLines((prev) =>
            prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
        );
    };

    const handleAddLine = () => {
        setLines((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0, tvaRate: 20 }]);
    };

    const handleRemoveLine = (index: number) => {
        setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
    };

    const handleLogoUpload = (file?: File | null) => {
        if (!file) {
            setLogoData(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                setLogoData(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleSiretPending = (checked: boolean) => {
        setIsSiretPending(checked);
        if (checked) {
            setSavedSiret(siret);
            setSiret("SIRET : En cours d'attribution");
        } else {
            setSiret(savedSiret);
        }
    };

    const validateBeforeModal = () => {
        const hasLine = lines.some((line) => line.description.trim() && line.quantity > 0);
        if (!issuerName.trim()) {
            return "Le nom de l'émetteur est requis.";
        }
        if (!clientName.trim()) {
            return "Le nom du client est requis.";
        }
        if (!clientAddress.trim()) {
            return "L'adresse du client est requise (obligation légale).";
        }
        if (!hasLine) {
            return "Ajoutez au moins une prestation avec une description et une quantité.";
        }
        return null;
    };

    const openSecurityModal = () => {
        const error = validateBeforeModal();
        setFormError(error);
        if (error) {
            toast.error(error);
            return;
        }
        setChecklist({ clientAddress: false, rib: false, amounts: false });
        setShowModal(true);
    };

    const handleGeneratePdf = () => {
        if (!Object.values(checklist).every(Boolean)) {
            toast.error("Coche la checklist avant de valider.");
            return;
        }
        generatePdf();
        setShowModal(false);
    };

    const generatePdf = () => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const PAGE_MARGIN = 52;
        const LSPACE = 14;
        const ROW_HEIGHT = 20;
        const BSPACE = 30;
        const MAX_Y = pageHeight - PAGE_MARGIN;
        let cursorY = PAGE_MARGIN;

        const ensureSpace = (needed: number, drawHeader?: () => void) => {
            if (cursorY + needed > MAX_Y) {
                doc.addPage();
                cursorY = PAGE_MARGIN;
                if (drawHeader) drawHeader();
            }
        };

        doc.setFont("helvetica", "normal");

        // Logo (if any) - top right
        if (logoData) {
            try {
                const logoWidth = 120;
                const logoHeight = 120 * 0.6;
                const logoX = pageWidth - PAGE_MARGIN - logoWidth;
                doc.addImage(logoData, "PNG", logoX, cursorY, logoWidth, logoHeight, undefined, "FAST");
                cursorY += logoHeight + 12;
            } catch (e) {
                // ignore bad logo data, keep generating
            }
        }

        // Title
        doc.setFontSize(20);
        doc.text("Facture", PAGE_MARGIN, cursorY);
        cursorY += BSPACE;

        // Metadata
        doc.setFontSize(11);
        doc.text(`N° : ${invoiceNumber || "Non renseigné"}`, PAGE_MARGIN, cursorY);
        cursorY += LSPACE;
        doc.text(`Émise le : ${formatDate(issueDate)}`, PAGE_MARGIN, cursorY);
        cursorY += LSPACE;
        doc.text(`Échéance : ${formatDate(dueDate)}`, PAGE_MARGIN, cursorY);
        cursorY += BSPACE;

        doc.setDrawColor("#D0D7E2");
        doc.line(PAGE_MARGIN, cursorY - 8, pageWidth - PAGE_MARGIN, cursorY - 8);

        // Identities
        doc.setFontSize(13);
        doc.text("Émetteur", PAGE_MARGIN, cursorY);
        doc.text("Client", pageWidth / 2, cursorY);
        cursorY += LSPACE;

        doc.setFontSize(10);
        const issuerBlock = [
            issuerName || "Nom non renseigné",
            issuerAddress || "Adresse manquante",
            issuerEmail ? `Email : ${issuerEmail}` : "",
            issuerPhone ? `Téléphone : ${issuerPhone}` : "",
            isSiretPending ? "SIRET : En cours d'attribution" : siret ? `SIRET : ${siret}` : "",
            isTvaEnabled ? `TVA intracom : ${tvaNumber || "—"}` : "",
        ].filter(Boolean);
        const clientBlock = [
            clientName || "Client non renseigné",
            clientAddress || "Adresse manquante",
        ];
        const blockHeight = Math.max(issuerBlock.length, clientBlock.length) * LSPACE;
        issuerBlock.forEach((line, i) => doc.text(line as string, PAGE_MARGIN, cursorY + i * LSPACE));
        clientBlock.forEach((line, i) => doc.text(line as string, pageWidth / 2, cursorY + i * LSPACE));
        cursorY += blockHeight + BSPACE;

        doc.setDrawColor("#D0D7E2");
        doc.line(PAGE_MARGIN, cursorY - 10, pageWidth - PAGE_MARGIN, cursorY - 10);

        // Table columns
        const colDesc = PAGE_MARGIN;
        const colQty = colDesc + 210;
        const colPU = colQty + 80;
        const colTVA = isTvaEnabled ? colPU + 70 : null;
        const colTotal = isTvaEnabled ? (colTVA! + 100) : (colPU + 120);
        const tableWidth = colTotal - colDesc;

        const drawTableHeader = () => {
            doc.setFillColor("#FEFCE8");
            doc.setDrawColor("#E2E8F0");
            doc.rect(colDesc - 8, cursorY - ROW_HEIGHT + 6, tableWidth + 16, ROW_HEIGHT, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("Description", colDesc, cursorY);
            doc.text("Qté", colQty, cursorY, { align: "right" });
            doc.text("PU", colPU, cursorY, { align: "right" });
            if (isTvaEnabled && colTVA !== null) doc.text("TVA %", colTVA, cursorY, { align: "right" });
            doc.text("Total", colTotal, cursorY, { align: "right" });
            cursorY += ROW_HEIGHT;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
        };

        // Table title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Prestations", colDesc, cursorY);
        doc.setFont("helvetica", "normal");
        cursorY += LSPACE + 4;

        drawTableHeader();

        lines.forEach((line, idx) => {
            const lineTotal = (line.quantity || 0) * (line.unitPrice || 0);
            const lineTVA = isTvaEnabled ? lineTotal * (line.tvaRate || 0) / 100 : 0;
            const descLines = doc.splitTextToSize(String(line.description || "—"), 240) as string[];
            const rowHeight = Math.max(descLines.length * LSPACE, ROW_HEIGHT);

            ensureSpace(rowHeight + ROW_HEIGHT, drawTableHeader);

            if (idx % 2 === 0) {
                doc.setFillColor("#F8FAFC");
                doc.rect(colDesc - 8, cursorY - ROW_HEIGHT + 6, tableWidth + 16, rowHeight, "F");
            }

            doc.text(descLines, colDesc, cursorY);
            doc.text(String(line.quantity || 0), colQty, cursorY, { align: "right" });
            doc.text(formatCurrency(line.unitPrice || 0).replace(/\s/g, "\u00a0"), colPU, cursorY, { align: "right" });
            if (isTvaEnabled && colTVA !== null) doc.text(`${line.tvaRate || 0}%`, colTVA, cursorY, { align: "right" });
            doc.text(formatCurrency(lineTotal + lineTVA).replace(/\s/g, "\u00a0"), colTotal, cursorY, { align: "right" });

            doc.setDrawColor("#E2E8F0");
            doc.line(colDesc - 8, cursorY + rowHeight - ROW_HEIGHT + 4, colDesc + tableWidth + 8, cursorY + rowHeight - ROW_HEIGHT + 4);

            cursorY += rowHeight + 6;
        });

        cursorY += BSPACE / 2;
        doc.setDrawColor("#D0D7E2");
        doc.line(PAGE_MARGIN, cursorY - 4, pageWidth - PAGE_MARGIN, cursorY - 4);

        // Totals
        ensureSpace(BSPACE * 2);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Récapitulatif", PAGE_MARGIN, cursorY);
        cursorY += LSPACE + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(noBreak(`Total HT : ${formatCurrency(totals.totalHT)}`), PAGE_MARGIN, cursorY);
        cursorY += LSPACE + 2;
        if (isTvaEnabled) {
            doc.text(noBreak(`Montant TVA : ${formatCurrency(totals.totalTVA)}`), PAGE_MARGIN, cursorY);
            cursorY += LSPACE + 2;
        } else {
            doc.text("TVA non applicable, art. 293 B du CGI", PAGE_MARGIN, cursorY);
            cursorY += LSPACE + 2;
        }
        doc.setFont("helvetica", "bold");
        doc.text(noBreak(`Total TTC : ${formatCurrency(totals.totalTTC)}`), PAGE_MARGIN, cursorY);
        doc.setFont("helvetica", "normal");
        cursorY += BSPACE;

        // Bank
        ensureSpace(BSPACE);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Coordonnées bancaires", PAGE_MARGIN, cursorY);
        cursorY += LSPACE + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const bankText = bankDetails && bankDetails.trim() ? bankDetails : "IBAN / BIC non renseignés";
        const bankLines = doc.splitTextToSize(String(bankText), pageWidth - PAGE_MARGIN * 2) as string[];
        doc.text(bankLines, PAGE_MARGIN, cursorY);
        cursorY += bankLines.length * LSPACE + BSPACE / 2;

        doc.setDrawColor("#D0D7E2");
        doc.line(PAGE_MARGIN, cursorY - 6, pageWidth - PAGE_MARGIN, cursorY - 6);

        // Legal
        ensureSpace(BSPACE);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Mentions légales", PAGE_MARGIN, cursorY);
        cursorY += LSPACE + 2;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const legalLines = doc.splitTextToSize(String(legalMention), pageWidth - PAGE_MARGIN * 2) as string[];
        doc.text(legalLines, PAGE_MARGIN, cursorY);

        doc.save(`Facture-${invoiceNumber || "Phobee"}.pdf`);
        toast.success("PDF généré !");
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="flex-grow">
                <div className="pt-24 pb-16 container mx-auto px-4 md:px-8">
                    <header className="max-w-4xl mb-10">
                        <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <Sparkles className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
                                Générateur de facture "Zéro Stress"
                            </span>
                        </div>
                        <h1 className="mt-4 text-4xl font-bold text-slate-900 leading-tight">
                            Crée ta facture légale en quelques clics
                        </h1>
                        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
                            Formulaire guidé, contrôles anti-erreurs, et export PDF prêt à envoyer.
                            Reste focus sur ton client, on sécurise le cadre légal.
                        </p>
                    </header>

                    {formError && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {formError}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Identities */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-3 w-full max-w-sm">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-secondary">Identité visuelle</h2>
                                        {logoData && (
                                            <button
                                                type="button"
                                                onClick={() => handleLogoUpload(null)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Supprimer le logo
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Logo (PNG/JPEG)</label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg"
                                                onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
                                                className="w-full text-sm"
                                            />
                                            {logoData && (
                                                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 inline-flex items-center gap-2 w-fit">
                                                    <img src={logoData} alt="Logo" className="h-12 w-auto object-contain rounded border border-slate-200 bg-white" />
                                                    <span className="text-xs text-slate-600">Prévisualisation (PDF)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-secondary">Identité du client</h2>
                                        <span className="text-xs text-slate-500">Obligatoire</span>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">Nom du client / entreprise</label>
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="Ex : Studio Horizon"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-slate-700">Adresse du client</label>
                                            <Info className="w-4 h-4 text-slate-400" /* title removed for TS error */ />
                                        </div>
                                        <textarea
                                            value={clientAddress}
                                            onChange={(e) => setClientAddress(e.target.value)}
                                            placeholder="Numéro, rue, CP, ville..."
                                            rows={4}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                            required
                                        />
                                        <p className="text-xs text-slate-500">La génération du PDF sera bloquée si ce champ est vide.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-secondary">Identité de l'émetteur</h2>
                                    <span className="text-xs text-slate-500">Freelance</span>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700">Nom &amp; prénom</label>
                                    <input
                                        type="text"
                                        value={issuerName}
                                        onChange={(e) => setIssuerName(e.target.value)}
                                        placeholder="Ex : Léa Dupont"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700">Adresse complète</label>
                                    <textarea
                                        value={issuerAddress}
                                        onChange={(e) => setIssuerAddress(e.target.value)}
                                        placeholder="Numéro, rue, CP, ville..."
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            value={issuerEmail}
                                            onChange={(e) => setIssuerEmail(e.target.value)}
                                            placeholder="freelance@email.com"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={issuerPhone}
                                            onChange={(e) => setIssuerPhone(e.target.value)}
                                            placeholder="+33 6 12 34 56 78"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700">Numéro SIRET</label>
                                        <label className="flex items-center gap-2 text-xs text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={isSiretPending}
                                                onChange={(e) => toggleSiretPending(e.target.checked)}
                                                className="rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            Je suis en cours d'immatriculation
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={siret}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, "").slice(0, 14);
                                            setSiret(raw);
                                        }}
                                        disabled={isSiretPending}
                                        inputMode="numeric"
                                        maxLength={14}
                                        placeholder="14 chiffres"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:text-slate-500"
                                    />
                                    {isSiretPending && (
                                        <p className="text-xs text-slate-500">
                                            SIRET : En cours d'attribution (sera inscrit automatiquement sur la facture)
                                        </p>
                                    )}
                                </div>

                                {isTvaEnabled && (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-700">Numéro de TVA intracommunautaire</label>
                                        <input
                                            type="text"
                                            value={tvaNumber}
                                            onChange={(e) => setTvaNumber(e.target.value)}
                                            placeholder="FRXX999999999"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Metadata */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <h2 className="text-lg font-semibold text-secondary">Paramètres de la facture</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Info className="w-4 h-4 text-slate-400" />
                                    Conseils express pour éviter les erreurs légales.
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        Numéro de facture
                                        <Info
                                            className="w-4 h-4 text-slate-400"
                                            /* title removed for TS error */
                                        />
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        placeholder="Ex: 2025-001"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        Date d'émission
                                        <CalendarDays className="w-4 h-4 text-slate-400" />
                                    </label>
                                    <input
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        Date d'échéance
                                        <Info
                                            className="w-4 h-4 text-slate-400"
                                            /* title removed for TS error */
                                        />
                                    </label>
                                    <select
                                        value={dueOption}
                                        onChange={(e) => setDueOption(e.target.value as "reception" | "30j")}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="reception">Paiement à réception ({formatDate(issueDate)})</option>
                                        <option value="30j">30 jours ({formatDate(dueDate)})</option>
                                    </select>
                                    <p className="text-xs text-slate-500">Échéance calculée automatiquement.</p>
                                </div>
                            </div>
                        </section>

                        {/* Lines */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-secondary mt-4">Prestations</h2>
                                    <p className="text-sm text-slate-500">Ajoute, modifie ou supprime des lignes librement.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddLine}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-secondary font-semibold shadow-sm hover:shadow-md transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter une ligne
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="min-w-[760px] space-y-3">
                                    <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-500">
                                        <div className="col-span-5">Description</div>
                                        <div className="col-span-2">Quantité</div>
                                        <div className="col-span-2">Prix unitaire</div>
                                        {isTvaEnabled && <div className="col-span-1">TVA</div>}
                                        <div className="col-span-2 text-right">Total</div>
                                    </div>

                                    {lines.map((line, index) => {
                                        const lineTotal = (line.quantity || 0) * (line.unitPrice || 0);
                                        const lineTVA = isTvaEnabled ? lineTotal * (line.tvaRate || 0) / 100 : 0;
                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-12 gap-3 items-start bg-slate-50/80 border border-slate-100 rounded-xl p-3"
                                            >
                                                <div className="col-span-5">
                                                    <textarea
                                                        value={line.description}
                                                        onChange={(e) => handleLineChange(index, "description", e.target.value)}
                                                        placeholder="Description détaillée"
                                                        rows={3}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                                    />
                                                    <p className="text-[11px] text-slate-500 mt-1">
                                                        Sois précis. &quot;Création logo + 3 corrections&quot; protège mieux que &quot;Logo&quot;.
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={line.quantity}
                                                        onChange={(e) => handleLineChange(index, "quantity", Number(e.target.value))}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        value={line.unitPrice}
                                                        onChange={(e) => handleLineChange(index, "unitPrice", Number(e.target.value))}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                                {isTvaEnabled && (
                                                    <div className="col-span-1">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            step="0.1"
                                                            value={line.tvaRate}
                                                            onChange={(e) => handleLineChange(index, "tvaRate", Number(e.target.value))}
                                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                )}
                                                <div className="col-span-2 flex items-center justify-between gap-2">
                                                    <div className="text-right">
                                                        <div className="font-semibold text-secondary">{formatCurrency(lineTotal + lineTVA)}</div>
                                                        {isTvaEnabled && (
                                                            <p className="text-[11px] text-slate-500">
                                                                HT {formatCurrency(lineTotal)} · TVA {formatCurrency(lineTVA)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveLine(index)}
                                                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        aria-label="Supprimer la ligne"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* TVA & Totals */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-secondary">TVA &amp; Totaux</h2>
                                        <p className="text-sm text-slate-500">Active la TVA si tu es assujetti.</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-700 border border-slate-200">
                                        <Info className="w-4 h-4 text-secondary" />
                                        <span>{isTvaEnabled ? "Assujetti : TVA 20% appliquée" : "Franchise : TVA non applicable"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsTvaEnabled((v) => !v)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isTvaEnabled
                                            ? "bg-secondary text-white border-secondary"
                                            : "bg-white text-secondary border-slate-200"
                                            }`}
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        {isTvaEnabled ? "TVA activée" : "TVA non facturée"}
                                    </button>
                                    <span className="text-[11px] text-slate-500 sm:hidden">
                                        {isTvaEnabled ? "Assujetti : TVA 20% appliquée" : "Franchise : TVA non applicable"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-sm text-slate-500">Total HT</p>
                                    <p className="text-2xl font-bold text-secondary mt-1">{formatCurrency(totals.totalHT)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-sm text-slate-500">Montant TVA</p>
                                    <p className="text-2xl font-bold text-secondary mt-1">
                                        {isTvaEnabled ? formatCurrency(totals.totalTVA) : "0,00 €"}
                                    </p>
                                    {!isTvaEnabled && (
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            TVA non applicable, art. 293 B du CGI
                                        </p>
                                    )}
                                </div>
                                <div className="p-4 rounded-xl bg-[#0F172A] text-white border border-secondary">
                                    <p className="text-sm text-white/80">Total TTC</p>
                                    <p className="text-2xl font-bold mt-1">{formatCurrency(totals.totalTTC)}</p>
                                </div>
                            </div>
                        </section>

                        {/* Legal */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-secondary">Mentions &amp; RIB</h2>
                                <Info className="w-4 h-4 text-slate-400" /* title removed for TS error */ />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Coordonnées bancaires (RIB)</label>
                                    <textarea
                                        value={bankDetails}
                                        onChange={(e) => setBankDetails(e.target.value)}
                                        placeholder="IBAN : FR76 ... / BIC : ..."
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Mentions légales de retard</label>
                                    <textarea
                                        value={legalMention}
                                        onChange={(e) => setLegalMention(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="text-sm">
                                    Contrôle anti-erreur : adresse client obligatoire, SIRET automatique si en cours d'immatriculation, TVA gérée.
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={openSecurityModal}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-secondary font-semibold shadow-lg shadow-yellow-200/60 hover:shadow-xl transition-transform active:scale-[0.99]"
                            >
                                <Download className="w-4 h-4" />
                                TÉLÉCHARGER MA FACTURE (PDF)
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-secondary flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-secondary">👮‍♂️ Contrôle de Sécurité PhoBee</h3>
                                <p className="text-sm text-slate-600 mt-1">Coche les trois points avant d'exporter.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={checklist.clientAddress}
                                    onChange={(e) => setChecklist((prev) => ({ ...prev, clientAddress: e.target.checked }))}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                L'adresse du client est correcte ?
                            </label>
                            <label className="flex items-center gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={checklist.rib}
                                    onChange={(e) => setChecklist((prev) => ({ ...prev, rib: e.target.checked }))}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                Mon RIB est bien renseigné ?
                            </label>
                            <label className="flex items-center gap-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={checklist.amounts}
                                    onChange={(e) => setChecklist((prev) => ({ ...prev, amounts: e.target.checked }))}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                J'ai relu les montants ?
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleGeneratePdf}
                                className="px-5 py-2 rounded-full bg-secondary text-white font-semibold hover:bg-slate-800 transition"
                            >
                                C'est tout bon, je valide !
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

