"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";
import { getApiBase } from "@/lib/api";
import { useEspace, STATUTS, type Statut } from "@/lib/espace";

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

function Calendrier({ echeances }: { echeances: { dateISO: string; label: string }[] }) {
    const aujourdhui = new Date();
    const [mois, setMois] = useState(new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1));
    const y = mois.getFullYear();
    const m = mois.getMonth();
    const decalage = (mois.getDay() + 6) % 7; // semaine commençant le lundi
    const jours = Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - decalage + i));
    const memeJour = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    const duMois = echeances
        .map((e) => ({ ...e, d: new Date(e.dateISO) }))
        .filter((e) => e.d.getFullYear() === y && e.d.getMonth() === m);
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
                {jours.map((d, i) => {
                    const marque = duMois.some((e) => memeJour(d, e.d));
                    return (
                        <span
                            key={i}
                            className={[
                                "mx-auto flex size-8 items-center justify-center rounded-full",
                                d.getMonth() !== m ? "text-[#b5b5b5] dark:text-white/30" : i % 7 > 4 ? "text-[#555] dark:text-white/80" : "text-[#222] dark:text-white",
                                memeJour(d, aujourdhui) && "bg-primary !text-[#14233c]",
                                marque && !memeJour(d, aujourdhui) && "ring-2 ring-primary",
                            ].filter(Boolean).join(" ")}
                        >
                            {d.getDate()}
                        </span>
                    );
                })}
            </div>

            {duMois.length ? (
                <p className="mt-6 flex min-h-10 items-center justify-center rounded-full bg-primary px-4 text-center text-base md:text-lg font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)]">
                    {duMois[0].d.getDate()} {nomMois} : {duMois[0].label}
                </p>
            ) : (
                <p className="mt-6 flex min-h-10 items-center justify-center text-center">Aucune échéance ce mois-ci</p>
            )}
        </Card>
    );
}

