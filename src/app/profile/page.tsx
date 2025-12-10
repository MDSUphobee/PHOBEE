"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

// Helper to decode JWT payload safely
function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = parseJwt(token);
        if (!decoded || !decoded.sub) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
        }

        setUser(decoded);
        setLoading(false);

    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Username:</strong> {user?.username}</p>
                </div>



                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Déconnexion
                </button>
            </div>
            <Footer />
        </main>
    );
}
