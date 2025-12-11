import ContactContent from "@/components/contact/ContactContent";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
    return(
        <main className="min-h-screen bg-white">
            <Navbar />
            <ContactContent />
            <Footer />
        </main>
    )
}