export default function DashboardPage() {
    const { ready, data, alertes, ajouterAide, changerStatut, retirerAide } = useEspace();
    const [aidesApi, setAidesApi] = useState<string[]>([]);
    const [choix, setChoix] = useState("");
    const [statut, setStatut] = useState<Statut>("À compléter");

    // Noms d'aides réels depuis l'API (pour alimenter le suivi).
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        fetch(`${getApiBase()}/aides`, { headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
            .then((r) => (r.ok ? r.json() : []))
            .then((rows: any[]) => {
                const noms = Array.isArray(rows)
                    ? rows.map((a) => a.aide_name || a.nom).filter(Boolean)
                    : [];
                setAidesApi([...new Set(noms)]);
            })
            .catch(() => setAidesApi([]));
    }, []);

    const dispo = useMemo(
        () => aidesApi.filter((n) => !data.suivi.some((a) => a.nom === n)),
        [aidesApi, data.suivi],
    );

    const ajouter = () => {
        if (!choix) return;
        ajouterAide(choix, statut);
        setChoix("");
    };

    return (
        <>
            <Navbar />
            <main id="contenu" className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                <div className="dark:hidden pointer-events-none absolute -left-[40%] top-1/4 h-[110%] w-[95%] rounded-full bg-[radial-gradient(closest-side,#fff7d7,transparent)]" />
                <div className="dark:hidden pointer-events-none absolute -right-[20%] top-0 h-[45%] w-[55%] rotate-[34deg] rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />

                <div className="relative container mx-auto px-4 md:px-6 md:[zoom:0.8] pt-32 md:pt-36">
                    <Breadcrumb items={[{ label: "Tableau de bord" }]} />
                </div>
                <div className="relative container mx-auto px-4 md:px-6 md:[zoom:0.8] pt-6 pb-24 grid gap-x-10 xl:gap-x-16 2xl:gap-x-[132px] gap-y-12 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,441px)] items-start">
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
                                            <th className="w-[40%] pl-6 md:pl-[54px] font-medium">Aide</th>
                                            <th className="w-[28%] font-medium">Statut</th>
                                            <th className="pr-6 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ready && data.suivi.length === 0 && (
                                            <tr className="h-[84px] border-b border-[#deeefc] dark:border-slate-700">
                                                <td colSpan={3} className="px-6 md:px-[54px] text-[#64748b] dark:text-slate-400">
                                                    Aucune aide suivie pour l'instant. Ajoutez-en une ci-dessous.
                                                </td>
                                            </tr>
                                        )}
                                        {data.suivi.map((a) => (
                                            <tr
                                                key={a.id}
                                                className={`h-[84px] border-b border-[#deeefc] dark:border-slate-700 ${a.statut === "À compléter" ? "bg-[#f4faff] dark:bg-slate-700/40" : ""}`}
                                            >
                                                <td className="pl-6 md:pl-[54px]">{a.nom}</td>
                                                <td>
                                                    <span className="inline-flex items-center gap-2">
                                                        <select
                                                            aria-label={`Statut de ${a.nom}`}
                                                            value={a.statut}
                                                            onChange={(e) => changerStatut(a.id, e.target.value as Statut)}
                                                            className="rounded-lg border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-2 py-1 text-sm md:text-base"
                                                        >
                                                            {STATUTS.map((s) => <option key={s}>{s}</option>)}
                                                        </select>
                                                        {a.statut === "Acceptée" && <Coche />}
                                                        {a.statut === "En cours" && <Horloge />}
                                                    </span>
                                                </td>
                                                <td className="pr-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => retirerAide(a.id)}
                                                        className="text-sm md:text-base text-[#e5504b] underline underline-offset-4 hover:opacity-80"
                                                    >
                                                        Retirer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Ajout d'une aide au suivi (noms réels issus de l'API) */}
                            <div className="flex flex-wrap items-center gap-3 px-6 md:px-[54px] py-5 border-b border-[#deeefc] dark:border-slate-700">
                                <select
                                    aria-label="Choisir une aide à suivre"
                                    value={choix}
                                    onChange={(e) => setChoix(e.target.value)}
                                    className="min-w-[200px] flex-1 rounded-lg border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-3 py-2 text-base"
                                >
                                    <option value="">{dispo.length ? "Choisir une aide…" : "Aucune aide disponible"}</option>
                                    {dispo.map((n) => <option key={n}>{n}</option>)}
                                </select>
                                <select
                                    aria-label="Statut initial"
                                    value={statut}
                                    onChange={(e) => setStatut(e.target.value as Statut)}
                                    className="rounded-lg border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-3 py-2 text-base"
                                >
                                    {STATUTS.map((s) => <option key={s}>{s}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={ajouter}
                                    disabled={!choix}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    <span aria-hidden className="text-xl leading-none">+</span> Suivre
                                </button>
                            </div>

                            <div className="flex h-[85px] items-center px-6 md:px-[54px]">
                                <Link href="/mes-aides" className={lienSouligne}>Voir toutes mes aides</Link>
                            </div>
                        </Card>
                    </div>

                    {/* Colonne droite */}
                    <div className="flex flex-col">
                        <Calendrier echeances={data.echeances} />

                        <h2 className="mt-12 mb-6 text-2xl">Mes alertes</h2>
                        <Card className={carte}>
                            <div className="flex h-[86px] items-center bg-[#deeefc] dark:bg-slate-700 pl-6 md:pl-[54px] text-lg md:text-[22px] font-medium">
                                Alertes
                            </div>
                            <ul>
                                {ready && alertes.length === 0 && (
                                    <li className="flex min-h-[84px] items-center px-6 md:px-[54px] text-base md:text-lg text-[#64748b] dark:text-slate-400">
                                        Aucune alerte pour le moment.
                                    </li>
                                )}
                                {alertes.map((a, i) => (
                                    <li key={i} className="flex min-h-[84px] items-center gap-[13px] border-b border-[#deeefc] dark:border-slate-700 py-3 pl-6 md:pl-[54px] pr-6 text-base md:text-lg leading-[26px]">
                                        <span aria-hidden className="relative inline-block size-[23px] shrink-0">
                                            <img src={pastille} alt="" className="absolute inset-0" />
                                        </span>
                                        <p>{a.texte}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex h-[79px] items-center px-6 md:px-[54px]">
                                <Link href="/calendrier" className={lienSouligne}>Voir le calendrier</Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
