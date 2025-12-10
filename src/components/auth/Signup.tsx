"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Building, MapPin, FileText, Briefcase, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

interface NatureIncome {
    id: number;
    name: string;
}

export default function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        exploiting_name: "",
        name: "",
        exploiting_address: "",
        siret: "",
        nature_income_id: "",
    });

    const [natureIncomes, setNatureIncomes] = useState<NatureIncome[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch nature of incomes
        fetch(`${AUTH_API}/nature-income`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setNatureIncomes(data);
                }
            })
            .catch(err => console.error("Failed to load nature incomes", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!formData.email || !formData.password || !formData.username) return false;
        // if (!formData.exploiting_name || !formData.name || !formData.exploiting_address || !formData.siret || !formData.nature_income_id) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) {
            setError("Tous les champs sont requis.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${AUTH_API}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    // nature_income_id: Number(formData.nature_income_id)
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.message || "Échec de l'inscription.");
                setLoading(false);
                return;
            }

            // succès : redirection vers login
            router.push("/login");
        } catch (err) {
            setError("Erreur réseau.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <div className="w-full max-w-2xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Link>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                <span className="text-slate-900 font-bold text-xl">P</span>
                            </div>
                            <span className="text-2xl font-bold text-slate-900">PhoBee</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h1>
                        <p className="text-slate-500">Commencez à gérer votre exploitation apicole dès aujourd'hui.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Identifiants */}
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Identifiants</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nom d'utilisateur</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="Pseudo"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="email@exemple.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="Minimum 8 caractères"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Informations Personnelles & Exploitation */}
                            {/* <div className="md:col-span-2 mt-2">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Exploitation</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nom complet</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="Prénom Nom"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nom d'exploitation</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="exploiting_name"
                                        value={formData.exploiting_name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="Nom de la structure"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Adresse</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="exploiting_address"
                                        value={formData.exploiting_address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="Adresse complète"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">SIRET</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="siret"
                                        value={formData.siret}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                        placeholder="14 chiffres"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nature des revenus</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select
                                        name="nature_income_id"
                                        value={formData.nature_income_id}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 appearance-none"
                                        required
                                    >
                                        <option value="">Sélectionner</option>
                                        {natureIncomes.map(income => (
                                            <option key={income.id} value={income.id}>
                                                {income.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 py-3 px-4 bg-[#FFCC00] hover:bg-[#E6B800] text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Création du compte...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-[#0F172A] font-semibold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478491527271-f4c0dcd14c5c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCC00]/10 to-transparent"></div>

                <div className="relative z-10 text-center max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Votre exploitation connectée.
                    </h2>
                    <p className="text-slate-300 text-lg">
                        Gérez toute votre activité apicole depuis une seule plateforme. Suivi, analyses et rapports automatisés.
                    </p>
                </div>
            </div>
        </div>
    );
}
