"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { toast } from "sonner";
import { Calculator, Calendar, CreditCard, CheckCircle2, Loader2, Save } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function CalculateurPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [mode, setMode] = useState<"create" | "update">("create");

    // Form fields
    const [startDate, setStartDate] = useState("");
    const [paymentFrequency, setPaymentFrequency] = useState("monthly");
    const [hasAcre, setHasAcre] = useState(false); // Used a checkbox

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStorage = localStorage.getItem("user");
        if (!token || !userStorage) {
            router.push("/login");
            return;
        }

        let id: number | null = null;
        try {
            const userData = JSON.parse(userStorage);
            id = Number(userData?.id);
        } catch {
            id = null;
        }

        if (!id || Number.isNaN(id)) {
            localStorage.clear();
            router.push("/login");
            return;
        }

        setUserId(id);

        // Fetch existing info
        fetch(`${API_BASE}/user-info/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setMode("update");
                    if (data.start_date) setStartDate(data.start_date.split('T')[0]);
                    if (data.payment_frequency) setPaymentFrequency(data.payment_frequency);
                    if (data.has_acre !== undefined) setHasAcre(!!data.has_acre);
                } else if (res.status === 404) {
                    setMode("create");
                } else if (res.status === 401) {
                    localStorage.clear();
                    router.push("/login");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Erreur lors du chargement des données.");
            })
            .finally(() => setLoading(false));

    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setSubmitting(true);
        try {
            const url = mode === "create" ? `${API_BASE}/user-info` : `${API_BASE}/user-info/${userId}`;
            const method = mode === "create" ? "POST" : "PUT";

            const body = {
                user_id: userId,
                start_date: startDate,
                payment_frequency: paymentFrequency,
                has_acre: hasAcre ? 1 : 0,
                // Note: Checkbox boolean vs 1/0. 
                // GET returns 1/0 or boolean? user-info table likely TinyInt. 
                // JSON res might be number. 
                // I'll send 1/0 or boolean, the backend PUT accepts generic value and binds it. 
                // Backend POST uses `has_acre ? 1 : 0` in arguments, so it expects boolean-ish?
                // Actually, backend POST extracts `has_acre` from body.
                // My backend POST: `has_acre ? 1 : 0` implies `has_acre` in body is truthy/falsy.
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                toast.error(data.message || "Une erreur est survenue.");
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            toast.success(mode === "create" ? "Informations enregistrées !" : "Mise à jour réussie !");

            // Redirect to profile
            router.push('/profile');

            // If created, switch mode to update for next time without reload
            if (mode === "create") {
                setMode("update");
            }
        } catch (err) {
            console.error(err);
            toast.error("Erreur réseau.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans mt-16 text-slate-900 dark:text-slate-100">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFCC00] text-slate-900 mb-6 shadow-lg shadow-yellow-500/20">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Calculateur de Cotisations</h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-lg mx-auto">
                            Renseignez vos informations pour estimer vos cotisations sociales avec précision.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Start Date */}
                                <div className="space-y-3">
                                    <label className="flex items-center text-base font-semibold text-slate-800 dark:text-slate-100" htmlFor="start_date">
                                        <Calendar className="w-5 h-5 mr-2 text-[#FFCC00]" />
                                        Date de début d'activité
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#FFCC00] focus:ring-4 focus:ring-[#FFCC00]/10 bg-slate-50 dark:bg-slate-900 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        required
                                    />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">La date à laquelle vous avez commencé votre exploitation.</p>
                                </div>

                                {/* Payment Frequency */}
                                <div className="space-y-3">
                                    <label className="flex items-center text-base font-semibold text-slate-800 dark:text-slate-100" htmlFor="payment_frequency">
                                        <CreditCard className="w-5 h-5 mr-2 text-[#FFCC00]" />
                                        Fréquence de paiement
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentFrequency("monthly")}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center ${paymentFrequency === "monthly"
                                                ? "border-[#FFCC00] bg-[#FFCC00]/10 dark:bg-[#FFCC00]/20 text-slate-900"
                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500"
                                                }`}
                                        >
                                            Mensuel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentFrequency("quarterly")}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center ${paymentFrequency === "quarterly"
                                                ? "border-[#FFCC00] bg-[#FFCC00]/10 dark:bg-[#FFCC00]/20 text-slate-900"
                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500"
                                                }`}
                                        >
                                            Trimestriel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentFrequency("annually")}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center ${paymentFrequency === "annually"
                                                ? "border-[#FFCC00] bg-[#FFCC00]/10 dark:bg-[#FFCC00]/20 text-slate-900"
                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500"
                                                }`}
                                        >
                                            Annuel
                                        </button>
                                    </div>
                                    <input type="hidden" name="payment_frequency" value={paymentFrequency} />
                                </div>

                                {/* ACRE Checkbox */}
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:border-slate-200 dark:hover:border-slate-600 transition-colors" onClick={() => setHasAcre(!hasAcre)}>
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${hasAcre ? "bg-[#FFCC00] border-[#FFCC00]" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950"}`}>
                                        {hasAcre && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100 block">Bénéficiaire de l'ACRE</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Cochez cette case si vous bénéficiez de l'aide à la création ou à la reprise d'une entreprise.</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 px-6 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Enregistrer les informations
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
