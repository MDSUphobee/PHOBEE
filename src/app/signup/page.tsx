import Navbar from "@/components/landing/Navbar";
import Signup from "@/components/auth/Signup";
import Footer from "@/components/landing/Footer";

export default function Page() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Signup/>
            <Footer />
        </main>
    );
}
