import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-bold mb-6">Page non trouvée</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Link 
                    href="/"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                    Retour à l'accueil
                </Link>
            </div>
            <Footer />
        </main>
    );
}
