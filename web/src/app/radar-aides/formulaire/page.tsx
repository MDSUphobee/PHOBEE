"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Loader2, Download, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import Cerfa11423Form from "@/components/forms/Cerfa11423Form";


// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CerfaField {
    name: string;
    /** "/Tx" for text inputs, "/Btn" for radio/checkbox */
    type: string;
    value: string | null;
    /** Only present on /Btn fields */
    on_values?: string[];
}

/** Fields sharing the same on_value (e.g. ["/Oui", "/Non"]) form a radio group */
interface RadioGroup {
    kind: "radio";
    /** Common on_value that identifies this group (e.g. "/Oui") */
    groupId: string;
    fields: CerfaField[];
}

interface SingleField {
    kind: "text" | "checkbox";
    field: CerfaField;
}

type FormItem = RadioGroup | SingleField;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Group /Btn fields that share the same set of on_values into radio groups */
function buildFormItems(fields: CerfaField[]): FormItem[] {
    const items: FormItem[] = [];
    // Track which field names we've already handled
    const handled = new Set<string>();

    for (const field of fields) {
        if (handled.has(field.name)) continue;

        if (field.type === "/Tx") {
            items.push({ kind: "text", field });
            handled.add(field.name);
            continue;
        }

        if (field.type === "/Btn") {
            const onVals = field.on_values ?? [];

            // If a /Btn field has exactly one on_value: it's a standalone checkbox
            if (onVals.length <= 1) {
                items.push({ kind: "checkbox", field });
                handled.add(field.name);
                continue;
            }

            // Look for sibling fields that share the SAME on_values pattern
            // (same sorted on_values array) — they form a radio group
            const onKey = [...onVals].sort().join("|");
            const siblings = fields.filter(
                (f) =>
                    f.type === "/Btn" &&
                    !handled.has(f.name) &&
                    [...(f.on_values ?? [])].sort().join("|") === onKey
            );

            if (siblings.length > 1) {
                items.push({ kind: "radio", groupId: onKey, fields: siblings });
                siblings.forEach((s) => handled.add(s.name));
            } else {
                // Unique on_values pattern — treat as standalone boolean radio (oui/non)
                items.push({ kind: "radio", groupId: field.name, fields: [field] });
                handled.add(field.name);
            }
        }
    }

    return items;
}

/** Build the {field_name: value} mapping expected by the Laravel fill endpoint */
function buildMapping(formData: Record<string, string>, fields: CerfaField[]): Record<string, string> {
    const mapping: Record<string, string> = {};

    for (const field of fields) {
        const raw = formData[field.name];
        if (raw === undefined || raw === "") continue;

        if (field.type === "/Btn") {
            // Value should already be a slash-prefixed name (e.g. "/Yes", "/Oui")
            // If the user left it blank, omit it
            mapping[field.name] = raw.startsWith("/") ? raw : `/${raw}`;
        } else {
            mapping[field.name] = raw;
        }
    }

    return mapping;
}

