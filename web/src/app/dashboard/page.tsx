"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";

// ponytail: données en dur (maquette), à brancher sur l'API quand le suivi des aides existera côté Laravel
const AIDES = [
    { nom: "Aide PAC", statut: "En cours", action: "Compléter justificatif" },
    { nom: "Aide bio", statut: "Acceptée", action: "–" },
    { nom: "Aide jeunes agriculteurs", statut: "À compléter", action: "Finaliser votre demande" },
    { nom: "Aide calamité agricole", statut: "À compléter", action: "Finaliser votre demande" },
];

// Recadrages de la planche d'icônes /images/dashboard/icones.png (valeurs de la maquette)
const ALERTES: { w: number; h: number; crop: CSSProperties; texte: ReactNode }[] = [
    {
        w: 46, h: 46,
        crop: { width: "397.67%", height: "263.61%", left: "-249.71%", top: "-66.8%" },
        texte: <>Il vous reste <b className="font-semibold">7 jours</b> pour compléter votre dossier PAC.</>,
    },
    {
        w: 37, h: 49,
        crop: { width: "681.53%", height: "338.41%", left: "-108.65%", top: "-121.31%" },
        texte: <>Un <b className="font-semibold">justificatif manquant</b> est requis pour votre aide jeunes agriculteurs</>,
    },
    {
        w: 44, h: 46,
        crop: { width: "1284.01%", height: "827.58%", left: "-585.58%", top: "-368.18%" },
        texte: <><b className="font-semibold">Nouvelle aide</b> disponible pour calamité agricole</>,
    },
];

const ECHEANCES = [{ date: new Date(2026, 9, 15), label: "Dossier MSA à envoyer" }];

const carte = "rounded-2xl border-0 bg-white dark:bg-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.2)] overflow-hidden";
const lienSouligne = "text-base md:text-lg font-medium underline underline-offset-[6px] hover:text-[#b38f00] dark:hover:text-primary transition-colors";
const pastille = "/images/dashboard/pastille.svg";

function Coche() {
    return (
        <span className="relative inline-block size-[23px] shrink-0">
            <img src={pastille} alt="" className="absolute inset-0" />
            <img src="/images/dashboard/coche.svg" alt="" className="absolute left-[4.5px] top-[5.5px]" />
        </span>
    );
}

function Horloge() {
    return (
        <span className="relative inline-block size-[23px] shrink-0">
            <img src={pastille} alt="" className="absolute inset-0" />
            <img src="/images/dashboard/horloge-cadran.svg" alt="" className="absolute left-[3px] top-[3px]" />
            <img src="/images/dashboard/horloge-aiguille.svg" alt="" className="absolute left-[10px] top-[7px]" />
        </span>
    );
}

function Calendrier() {
    const aujourdhui = new Date();
    const [mois, setMois] = useState(new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1));
    const y = mois.getFullYear();
    const m = mois.getMonth();
    const decalage = (mois.getDay() + 6) % 7; // semaine commençant le lundi
    const jours = Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - decalage + i));
    const memeJour = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    const echeance = ECHEANCES.find((e) => e.date.getFullYear() === y && e.date.getMonth() === m);
    const nomMois = mois.toLocaleDateString("fr-FR", { month: "long" });

    return (
        <Card className={`${carte} px-6 md:px-[46px] pt-11 pb-5`}>
            <div className="flex items-center justify-between">
                <Link href="/calendrier" className="text-2xl font-bold hover:text-[#b38f00] dark:hover:text-primary transition-colors">Calendrier</Link>
                <div className="flex items-center gap-4">
                    <button onClick={() => setMois(new Date(y, m - 1, 1))} aria-label="Mois précédent" className="p-1 rotate-180 dark:invert">
                        <img src="/images/dashboard/chevron.svg" alt="" />
                    </button>
                    <span className="capitalize min-w-[4.5rem] text-center">{nomMois}</span>
                    <button onClick={() => setMois(new Date(y, m + 1, 1))} aria-label="Mois suivant" className="p-1 dark:invert">
                        <img src="/images/dashboard/chevron.svg" alt="" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-7 auto-rows-[31px] items-center rounded-[25px] bg-gradient-to-br from-white to-[#ececec] dark:from-slate-700 dark:to-slate-800 px-2 py-[22px] text-center text-[17px] font-medium">
                {["L", "M", "M", "J", "V", "S", "D"].map((j, i) => (
                    <span key={i} className="text-[15px] text-[#6b6b6b] dark:text-white/60">{j}</span>
                ))}
                {jours.map((d, i) => (
                    <span
                        key={i}
                        className={[
                            "mx-auto flex size-8 items-center justify-center rounded-full",
                            d.getMonth() !== m ? "text-[#b5b5b5] dark:text-white/30" : i % 7 > 4 ? "text-[#555] dark:text-white/80" : "text-[#222] dark:text-white",
                            memeJour(d, aujourdhui) && "bg-primary !text-[#14233c]",
                            echeance && memeJour(d, echeance.date) && "ring-2 ring-primary",
                        ].filter(Boolean).join(" ")}
                    >
                        {d.getDate()}
                    </span>
                ))}
            </div>

            {echeance ? (
                <p className="mt-6 flex min-h-10 items-center justify-center rounded-full bg-primary px-4 text-center text-base md:text-lg font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)]">
                    {echeance.date.getDate()} {nomMois} : {echeance.label}
                </p>
            ) : (
                <p className="mt-6 flex min-h-10 items-center justify-center text-center">Aucune échéance ce mois-ci</p>
            )}
        </Card>
    );
}

