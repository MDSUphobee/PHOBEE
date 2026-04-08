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
