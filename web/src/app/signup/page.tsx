import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Signup from "@/components/auth/Signup";
import Footer from "@/components/landing/Footer";

function SignupContent() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Signup />
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </main>
        }>
            <SignupContent />
        </Suspense>
    );
}
