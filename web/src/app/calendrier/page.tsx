"use client";

import { useState, type FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";

type Type = "Déclaration" | "Aide" | "Justificatif";
type Echeance = { date: Date; label: string; type: Type; detail?: string };

// ponytail: données en dur (maquette), à brancher sur l'API quand le suivi des échéances existera côté Laravel
const ECHEANCES: Echeance[] = [
    { date: new Date(2026, 2, 13), label: "Déclaration PAC à faire", type: "Déclaration", detail: "Déclaration PAC à compléter" },
    { date: new Date(2026, 2, 19), label: "Aide bio complétée", type: "Aide" },
    { date: new Date(2026, 2, 30), label: "Envoyer justificatif aide jeunes agriculteurs", type: "Justificatif" },
    { date: new Date(2026, 9, 15), label: "Dossier MSA à envoyer", type: "Justificatif" },
    { date: new Date(2026, 9, 28), label: "Déclaration PAC à faire", type: "Déclaration", detail: "Déclaration PAC à compléter" },
    { date: new Date(2026, 10, 9), label: "Aide bio complétée", type: "Aide" },
];

const NOTIFICATIONS = ["Vous avez une échéance dans 5 jours", "Nouveau justificatif pour une aide", "Nouvelle aide disponible"];

const COULEURS: Record<Type, string> = {
    Déclaration: "bg-[#e5504b] text-white",
    Aide: "bg-[#c0e2ab] text-black",
    Justificatif: "bg-[#ffbf80] text-black",
};
const POINTS: Record<Type, string> = { Déclaration: "bg-[#e5504b]", Aide: "bg-[#c0e2ab]", Justificatif: "bg-[#ffbf80]" };

const IMG = "/images/calendrier";
const carte = "rounded-2xl border-0 bg-white dark:bg-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.2)] overflow-hidden";
const champ = "block h-10 w-full rounded-[10px] border-0 bg-[#f1f5f9] dark:bg-slate-700 pl-[34px] pr-3 text-sm font-medium text-[#14233c] dark:text-white placeholder:text-[#94a3b8] shadow-[0_0_10px_rgba(0,0,0,0.15)] outline-none focus:ring-2 focus:ring-primary";
const memeJour = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const formatJour = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function Fleche({ sens, onClick, label }: { sens: "prev" | "next"; onClick: () => void; label: string }) {
    return (
        <button onClick={onClick} aria-label={label} className={`relative size-[34px] shrink-0 transition-transform hover:scale-110 ${sens === "prev" ? "-scale-x-100 hover:-scale-x-110" : ""}`}>
            <img src={`${IMG}/suivant-cercle.svg`} alt="" className="absolute inset-0 dark:opacity-90" />
            <span className="absolute left-[13px] top-[7px] flex h-[20px] w-[11px] items-center justify-center">
                <span className="relative block h-[11px] w-[20px] rotate-90">
                    <img src={`${IMG}/suivant-fleche.svg`} alt="" className="absolute -left-[1.5px] -top-[2.23px] max-w-none dark:invert" />
                </span>
            </span>
        </button>
    );
}

function EnteteCarte({ couleur, titre, icone }: { couleur: string; titre: string; icone: "cloche" | "mégaphone" }) {
    return (
        <div className={`relative h-[61px] ${couleur}`}>
            {icone === "cloche" ? (
                <span className="absolute -left-1 -top-4 flex size-[87px] items-center justify-center">
                    <img src={`${IMG}/abeille-cloche.png`} alt="" className="size-[70px] rotate-[15.92deg] object-cover" />
                </span>
            ) : (
                <span className="absolute left-[18px] top-[13px] block h-[35px] w-[34px] overflow-hidden">
                    <img src={`${IMG}/icones.png`} alt="" className="absolute max-w-none" style={{ width: "1284.01%", height: "827.58%", left: "-585.58%", top: "-368.18%" }} />
                </span>
            )}
            <h2 className="absolute left-[74px] top-1/2 -translate-y-1/2 text-base font-semibold leading-[26px]">{titre}</h2>
        </div>
    );
}

export default function CalendrierPage() {
    const aujourdhui = new Date();
    const [mois, setMois] = useState(new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1));
    const [selection, setSelection] = useState<Date | null>(null);
    const [ajouts, setAjouts] = useState<Echeance[]>([]);
    const [form, setForm] = useState({ nom: "", date: "", type: "" });

    const tous = [...ECHEANCES, ...ajouts];
    const y = mois.getFullYear();
    const m = mois.getMonth();
    const decalage = (mois.getDay() + 6) % 7; // semaine commençant le lundi
    const jours = Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - decalage + i));
    const duJour = (d: Date) => tous.filter((e) => memeJour(e.date, d));
    const debut = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate());
    const prochaines = tous.filter((e) => e.date >= debut).sort((a, b) => +a.date - +b.date).slice(0, 2);
    const liste = selection ? duJour(selection) : prochaines;

    const ajouter = (e: FormEvent) => {
        e.preventDefault();
        if (!form.nom.trim() || !form.date || !form.type) return;
        const [a, mo, j] = form.date.split("-").map(Number);
        setAjouts([...ajouts, { date: new Date(a, mo - 1, j), label: form.nom.trim(), type: form.type as Type }]);
        setMois(new Date(a, mo - 1, 1));
        setForm({ nom: "", date: "", type: "" });
    };

    return (
        <>
            <Navbar />
            <main className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                {/* Halos de fond (maquette) */}
                <div className="dark:hidden pointer-events-none absolute -left-[40%] top-1/4 h-[110%] w-[95%] rounded-full bg-[radial-gradient(closest-side,#fff7d7,transparent)]" />
                <div className="dark:hidden pointer-events-none absolute -right-[20%] top-0 h-[45%] w-[55%] rotate-[34deg] rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />

                {/* ponytail: zoom 0.8 comme le dashboard (maquette dessinée en grand) */}
                <div className="relative container mx-auto px-4 md:px-6 [zoom:0.8] pt-32 md:pt-36 pb-24">
                    <Card className={`${carte} px-5 pb-10 pt-8 md:px-[60px] md:pb-[67px] md:pt-[44px]`}>
                        <h1 className="text-[26px] font-bold leading-[26px] md:text-[32px]">Calendrier des démarches</h1>
                        <p className="mt-4 text-sm md:text-base">Retrouvez toutes vos échéances administratives et aides agricoles au même endroit.</p>

                        <div className="mt-6 flex flex-col gap-9 lg:flex-row lg:items-start lg:gap-[39px]">
                            <div className="min-w-0 flex-1">
                                <div className="mb-[14px] flex items-center gap-3 md:gap-6 md:pl-0">
                                    <Fleche sens="prev" onClick={() => setMois(new Date(y, m - 1, 1))} label="Mois précédent" />
                                    <span className="text-[32px] font-bold uppercase leading-[26px] tracking-[0.18em] md:text-[48px] md:tracking-[8.64px]">
                                        {mois.toLocaleDateString("fr-FR", { month: "long" })}
                                    </span>
                                    <span className="self-end text-base font-medium text-[#94a3b8]">{y}</span>
                                    <Fleche sens="next" onClick={() => setMois(new Date(y, m + 1, 1))} label="Mois suivant" />
                                </div>

                                <Card className={`${carte} max-w-[950px]`}>
                                    <div className="grid h-[44px] grid-cols-7 items-center bg-[#deeefc] text-center text-[13px] md:h-[63px] md:text-xl dark:bg-slate-700">
                                        {JOURS.map((j) => <span key={j}>{j}</span>)}
                                    </div>
                                    <div className="grid h-[420px] grid-cols-7 grid-rows-6 md:h-[700px]">
                                        {jours.map((d, i) => {
                                            const evts = duJour(d);
                                            const horsMois = d.getMonth() !== m;
                                            const choisi = selection && memeJour(d, selection);
                                            const auj = memeJour(d, aujourdhui);
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setSelection(choisi ? null : d)}
                                                    aria-pressed={!!choisi}
                                                    className={[
                                                        "relative min-w-0 overflow-hidden px-[3px] pt-[3px] text-left align-top outline-none transition-colors md:px-[10px]",
                                                        "border-[#deeefc] dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                                                        i % 7 > 0 ? "border-l" : "",
                                                        i >= 7 ? "border-t" : "",
                                                        i % 7 > 4 ? "bg-[#f4faff] dark:bg-slate-700/40" : "",
                                                        choisi ? "!bg-[#fff7d7] dark:!bg-primary/20" : "hover:bg-[#f4faff] dark:hover:bg-slate-700/60",
                                                    ].join(" ")}
                                                >
                                                    <span
                                                        className={[
                                                            "mt-[1px] inline-flex h-[22px] items-center justify-center text-[13px] md:h-[26px] md:text-[15px]",
                                                            horsMois ? "text-[#94a3b8]" : "",
                                                            auj ? "-ml-1 size-[25px] rounded-full bg-primary font-bold text-[#14233c] md:-ml-2" : "",
                                                        ].join(" ")}
                                                    >
                                                        {d.getDate()}
                                                    </span>
                                                    {evts.map((e, k) => (
                                                        <span key={k} className={`mt-px hidden min-h-[61px] rounded-[10px] px-[10px] py-[10px] text-[10px] font-medium leading-[14px] md:flex md:flex-col md:justify-center ${COULEURS[e.type]}`}>
                                                            {e.label}
                                                        </span>
                                                    ))}
                                                    <span className="mt-1 flex gap-0.5 md:hidden">
                                                        {evts.map((e, k) => <span key={k} className={`size-1.5 rounded-full ${POINTS[e.type]}`} />)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>

                            {/* Colonne droite */}
                            <div className="flex w-full flex-col gap-9 lg:w-[308px] lg:shrink-0 lg:pt-[28px]">
                                <Card className={carte}>
                                    <EnteteCarte couleur="bg-primary text-[#14233c]" titre="Notifications importantes" icone="cloche" />
                                    <ul className="text-sm">
                                        {NOTIFICATIONS.map((n, i) => (
                                            <li key={n} className={`flex h-[60px] items-center px-[21px] ${i < NOTIFICATIONS.length - 1 ? "border-b border-[#f1f5f9] dark:border-slate-700" : ""}`}>{n}</li>
                                        ))}
                                    </ul>
                                </Card>

                                <Card className={`${carte} lg:-mt-[7px]`}>
                                    <EnteteCarte couleur="bg-[#14233c] text-white dark:bg-slate-900" titre={selection ? `Échéances du ${formatJour(selection)}` : "Prochaines échéances"} icone="mégaphone" />
                                    <ul className="text-sm">
                                        {liste.length === 0 && <li className="flex h-[60px] items-center px-[21px] text-[#64748b] dark:text-slate-400">Aucune échéance ce jour</li>}
                                        {liste.map((e, i) => (
                                            <li key={i} className={`flex min-h-[60px] items-center px-[21px] py-2 leading-[18px] ${i < liste.length - 1 ? "border-b border-[#f1f5f9] dark:border-slate-700" : ""}`}>
                                                <p>
                                                    {!selection && <b className="font-semibold">{formatJour(e.date)}</b>}
                                                    {!selection && " - "}
                                                    {selection ? e.label : e.detail ?? e.label}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                <Card className={`${carte} lg:-mt-[7px]`}>
                                    <form onSubmit={ajouter} className="px-[21px] pb-[17px] pt-[17px]">
                                        <button type="submit" className="h-10 w-full rounded-full bg-primary text-sm font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                            Ajouter au calendrier
                                        </button>
                                        <p className="mx-auto mt-[18px] max-w-[220px] text-center text-[10px] leading-[14px]">Rendez-vous comptable, dépôt dossier, rendez-vous chambre de commerce</p>
                                        <div className="mt-[18px] space-y-[9px]">
                                            <input aria-label="Nom de l'événement" placeholder="Nom de l’événement" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className={champ} />
                                            <input
                                                aria-label="Date"
                                                placeholder="Date"
                                                type="text"
                                                value={form.date}
                                                onFocus={(e) => (e.currentTarget.type = "date")}
                                                onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text"; }}
                                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                className={champ}
                                            />
                                            <div className="relative">
                                                <select aria-label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={`${champ} appearance-none ${form.type ? "" : "text-[#94a3b8]"}`}>
                                                    <option value="" disabled>Type</option>
                                                    <option value="Déclaration">Déclaration</option>
                                                    <option value="Aide">Aide</option>
                                                    <option value="Justificatif">Justificatif</option>
                                                </select>
                                                <img src={`${IMG}/select-a.svg`} alt="" className="pointer-events-none absolute left-[211px] top-[18px] max-w-none" />
                                                <span className="pointer-events-none absolute left-[221px] top-[18px] flex h-[8.5px] w-[7.5px] items-center justify-center">
                                                    <span className="relative block h-[7.5px] w-[8.5px] rotate-90">
                                                        <img src={`${IMG}/select-b.svg`} alt="" className="absolute -inset-px max-w-none" />
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
