"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";

const FORMES = ["EI", "EARL", "GAEC", "SCEA", "GFA", "CUMA", "SARL"];
const STATUTS = ["Chef d'exploitation", "Co-exploitant", "Cotisant solidaire", "Conjoint collaborateur", "Aide familial"];
const UNITES = ["ha", "ares"];
const AIDES_RAPIDES = ["Qu'est ce que le SIRET ?", "Calculer ma SAU facilement"];

const carte = "rounded-2xl border-0 bg-white dark:bg-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.2)]";
const champ = "h-[57px] w-full rounded-[15px] border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-[18px] text-[22px] font-light text-[#14233c] dark:text-white placeholder:text-[#14233c]/60 dark:placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary";

function Etiquette({ id, children }: { id: string; children: ReactNode }) {
    return <label htmlFor={id} className="mb-3 block text-[22px] font-medium leading-[26px]">{children}</label>;
}

function Liste({ id, valeur, options, onChange }: { id: string; valeur: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <div className="relative">
            <select id={id} value={valeur} onChange={(e) => onChange(e.target.value)} className={`${champ} appearance-none pr-14`}>
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <img src="/images/mes-aides/chevron-bas.svg" alt="" className="pointer-events-none absolute right-6 top-1/2 h-auto w-7 -translate-y-1/2 dark:invert" />
        </div>
    );
}

function Pastille({ n, actif }: { n: number; actif?: boolean }) {
    return (
        <span className={`flex size-[29px] shrink-0 items-center justify-center rounded-full text-lg font-medium shadow-sm ${actif ? "bg-primary" : "bg-[#deeefc] dark:bg-slate-600"}`}>
            {n}
        </span>
    );
}

