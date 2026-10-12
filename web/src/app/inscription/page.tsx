import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import UnderNavbar from "@/components/ui/under_navbar";
import Highlight from "@/components/ui/highlight";

export const metadata: Metadata = {
    title: "Inscription | Phobee",
    description: "Créez votre compte Phobee rapidement, ou découvrez en même temps les aides auxquelles vous avez droit.",
};

const carte = "flex min-h-[205px] flex-col items-center justify-center gap-3 rounded-[31px] px-6 py-8 text-center shadow-[0_1px_5px_rgba(0,0,0,0.69)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60";

export default function InscriptionPage() {
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
            <main className="bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                <div className="container mx-auto px-4 md:px-6 md:[zoom:0.8] pb-24">
                    {/* Choix */}
                    <section className="mx-auto max-w-[1080px] pt-14 md:pt-[70px]">
                        <p className="text-xl leading-[42px] md:text-2xl">
                            Commencez simplement, <br />
                            ou <Highlight variant="marker" color="blue">découvrez en même temps les aides</Highlight> auxquelles vous avez droit.
                        </p>

                        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-14">
                            <Link href="/signup" className={`${carte} bg-[#14233c] text-white dark:bg-slate-800 dark:ring-1 dark:ring-white/20`}>
                                <h2 className="text-xl md:text-2xl">Créer mon compte rapidement</h2>
                                <p className="font-['Gowun_Dodum',sans-serif] text-lg leading-[26px] md:text-xl">
                                    Accédez à la plateforme en quelques clics.<br className="hidden md:block" /> Vous pourrez compléter votre profil plus tard.
                                </p>
                            </Link>
                            <Link href="/questionnaire" className={`${carte} bg-primary text-[#14233c]`}>
                                <h2 className="text-xl md:text-2xl">Découvrir les aides auxquelles j'ai droit</h2>
                                <p className="font-['Gowun_Dodum',sans-serif] text-lg leading-[26px] md:text-xl">
                                    Répondez à quelques questions en plus pour obtenir une estimation personnalisée de vos aides.
                                </p>
                            </Link>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="flex flex-col items-center pt-20 text-center md:pt-[120px]">
                        <h2 className="text-[28px] leading-[52px] md:text-[40px]">Vous avez des questions ?</h2>
                        <Link
                            href="/faq"
                            className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-primary px-10 text-lg font-medium text-[#0f1729] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Consulter la FAQ
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