export default function DashboardPage() {
    return (
        <>
            <Navbar />
            <main className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                {/* Halos de fond (maquette) */}
                <div className="dark:hidden pointer-events-none absolute -left-[40%] top-1/4 h-[110%] w-[95%] rounded-full bg-[radial-gradient(closest-side,#fff7d7,transparent)]" />
                <div className="dark:hidden pointer-events-none absolute -right-[20%] top-0 h-[45%] w-[55%] rotate-[34deg] rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />

                {/* ponytail: zoom global 0.8 car la maquette est dessinée en grand ; remplacer par des tailles Tailwind réduites si Firefox < 126 compte */}
                <div className="relative container mx-auto px-4 md:px-6 [zoom:0.8] pt-32 md:pt-36 pb-24 grid gap-x-10 xl:gap-x-16 2xl:gap-x-[132px] gap-y-12 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,441px)] items-start">
                    {/* Colonne gauche */}
                    <div className="flex flex-col">
                        <Card className={`${carte} px-6 md:px-[46px] py-11`}>
                            <h1 className="text-[26px] md:text-[32px] leading-tight">Trouver mes aides</h1>
                            <p className="mt-3">Identifiez les aides adaptées à votre exploitation en 3 minutes</p>
                            <Link
                                href="/radar-aides"
                                className="mt-7 inline-flex h-10 w-[193px] items-center justify-center rounded-full bg-primary text-lg font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-lg transition-all"
                            >
                                Découvrir
                            </Link>
                        </Card>

                        <h2 className="mt-12 mb-6 text-2xl">Mes aides en cours</h2>
                        <Card className={carte}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] whitespace-nowrap text-left text-base md:text-lg">
                                    <thead className="bg-[#deeefc] dark:bg-slate-700 text-lg md:text-[22px]">
                                        <tr className="h-[86px]">
                                            <th className="w-[43%] pl-6 md:pl-[54px] font-medium">Aide</th>
                                            <th className="w-[22%] font-medium">Statut</th>
                                            <th className="pr-6 font-medium">Prochaine action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {AIDES.map((a) => (
                                            <tr
                                                key={a.nom}
                                                className={`h-[84px] border-b border-[#deeefc] dark:border-slate-700 ${a.statut === "À compléter" ? "bg-[#f4faff] dark:bg-slate-700/40" : ""}`}
                                            >
                                                <td className="pl-6 md:pl-[54px]">{a.nom}</td>
                                                <td>
                                                    <span className={`inline-flex items-center gap-1.5 ${a.statut === "Acceptée" ? "font-semibold" : ""}`}>
                                                        {a.statut}
                                                        {a.statut === "Acceptée" && <Coche />}
                                                    </span>
                                                </td>
                                                <td className="pr-6">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        {a.action}
                                                        {a.statut === "En cours" && <Horloge />}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex h-[85px] items-center px-6 md:px-[54px]">
                                <Link href="/mes-aides" className={lienSouligne}>Voir toutes mes aides</Link>
                            </div>
                        </Card>
                    </div>

                    {/* Colonne droite */}
                    <div className="flex flex-col">
                        <Calendrier />

                        <h2 className="mt-12 mb-6 text-2xl">Mes alertes</h2>
                        <Card className={carte}>
                            <div className="flex h-[86px] items-center bg-[#deeefc] dark:bg-slate-700 pl-6 md:pl-[54px] text-lg md:text-[22px] font-medium">
                                Aide
                            </div>
                            <ul>
                                {ALERTES.map((a, i) => (
                                    <li key={i} className="flex min-h-[84px] items-center gap-[13px] border-b border-[#deeefc] dark:border-slate-700 py-3 pl-4 md:pl-[23px] pr-6 text-base md:text-lg leading-[26px]">
                                        <span className="flex w-[46px] shrink-0 justify-center">
                                            <span className="relative block overflow-hidden" style={{ width: a.w, height: a.h }}>
                                                <img src="/images/dashboard/icones.png" alt="" className="absolute max-w-none" style={a.crop} />
                                            </span>
                                        </span>
                                        <p>{a.texte}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex h-[79px] items-center px-6 md:px-[54px]">
                                <Link href="/mes-aides" className={lienSouligne}>Voir toutes mes aides</Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
