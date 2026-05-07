import React from "react";
import Navbar from "@/components/landing/Navbar";
import FAQ from "@/components/landing/FAQ";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-[#EEF2FF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            <Navbar />
            <div className="pt-24">
                <FAQ />
            </div>
        </div>
    );
}
