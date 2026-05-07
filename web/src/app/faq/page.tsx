// file: `web/src/app/faq/page.tsx`
import React from "react";
import Navbar from "@/components/landing/Navbar";
import FAQ from "@/components/landing/FAQ";
import UnderNavbar from "@/components/ui/under_navbar";
import Footer from "@/components/landing/Footer";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-[#EEF2FF] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            <Navbar />
            <UnderNavbar
                imageSrc="/images/faq-hero.png"
                title="FAQ"
                subtitle="Tout comprendre simplement"
                dimensions={{ width: "1439px", height: "350px" }}
                highlightText={["simplement"]}
                showSearch={true}
            />
            <FAQ />
            <Footer />
        </div>
    );
}
