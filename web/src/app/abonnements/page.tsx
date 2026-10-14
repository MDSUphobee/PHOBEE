import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import UnderNavbar from "@/components/ui/under_navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";

const features = [
    { label: "Pré-remplissage guidé", className: "bg-[#FFCC00] text-[#14233c] rotate-[-1.2deg]" },
    { label: "Vérification des informations essentielles", className: "bg-[#deeefc] text-[#14233c] rotate-[0.2deg]" },
    { label: "Explications simplifiées", className: "bg-[#14233c] text-white rotate-[-1.2deg]" },
    { label: "Téléchargement du document prêt à envoyer", className: "bg-[#fff7d7] text-[#14233c] rotate-[-1.2deg]" },
];

const cerfaRows = [
    { label: "Type de document", value: "", head: true },
    { label: "CERFA Simple", value: "5 €" },
    { label: "CERFA Standard", value: "10 €" },
    { label: "CERFA Complexe", value: "15 €" },
];

const aideRows = [
    { label: "Montant de l’aide obtenue", value: "Commission PhoBee", head: true },
    { label: "Moins de 1 000 €", value: "0 %" },
    { label: "De 1 000 € à 5 000 €", value: "10 %" },
    { label: "De 5 001 € à 15 000 €", value: "7 %" },
    { label: "Plus de 15 000 €", value: "5 %" },
];

export default function AbonnementsPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#f7f6fe] dark:bg-background">
            <Navbar />

            <UnderNavbar
                imageSrc="/images/tarif-hero.jpg"
                title="Payez uniquement lorsque vous en avez besoin"
                subtitle="PhoBee vous accompagne étape par étape, avec des explications simples et un accompagnement pédagogique."
                dimensions={{ width: "1439px", height: "392px" }}
                highlightText={["besoin"]}
                titleSize="56px"
                subtitleSize="20px"
            />

            <div className="container mx-auto flex-grow px-4 pt-6 pb-20 md:px-6">
                <Breadcrumb items={[{ label: "Nos tarifs" }]} className="mb-10" />

                {/* ───────── Feature pills ───────── */}
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
                    {features.map((f) => (
                        <span
                            key={f.label}
                            className={`inline-block rounded-xl px-5 py-1 text-center text-base font-bold shadow-[0_4px_4px_rgba(0,0,0,0.25)] md:text-lg ${f.className}`}
                        >
                            {f.label}
                        </span>
                    ))}
                </div>

                {/* ───────── Pricing cards ───────── */}
                <div className="mx-auto mt-20 grid max-w-6xl gap-x-8 gap-y-20 lg:grid-cols-2">
                    {/* Carte CERFA */}
                    <div className="relative rounded-2xl border border-[#f1f5f9] bg-white p-6 pb-14 shadow-[1px_2px_4.7px_rgba(0,0,0,0.15)] dark:border-slate-700 dark:bg-slate-800 md:p-8 md:pb-16">
                        <div className="inline-flex rounded-2xl border border-[#94a3b8] bg-[#f1f5f9] px-5 py-3 shadow-sm dark:border-slate-600 dark:bg-slate-900">
                            <span className="font-heading text-xl font-semibold tracking-tight text-[#0f172a] dark:text-white md:text-2xl">
                                Tarifs des CERFA
                            </span>
                        </div>

                        <div className="mt-8">
                            {cerfaRows.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between border-b border-slate-200/80 py-3.5 dark:border-slate-700/60"
                                >
                                    <span
                                        className={`text-lg md:text-xl ${
                                            row.head
                                                ? "text-[#475569] dark:text-slate-400"
                                                : "text-[#475569] dark:text-slate-300"
                                        }`}
                                    >
                                        {row.label}
                                    </span>
                                    <span className="text-lg font-semibold text-[#475569] dark:text-slate-200 md:text-xl">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Exemple de documents disponibles : déclaration de situation sociale (MSA) / remboursement
                            accise énergies, etc.
                        </p>

                        <div className="absolute inset-x-5 -bottom-9 -rotate-1 rounded-[26px] bg-[#FFCC00] px-6 py-4 text-center shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                            <p className="font-heading text-base font-bold leading-snug text-white drop-shadow-[0_0_11.7px_rgba(0,0,0,0.12)] md:text-lg">
                                Le tarif dépend du niveau de complexité et du temps d’accompagnement nécessaire.
                            </p>
                        </div>
                    </div>

                    {/* Carte Grille tarifaire */}
                    <div className="relative rounded-2xl border border-[#14233c] bg-white p-6 pb-14 shadow-[1px_2px_4.7px_rgba(0,0,0,0.15)] dark:border-slate-600 dark:bg-slate-800 md:p-8 md:pb-16">
                        <div className="inline-flex rounded-2xl border border-[#94a3b8] bg-[#f1f5f9] px-5 py-3 shadow-sm dark:border-slate-600 dark:bg-slate-900">
                            <span className="font-heading text-xl font-semibold tracking-tight text-[#0f172a] dark:text-white md:text-2xl">
                                Grille tarifaire
                            </span>
                        </div>

                        <div className="mt-8">
                            {aideRows.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between border-b border-slate-200/80 py-3.5 dark:border-slate-700/60"
                                >
                                    <span className="text-lg text-[#475569] dark:text-slate-300 md:text-xl">
                                        {row.label}
                                    </span>
                                    <span
                                        className={`text-lg md:text-xl ${
                                            row.head
                                                ? "text-[#475569] dark:text-slate-400"
                                                : "font-bold text-[#14233c] dark:text-slate-100"
                                        }`}
                                    >
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-x-5 -bottom-9 -rotate-1 rounded-[26px] border border-black bg-[#fff7d7] px-6 py-4 text-center shadow-[0_6px_16px_rgba(0,0,0,0.18)] dark:border-slate-500">
                            <p className="font-heading text-base font-bold leading-snug text-[#14233c] md:text-lg">
                                Vous ne payez que si vous obtenez une aide
                            </p>
                        </div>
                    </div>
                </div>

                {/* ───────── CTA principal : commencer ───────── */}
                <div className="mt-20 text-center">
                    <Link
                        href="/inscription"
                        className="inline-block rounded-full bg-[#FFCC00] px-10 py-4 text-lg font-bold text-[#0f1729] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#FFC000] hover:shadow-lg"
                    >
                        Commencer maintenant
                    </Link>
                </div>

                {/* ───────── CTA FAQ ───────── */}
                <div className="mt-24 text-center">
                    <h2 className="font-heading text-3xl font-extrabold text-[#14233c] dark:text-white md:text-4xl">
                        Vous avez des questions ?
                    </h2>
                    <Link
                        href="/faq"
                        className="mt-8 inline-block rounded-full bg-[#FFCC00] px-8 py-3 text-lg font-medium text-[#0f1729] transition-all hover:bg-[#FFC000]"
                    >
                        Consulter la FAQ
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
