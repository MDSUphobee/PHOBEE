"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import SocialProof from "@/components/landing/SocialProof";
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
        <main className="min-h-screen bg-white">
            {showLoader && <LoadingOverlay speed={loaderSpeed} />}
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <SocialProof />
            <FAQ />
            <Footer />
        </main>
    );
}
