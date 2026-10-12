import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Signup from "@/components/auth/Signup";
import Footer from "@/components/landing/Footer";
import UnderNavbar from "@/components/ui/under_navbar";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inscription | Phobee",
    description: "Créez votre compte Phobee et gérez vos démarches administratives.",
};

function SignupContent() {
    return (
        <>
            <Navbar />
            <UnderNavbar
                imageSrc="/images/inscription/hero.png"
                title="Créez votre compte"
                subtitle="en quelques minutes"
                dimensions={{ width: "1439px", height: "392px" }}
                highlightText={["quelques minutes"]}
                titleSize="clamp(32px, 7vw, 64px)"
                subtitleSize="clamp(32px, 7vw, 64px)"
                highlightAngle={-1}
            />
            <main className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background">
                <div className="dark:hidden pointer-events-none absolute -bottom-1/4 -right-1/4 h-3/4 w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(234,179,8,0.72),rgba(247,246,254,0))]" />
                <div className="relative md:[zoom:0.8]">
                    <Signup />
                    <section className="flex flex-col items-center px-4 pb-24 pt-12 text-center font-['Poppins',sans-serif] text-[#14233c] dark:text-white">
                        <h2 className="text-[28px] leading-[52px] md:text-[40px]">Vous avez des questions ?</h2>
                        <Link href="/faq" className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-primary px-10 text-lg font-medium text-[#0f1729] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                            Consulter la FAQ
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </>
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
