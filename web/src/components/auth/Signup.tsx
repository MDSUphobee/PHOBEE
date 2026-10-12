"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveUserQuestionnaireInfo } from "@/lib/user";
import Highlight from "@/components/ui/highlight";



export default function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nom: "",
        prenom: "",
        phone: "",
    });
    const [cgu, setCgu] = useState(false);

    // Récupérer les paramètres de redirection depuis l'URL
    const redirectPath = searchParams.get("redirect");
    const answersParam = searchParams.get("answers");



    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        return !!(formData.email && formData.password && formData.nom && formData.prenom && formData.phone && cgu);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) {
            setError("Tous les champs sont requis et les conditions d'utilisation doivent être acceptées.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    // l'API attend un seul champ "name"
                    name: `${formData.prenom} ${formData.nom}`.trim(),
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data?.message || "Échec de l'inscription.";
                setError(msg);
                toast.error(msg);
                setLoading(false);
                return;
            }

            // succès : tentative de connexion automatique avec les éléments du register
            try {
                const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                if (loginRes.ok) {
                    const loginData = await loginRes.json();

                    if (loginData?.token) {
                        localStorage.setItem("token", loginData.token);
                    }

                    let user = loginData?.user;
                    if (!user && loginData?.token) {
                        try {
                            const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user?email=${encodeURIComponent(formData.email)}`, {
                                method: "GET",
                                headers: {
                                    "Accept": "application/json",
                                    "Authorization": `Bearer ${loginData.token}`,
                                },
                            });

                            if (userRes.ok) {
                                const userData = await userRes.json();
                                user = Array.isArray(userData)
                                    ? userData[0]
                                    : (Array.isArray((userData as any)?.data) ? (userData as any).data[0] : userData);
                            }
                        } catch {
                            // best-effort
                        }
                    }

                    if (user) {
                        localStorage.setItem("user", JSON.stringify(user));

                        // Sauvegarder les réponses si présentes
                        if (answersParam && loginData.token) {
                            try {
                                const answers = JSON.parse(decodeURIComponent(answersParam));
                                await saveUserQuestionnaireInfo(user.id, loginData.token, answers);
                            } catch (e) {
                                console.error("Erreur sauvegarde réponses post-signup:", e);
                            }
                        }
                    }

                    toast.success("Compte créé et connexion réussie !");

                    // Si on vient du questionnaire, rediriger vers les résultats
                    if (redirectPath === "resultats" && answersParam) {
                        router.push(`/resultats?answers=${answersParam}`);
                    } else {
                        router.push("/profile");
                    }
                } else {
                    // Fallback si l'auto-login échoue
                    toast.success("Compte créé avec succès ! Connectez-vous.");
                    // Conserver les paramètres pour la redirection après login
                    if (redirectPath && answersParam) {
                        router.push(`/login?redirect=${redirectPath}&answers=${encodeURIComponent(answersParam)}`);
                    } else {
                        router.push("/login");
                    }
                }
            } catch (e) {
                // En cas d'erreur réseau sur le login, on redirige quand même vers le login car le compte est créé
                toast.success("Compte créé avec succès ! Connectez-vous.");
                // Conserver les paramètres pour la redirection après login
                if (redirectPath && answersParam) {
                    router.push(`/login?redirect=${redirectPath}&answers=${encodeURIComponent(answersParam)}`);
                } else {
                    router.push("/login");
                }
            }
        } catch (err) {
            setError("Erreur réseau.");
            toast.error("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    const champ = "h-[53px] w-full rounded-full border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-7 text-base text-[#14233c] dark:text-white placeholder:text-[#94a3b8] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary";

    return (
        <section className="mx-auto w-full max-w-[1290px] px-4 md:px-6 py-12 md:py-16 text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
            <h2 className="text-[28px] md:text-4xl leading-[42px]">Créer mon compte</h2>
            <p className="text-xl md:text-2xl leading-[42px]">
                En <Highlight variant="marker" color="blue">1 minutes,</Highlight> seulement !
            </p>

            {error && (
                <div role="alert" className="mt-6 max-w-[760px] rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 max-w-[760px]" noValidate>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <input name="nom" aria-label="Votre nom" placeholder="Votre Nom" autoComplete="family-name" value={formData.nom} onChange={handleChange} className={champ} required />
                    <input name="prenom" aria-label="Votre prénom" placeholder="Votre Prénom" autoComplete="given-name" value={formData.prenom} onChange={handleChange} className={champ} required />
                    <input name="phone" type="tel" aria-label="Téléphone" placeholder="Téléphone" autoComplete="tel" value={formData.phone} onChange={handleChange} className={champ} required />
                    <input name="email" type="email" aria-label="Adresse email" placeholder="Adresse Email" autoComplete="email" value={formData.email} onChange={handleChange} className={champ} required />
                    <input name="password" type="password" aria-label="Mot de passe" placeholder="Mot de passe (8 caractères minimum)" autoComplete="new-password" value={formData.password} onChange={handleChange} className={`${champ} sm:col-span-2`} required />
                </div>

                <label className="mt-8 flex items-center gap-4 text-sm cursor-pointer">
                    <input type="checkbox" checked={cgu} onChange={(e) => setCgu(e.target.checked)} className="size-6 rounded-[5px] border border-[#94a3b8] accent-[#0f172a]" />
                    <Link href="/mentions-legales" target="_blank" className="underline underline-offset-4">J'accepte les conditions d'utilisation*</Link>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-8 inline-flex h-[53px] items-center justify-center rounded-full bg-[#0f172a] px-12 text-xl font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary dark:text-[#0f172a]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Création du compte...
                        </>
                    ) : (
                        "Créer mon compte"
                    )}
                </button>

                <p className="mt-6 text-sm">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="font-semibold underline underline-offset-4">Se connecter</Link>
                </p>
            </form>
        </section>
    );
}