export default function MesAidesPage() {
    const [forme, setForme] = useState("EARL");
    const [statut, setStatut] = useState(STATUTS[0]);
    const [siret, setSiret] = useState("");
    const [sau, setSau] = useState("");
    const [unite, setUnite] = useState("ha");

    const envoyer = (e: FormEvent) => {
        e.preventDefault();
        if (!/^\d{14}$/.test(siret)) return toast.error("Le SIRET doit contenir 14 chiffres.");
        if (!(Number(sau) > 0)) return toast.error("Indiquez votre surface agricole utile.");
        // ponytail: étapes 2 et 3 non maquettées, on valide seulement l'étape 1 ; brancher la suite + l'API quand elles existeront
        toast.success("Informations enregistrées. Les prochaines étapes arrivent bientôt.");
    };

    return (
        <>
            <Navbar />
            <main id="contenu" className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                <div className="dark:hidden pointer-events-none absolute -left-[40%] top-[10%] h-[100%] w-[95%] rounded-full bg-[radial-gradient(closest-side,#fff7d7,transparent)]" />
                <div className="dark:hidden pointer-events-none absolute -right-[20%] top-0 h-[45%] w-[55%] rotate-[34deg] rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />

                <div className="relative container mx-auto px-4 md:px-6 md:[zoom:0.8] pt-32 md:pt-36 pb-24">
                    <Breadcrumb items={[{ label: "Mes aides" }]} className="mb-8" />
                    <Card className={`${carte} max-w-[790px] px-6 md:px-[46px] pt-8 pb-7`}>
                        <h1 className="text-[26px] md:text-[32px] leading-tight">Mes aides disponibles</h1>
                        <p className="mt-3">Remplissez vos informations pour découvrir les aides disponibles !</p>
                        <ol className="relative mt-8 flex max-w-[330px] items-center" aria-label="Étapes du formulaire">
                            <li aria-current="step"><Pastille n={1} actif /></li>
                            <li aria-hidden className="h-0 flex-1 border-t-[1.6px] border-dashed border-primary" />
                            <li><Pastille n={2} /></li>
                            <li aria-hidden className="h-0 flex-1 border-t-[1.6px] border-dashed border-[#deeefc] dark:border-slate-600" />
                            <li><Pastille n={3} /></li>
                            <span aria-hidden className="absolute left-[24%] top-1/2 block h-[26px] w-[31px] -translate-y-1/2 -rotate-12 overflow-hidden">
                                <img src="/images/mes-aides/abeille-etape.png" alt="" className="absolute max-w-none" style={{ width: "1304.46%", height: "657.3%", left: "-1111.78%", top: "-498.88%" }} />
                            </span>
                        </ol>
                    </Card>

                    <h2 className="mt-12 mb-6 text-2xl">Profil de mon exploitation agricole</h2>

                    <Card className={`${carte} grid gap-10 px-6 md:px-[54px] py-10 lg:grid-cols-[minmax(0,755px)_minmax(0,441px)] lg:justify-between`}>
                        <form onSubmit={envoyer} className="flex flex-col gap-9" noValidate>
                            <div>
                                <Etiquette id="forme">Forme juridique</Etiquette>
                                <Liste id="forme" valeur={forme} options={FORMES} onChange={setForme} />
                            </div>
                            <div>
                                <Etiquette id="statut">Statut du chef d'exploitation</Etiquette>
                                <Liste id="statut" valeur={statut} options={STATUTS} onChange={setStatut} />
                            </div>
                            <div>
                                <Etiquette id="siret">SIRET</Etiquette>
                                <div className="relative">
                                    <input
                                        id="siret"
                                        inputMode="numeric"
                                        maxLength={14}
                                        value={siret}
                                        onChange={(e) => setSiret(e.target.value.replace(/\D/g, ""))}
                                        className={`${champ} pr-32`}
                                    />
                                    <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[22px] font-light">(14 chiffres)</span>
                                </div>
                            </div>
                            <div>
                                <Etiquette id="sau">Surface agricole utile (SAU)</Etiquette>
                                <div className="grid grid-cols-[1fr_auto] gap-5 sm:grid-cols-[457fr_276fr]">
                                    <input id="sau" inputMode="decimal" value={sau} onChange={(e) => setSau(e.target.value.replace(",", "."))} placeholder="xx ha" className={champ} />
                                    <Liste id="unite" valeur={unite} options={UNITES} onChange={setUnite} />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-2 inline-flex h-10 w-full max-w-[358px] items-center justify-center gap-4 rounded-full bg-primary text-lg font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Étape suivante
                                <img src="/images/mes-aides/fleche.svg" alt="" />
                            </button>
                        </form>

                        <aside className="lg:self-center">
                            <div className={`${carte} overflow-hidden`}>
                                <div className="relative flex min-h-[86px] items-center bg-[#deeefc] dark:bg-slate-700 pl-[97px] pr-6 py-3 text-[22px] font-semibold leading-[26px]">
                                    <span aria-hidden className="absolute left-[27px] top-[17px] size-[46px]">
                                        <img src="/images/mes-aides/bulle.svg" alt="" className="absolute left-[13px] top-[8px] h-[27px] w-6" />
                                        <span className="absolute inset-0 -scale-x-100 overflow-hidden">
                                            <img src="/images/dashboard/icones.png" alt="" className="absolute max-w-none" style={{ width: "397.67%", height: "263.61%", left: "-249.71%", top: "-66.8%" }} />
                                        </span>
                                    </span>
                                    Besoin de conseils pour remplir vos informations ?
                                </div>
                                <ul>
                                    {AIDES_RAPIDES.map((t) => (
                                        <li key={t} className="border-t border-[#deeefc] dark:border-slate-700 first:border-t-0">
                                            <Link href="/guide" className="flex min-h-[84px] items-center justify-between gap-4 px-[82px] pr-8 text-lg leading-[26px] hover:bg-[#f4faff] dark:hover:bg-slate-700/50 transition-colors">
                                                {t}
                                                <img src="/images/mes-aides/fleche.svg" alt="" className="dark:invert" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="mt-4 text-[15px]">
                                En cas de besoin, <Link href="/contact" className="underline underline-offset-4 hover:text-[#b38f00] dark:hover:text-primary">contactez-nous !</Link>
                            </p>
                        </aside>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