/** Make a human-readable label from an AcroForm field name */
function fieldLabel(name: string): string {
    return name
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function TextInput({
    field,
    value,
    onChange,
}: {
    field: CerfaField;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label
                htmlFor={`field-${field.name}`}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
                {fieldLabel(field.name)}
            </label>
            <input
                id={`field-${field.name}`}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={field.value ?? ""}
                className="w-full px-4 py-3 rounded-xl border border-border bg-slate-100 dark:bg-slate-800/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
        </div>
    );
}

function CheckboxInput({
    field,
    value,
    onChange,
}: {
    field: CerfaField;
    value: string;
    onChange: (v: string) => void;
}) {
    const onVal  = field.on_values?.[0] ?? "/Yes";
    const checked = value === onVal;

    return (
        <div className="flex items-center space-x-3">
            <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                id={`field-${field.name}`}
                onClick={() => onChange(checked ? "/Off" : onVal)}
                className={`w-5 h-5 flex-shrink-0 rounded border-2 transition-all flex items-center justify-center ${
                    checked
                        ? "bg-primary border-primary"
                        : "border-border bg-card hover:border-primary"
                }`}
            >
                {checked && (
                    <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>
            <label htmlFor={`field-${field.name}`} className="text-sm font-medium text-foreground cursor-pointer select-none">
                {fieldLabel(field.name)}
            </label>
        </div>
    );
}

function RadioGroupInput({
    group,
    formData,
    onChange,
}: {
    group: RadioGroup;
    formData: Record<string, string>;
    onChange: (name: string, v: string) => void;
}) {
    // For single-field groups: the field itself has multiple on_values → user picks one
    if (group.fields.length === 1) {
        const field  = group.fields[0];
        const onVals = field.on_values ?? [];

        return (
            <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {fieldLabel(field.name)}
                </label>
                <div className="flex flex-wrap gap-2">
                    {onVals.map((val) => {
                        const selected = formData[field.name] === val;
                        const label    = val.replace(/^\//, "");
                        return (
                            <button
                                key={val}
                                type="button"
                                onClick={() => onChange(field.name, selected ? "" : val)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                    selected
                                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                        : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Multi-field group: each field represents one radio option
    // (e.g. field "SEXE_M" and "SEXE_F" with shared on_value "/X")
    const onVal = group.fields[0].on_values?.[0] ?? "/Yes";

    return (
        <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {/* Derive a group label from field name prefix */}
                {fieldLabel(group.fields[0].name.replace(/_[^_]+$/, ""))}
            </label>
            <div className="flex flex-wrap gap-2">
                {group.fields.map((field) => {
                    const selected = formData[field.name] === onVal;
                    const label    = field.name.split("_").pop() ?? field.name;
                    return (
                        <button
                            key={field.name}
                            type="button"
                            onClick={() => {
                                // Deselect all siblings, select this one
                                group.fields.forEach((f) => onChange(f.name, "/Off"));
                                onChange(field.name, selected ? "/Off" : onVal);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                selected
                                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                    : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                            }`}
                        >
                            {fieldLabel(label)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading overlay (shown while Python processes the PDF)
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
    "Analyse du formulaire Cerfa…",
    "Construction du mapping de champs…",
    "Traitement Python en cours…",
    "Injection des valeurs dans le PDF…",
    "Finalisation du document…",
];

function PdfProcessingOverlay() {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Advance steps every ~1.2 s
        const stepTimer = setInterval(() => {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
        }, 1200);

        // Smooth progress bar — fills to ~90% in ~6 s, leaves room for real completion
        const progressTimer = setInterval(() => {
            setProgress((p) => {
                if (p >= 90) return p;
                return p + (90 - p) * 0.06;
            });
        }, 100);

        return () => {
            clearInterval(stepTimer);
            clearInterval(progressTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-md mx-4 bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
                {/* Animated primary top bar */}
                <div className="h-1.5 bg-muted w-full">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-10 flex flex-col items-center text-center">
                    {/* Spinning document icon */}
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-primary" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-foreground mb-3">
                        Génération du PDF
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        Le script Python traite votre document Cerfa.<br />
                        Cela peut prendre quelques secondes.
                    </p>

                    {/* Step list */}
                    <ol className="w-full space-y-2 text-left mb-6">
                        {STEPS.map((s, i) => (
                            <li
                                key={i}
                                className={`flex items-center gap-3 text-sm transition-all ${
                                    i < step
                                        ? "text-green-500"
                                        : i === step
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground/30"
                                }`}
                            >
                                {i < step ? (
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                ) : i === step ? (
                                    <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                                ) : (
                                    <span className="w-4 h-4 flex-shrink-0 rounded-full border border-border inline-block" />
                                )}
                                {s}
                            </li>
                        ))}
                    </ol>

                    <p className="text-[11px] text-muted-foreground/50">Ne fermez pas cette fenêtre.</p>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success screen
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({
    cerfa_name,
    onReset,
    onBack,
}: {
    cerfa_name: string;
    onReset: () => void;
    onBack: () => void;
}) {
    return (
        <div className="flex-1 pt-32 pb-24 container mx-auto px-4 max-w-lg text-center" suppressHydrationWarning>
            <div className="bg-card rounded-3xl shadow-sm border border-border p-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-500/5">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-3">
                    Votre PDF est prêt&nbsp;!
                </h2>
                <p className="text-muted-foreground mb-8 text-sm">
                    Le document <span className="font-semibold text-foreground/80">{cerfa_name}</span> a
                    été rempli et téléchargé automatiquement dans votre dossier de téléchargements.
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                        <Download className="w-5 h-5" />
                        Remplir à nouveau
                    </button>
                    <button
                        onClick={onBack}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la liste des aides
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main form content (reads ?name= from query)
// ─────────────────────────────────────────────────────────────────────────────

function CerfaFormContent() {
    const searchParams = useSearchParams();
    const router       = useRouter();
    const cerfa_name   = searchParams.get("name") ?? "";

    const [fields,    setFields]    = useState<CerfaField[]>([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState("");
    const [formData,  setFormData]  = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success,   setSuccess]   = useState(false);

    // ── Fetch fields from API ─────────────────────────────────────────────────
    useEffect(() => {
        if (!cerfa_name || cerfa_name === "undefined") {
            setError("Aucun nom de formulaire Cerfa spécifié dans l'URL.");
            setLoading(false);
            return;
        }

        async function fetchFields() {
            try {
                const cleanName = cerfa_name.trim();
                const res = await fetch(
                    `/api/pdfs/get-fields/${encodeURIComponent(cleanName)}`
                );
                
                if (res.status === 404) {
                    throw new Error("Ce formulaire Cerfa n'est pas encore disponible ou le nom est incorrect");
                }

                const json = await res.json();

                if (!res.ok || !json.success) {
                    throw new Error(json.message ?? json.error ?? `Erreur HTTP ${res.status}`);
                }

                const data: CerfaField[] = Array.isArray(json.data) ? json.data : [];
                if (data.length === 0) {
                    throw new Error("Aucun champ AcroForm trouvé dans ce document.");
                }

                setFields(data);

                // Pre-populate form with current values (if any)
                const initial: Record<string, string> = {};
                data.forEach((f) => {
                    if (f.value && f.value !== "None") initial[f.name] = f.value;
                });
                setFormData(initial);
            } catch (err: any) {
                setError(err.message ?? "Erreur lors du chargement des champs.");
            } finally {
                setLoading(false);
            }
        }

        fetchFields();
    }, [cerfa_name]);

    // ── Input handler ─────────────────────────────────────────────────────────
    const handleChange = useCallback((name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    // ── Form submit ───────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const mapping = buildMapping(formData, fields);

            const res = await fetch("/api/pdfs/fill", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ pdf: cerfa_name, mapping, flatten: false }),
            });

            if (!res.ok) {
                // Try to parse error JSON; otherwise use status text
                let msg = `Erreur ${res.status}`;
                try {
                    const errJson = await res.json();
                    msg = errJson.message ?? msg;
                } catch {}
                throw new Error(msg);
            }

            // ── Download the PDF binary blob ──────────────────────────────────
            const blob    = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const anchor  = document.createElement("a");
            anchor.href     = blobUrl;
            anchor.download  = `${cerfa_name}.pdf`;
            anchor.click();

            // Clean up
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);

            setSuccess(true);
        } catch (err: any) {
            setError(err.message ?? "Erreur lors de la génération du PDF.");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Pre-defined forms (Statics) ──────────────────────────────────────────
    const isCerfa11423 = cerfa_name === "cerfa_11423" || 
                         cerfa_name.includes("11423") || 
                         cerfa_name.toLowerCase().includes("déclaration de situation pour les prestations familiales");

    if (isCerfa11423) {
        return (
            <div className="flex-1 pt-32 pb-24 container mx-auto px-4 md:px-6 max-w-5xl" suppressHydrationWarning>
                 <button
                    onClick={() => router.back()}
                    className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium text-sm gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste des documents
                </button>
                <Cerfa11423Form />
            </div>
        );
    }

    // ── Guard states ──────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24" suppressHydrationWarning>
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-foreground text-sm">Chargement des champs du formulaire…</p>
            </div>
        );
    }

    if (error && fields.length === 0) {
        return (
            <div className="flex-1 pt-32 pb-24 container mx-auto px-4 max-w-2xl text-center" suppressHydrationWarning>
                <div className="bg-destructive/10 text-destructive p-8 rounded-2xl border border-destructive/20 flex flex-col items-center gap-4">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 bg-card rounded-xl shadow-sm font-medium hover:bg-muted border border-border text-foreground text-sm transition-colors"
                    >
                        ← Retour
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <SuccessScreen
                cerfa_name={cerfa_name}
                onReset={() => { setSuccess(false); setError(""); }}
                onBack={() => router.push("/radar-aides")}
            />
        );
    }

    // ── Build form structure ──────────────────────────────────────────────────
    const formItems = buildFormItems(fields);

    // Separate text fields from /Btn items for layout
    const textItems     = formItems.filter((i) => i.kind === "text")     as SingleField[];
    const btnItems      = formItems.filter((i) => i.kind !== "text")     as (RadioGroup | SingleField)[];
    const checkboxItems = btnItems.filter((i) => i.kind === "checkbox")  as SingleField[];
    const radioItems    = btnItems.filter((i) => i.kind === "radio")     as RadioGroup[];

    return (
        <>
            {/* Loading overlay on top of everything while Python runs */}
            {submitting && <PdfProcessingOverlay />}

            <div className="flex-1 pt-32 pb-24 container mx-auto px-4 md:px-6 max-w-5xl" suppressHydrationWarning>
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium text-sm gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste des documents
                </button>

                {/* Header card */}
                <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-10 py-7 flex items-center gap-5">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                                Formulaire Cerfa
                            </p>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {cerfa_name}
                            </h1>
                        </div>
                    </div>

                    <div className="px-10 py-4 bg-primary/5 border-t border-primary/10 flex items-center gap-2 text-xs text-primary/80 font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                        {fields.length} champ{fields.length > 1 ? "s" : ""} détecté{fields.length > 1 ? "s" : ""} dans ce document PDF
                    </div>
                </div>

                {/* Error banner (non-fatal) */}
                {error && (
                    <div className="mb-6 px-5 py-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Text fields ─────────────────────────────────────── */}
                    {textItems.length > 0 && (
                        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 md:p-10">
                            <h2 className="text-lg font-extrabold text-foreground mb-6 border-l-4 border-primary pl-4 py-1">
                                Informations textuelles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {textItems.map((item) => (
                                    <TextInput
                                        key={item.field.name}
                                        field={item.field}
                                        value={formData[item.field.name] ?? ""}
                                        onChange={(v) => handleChange(item.field.name, v)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Radio groups ─────────────────────────────────────── */}
                    {radioItems.length > 0 && (
                        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 md:p-10">
                            <h2 className="text-lg font-extrabold text-foreground mb-6 border-l-4 border-primary pl-4 py-1">
                                Choix &amp; sélections
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {radioItems.map((group, idx) => (
                                    <RadioGroupInput
                                        key={group.groupId + idx}
                                        group={group}
                                        formData={formData}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Checkboxes ────────────────────────────────────────── */}
                    {checkboxItems.length > 0 && (
                        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 md:p-10">
                            <h2 className="text-lg font-extrabold text-foreground mb-6 border-l-4 border-primary pl-4 py-1">
                                Cases à cocher
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {checkboxItems.map((item) => (
                                    <CheckboxInput
                                        key={item.field.name}
                                        field={item.field}
                                        value={formData[item.field.name] ?? "/Off"}
                                        onChange={(v) => handleChange(item.field.name, v)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Submit ────────────────────────────────────────────── */}
                    <div className="flex justify-end pt-2 pb-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-extrabold text-base shadow-lg transition-all ${
                                submitting
                                    ? "bg-primary/50 text-muted-foreground cursor-not-allowed"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl hover:-translate-y-0.5"
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Traitement en cours…
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Générer et télécharger le PDF
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function FormulaireCerfaPage() {
    return (
        <main
            className="min-h-screen bg-background text-foreground flex flex-col"
            suppressHydrationWarning
        >
            <div suppressHydrationWarning>
                <Navbar />
            </div>
            <Suspense
                fallback={
                    <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                        <p className="text-muted-foreground font-medium text-lg">
                            Préparation du formulaire…
                        </p>
                    </div>
                }
            >
                <CerfaFormContent />
            </Suspense>
            <div suppressHydrationWarning>
                <Footer />
            </div>
        </main>
    );
}
