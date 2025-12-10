"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
        // simple email pattern
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
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data?.message || "Échec de la connexion.");
                setLoading(false);
                return;
            }

            // succès : redirection
            router.push("/profile");
        } catch (err) {
            setError("Erreur réseau.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Connexion</h2>

            {error && <div role="alert" className="mb-4 text-sm text-red-600">{error}</div>}

            <label className="block mb-3">
                <span className="text-sm">Email</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    placeholder="vous@exemple.com"
                    required
                />
            </label>

            <label className="block mb-4">
                <span className="text-sm">Mot de passe</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    placeholder="••••••••"
                    required
                />
            </label>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
            >
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>
    );
}
