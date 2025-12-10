import Navbar from "@/components/landing/Navbar";
import Login from "@/components/auth/Login";
import Footer from "@/components/landing/Footer";

export default function Page() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Login/>
            <Footer/>
        </main>
    );
}
