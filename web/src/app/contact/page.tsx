import ContactContent from "@/components/contact/ContactContent";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
    return(
        <main id="contenu" className="min-h-screen bg-background text-foreground">
            <Navbar />
            <ContactContent />
            <Footer />
        </main>
    )
}
