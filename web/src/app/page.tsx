"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import SocialProof from "@/components/landing/SocialProof";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Home() {
    const loaderSpeed = 1; // vitesse normale

    const hideAfter = useMemo(() => {
        return Math.round(2000 / loaderSpeed);
    }, [loaderSpeed]);

    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(false), hideAfter);
        return () => clearTimeout(timer);
    }, [hideAfter]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            {showLoader && <LoadingOverlay speed={loaderSpeed} />}
            <Navbar />
            <Hero />
            <SocialProof />
            <ProblemSection />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <Footer />
        </main>
    );
}
