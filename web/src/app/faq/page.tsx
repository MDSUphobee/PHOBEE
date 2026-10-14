// file: `web/src/app/faq/page.tsx`
import React from "react";
import Navbar from "@/components/landing/Navbar";
import FAQ from "@/components/landing/FAQ";
import UnderNavbar from "@/components/ui/under_navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/landing/Footer";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#f7f6fe] dark:bg-background">
            <Navbar />
            <UnderNavbar
                imageSrc="/images/faq-hero.png"
                title="FAQ"
                subtitle="Tout comprendre simplement"
                dimensions={{ width: "1439px", height: "350px" }}
                highlightText={["simplement"]}
                showSearch={true}
            />
            <div className="container mx-auto px-4 pt-8 md:px-6">
                <Breadcrumb items={[{ label: "FAQ" }]} />
            </div>
            <FAQ />
            <Footer />
        </div>
    );
}
