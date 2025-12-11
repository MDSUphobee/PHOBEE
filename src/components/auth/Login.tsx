"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!email.trim() || !password) {
            setError("Email et mot de passe requis.");
            return false;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            setError("Email invalide.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await fetch(`${AUTH_API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.message || "Échec de la connexion.");
                toast.error(data?.message || "Échec de la connexion.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            toast.success("Connexion réussie !");
            router.push("/profile");
        } catch (err) {
            setError("Erreur réseau.");
            toast.error("Erreur réseau.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <div className="w-full max-w-md mx-auto">
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
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bon retour !</h1>
                        <p className="text-slate-500">Connectez-vous pour accéder à votre espace.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    placeholder="vous@exemple.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="password">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#FFCC00] hover:bg-[#E6B800] text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Pas encore de compte ?{" "}
                        <Link href="/signup" className="text-[#0F172A] font-semibold hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex flex-1 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587049352851-8d4e8913d179?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCC00]/10 to-transparent"></div>

                <div className="relative z-10 text-center max-w-lg">
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Gérez vos ruches en toute simplicité.
                    </h2>
                    <p className="text-slate-300 text-lg">
                        Rejoignez la communauté PhoBee et optimisez votre production de miel grâce à nos outils intelligents.
                    </p>
                </div>
            </div>
        </div>
    );
}
