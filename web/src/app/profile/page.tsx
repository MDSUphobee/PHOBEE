"use client";

import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card } from "@/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

const FORMES = ["EI", "EARL", "GAEC", "SCEA", "GFA", "CUMA", "SARL"];
const PRODUCTIONS = ["Élevage", "Céréales", "Maraîchage", "Viticulture", "Arboriculture", "Polyculture-élevage"];
const DOCUMENTS = ["Attestation MSA", "Documents PAC", "Justificatifs exploitation", "Statuts de l'exploitation"];
const NOTIFS = [
    { id: "rappels", label: "Recevoir des rappels pour les échéances" },
    { id: "aides", label: "Recevoir les nouvelles aides disponibles" },
    { id: "alertes", label: "Recevoir les alertes importantes" },
];

const EXPLOITATION_VIDE = { nomExploitation: "", forme: "EARL", siret: "", sau: "", production: "", region: "" };
const NOTIFS_DEFAUT: Record<string, boolean> = { rappels: true, aides: true, alertes: true };

const carte = "rounded-2xl border-0 bg-white dark:bg-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.2)]";
const champ = "h-[43px] w-full rounded-[15px] border border-[#94a3b8] bg-[#f4faff] dark:bg-slate-700 px-4 text-[15px] font-light text-[#14233c] dark:text-white placeholder:text-[#14233c]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-80";
const champLarge = `${champ} !h-[57px]`;
const bouton = "inline-flex h-10 w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-primary px-4 text-base xl:text-lg font-medium text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60";
const boutonContour = "inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border px-3 text-base bg-white dark:bg-slate-800 font-medium shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5";

// Recadrages de la planche d'icônes (valeurs de la maquette)
const ICONE_DOC: CSSProperties = { width: "681.53%", height: "338.41%", left: "-108.65%", top: "-121.31%" };
const ICONE_CRAYON: CSSProperties = { width: "601.47%", height: "403.99%", left: "-200.88%", top: "-269.53%" };

function Etiquette({ id, children }: { id: string; children: ReactNode }) {
    return <label htmlFor={id} className="mb-2 block text-lg font-medium leading-[26px]">{children}</label>;
}

function Liste({ id, valeur, options, onChange, disabled, vide }: { id: string; valeur: string; options: string[]; onChange: (v: string) => void; disabled: boolean; vide?: string }) {
    return (
        <div className="relative">
            <select id={id} value={valeur} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={`${champLarge} appearance-none pr-12`}>
                {vide && <option value="">{vide}</option>}
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2" />
        </div>
    );
}

function BoutonModifier({ editing, saving, label = "Modifier les informations" }: { editing: boolean; saving?: boolean; label?: string }) {
    return (
        <button type="submit" disabled={saving} className={bouton}>
            {!editing && (
                <span className="relative block size-[21px] overflow-hidden" aria-hidden>
                    <img src="/images/profil/crayon.png" alt="" className="absolute max-w-none" style={ICONE_CRAYON} />
                </span>
            )}
            {editing ? (saving ? "Enregistrement..." : "Enregistrer") : label}
        </button>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mes informations
    const [infos, setInfos] = useState({ nom: "", prenom: "", email: "", phone: "" });
    const [editInfos, setEditInfos] = useState(false);
    const [saving, setSaving] = useState(false);

    // Mon exploitation
    // ponytail: pas encore d'API pour ces champs, stockés localement ; brancher sur le backend quand il existera
    const [expl, setExpl] = useState(EXPLOITATION_VIDE);
    const [editExpl, setEditExpl] = useState(false);

    const [notifs, setNotifs] = useState(NOTIFS_DEFAUT);

    // Mot de passe
    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState({ password: "", confirm: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const stored = localStorage.getItem("user");
        if (!token || !stored) {
            router.push("/login");
            return;
        }
        try {
            const u = JSON.parse(stored);
            setUser(u);
            const [prenom = "", ...reste] = String(u.username || u.name || "").split(" ");
            setInfos({ prenom, nom: reste.join(" "), email: u.email || "", phone: u.phone || "" });
            setExpl({ ...EXPLOITATION_VIDE, ...JSON.parse(localStorage.getItem("exploitation") || "{}") });
            setNotifs({ ...NOTIFS_DEFAUT, ...JSON.parse(localStorage.getItem("notifications") || "{}") });
        } catch {
            router.push("/login");
            return;
        }
        setLoading(false);
    }, [router]);

    const maj = (changes: { name?: string; email?: string; phone?: string; password?: string }) => {
        const token = localStorage.getItem("token");
        return fetch(`${API_BASE}/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(changes),
        });
    };

    const enregistrer = async (changes: Parameters<typeof maj>[0], ok: string) => {
        setSaving(true);
        try {
            const res = await maj(changes);
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || "Erreur lors de la mise à jour");
                return false;
            }
            const updated = await res.json();
            const next = { ...user, username: updated.name ?? user.username, email: updated.email ?? user.email, phone: updated.phone ?? user.phone };
            localStorage.setItem("user", JSON.stringify(next));
            setUser(next);
            toast.success(ok);
            return true;
        } catch {
            toast.error("Erreur réseau");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const submitInfos = async (e: FormEvent) => {
        e.preventDefault();
        if (!editInfos) return setEditInfos(true);
        const name = `${infos.prenom} ${infos.nom}`.trim();
        if (await enregistrer({ name, email: infos.email, phone: infos.phone }, "Profil mis à jour avec succès !")) setEditInfos(false);
    };

    const submitExpl = (e: FormEvent) => {
        e.preventDefault();
        if (!editExpl) return setEditExpl(true);
        localStorage.setItem("exploitation", JSON.stringify(expl));
        setEditExpl(false);
        toast.success("Informations de l'exploitation enregistrées.");
    };

    const submitPwd = async (e: FormEvent) => {
        e.preventDefault();
        if (pwd.password.length < 8) return toast.error("Le mot de passe doit contenir au moins 8 caractères.");
        if (pwd.password !== pwd.confirm) return toast.error("Les mots de passe ne correspondent pas");
        if (await enregistrer({ password: pwd.password }, "Mot de passe modifié.")) {
            setPwd({ password: "", confirm: "" });
            setShowPwd(false);
        }
    };

    const toggleNotif = (id: string) => {
        const next = { ...notifs, [id]: !notifs[id] };
        setNotifs(next);
        localStorage.setItem("notifications", JSON.stringify(next));
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#f7f6fe] dark:bg-background">Chargement...</div>;
    }

    return (
        <>
            <Navbar />
            <main className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background text-[#14233c] dark:text-white font-['Poppins',sans-serif]">
                <div className="dark:hidden pointer-events-none absolute -left-[35%] top-[15%] h-[85%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(255,204,0,0.9),rgba(247,246,254,0))]" />
                <div className="dark:hidden pointer-events-none absolute -right-[20%] top-[10%] h-[45%] w-[55%] rotate-[36deg] rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />

                <div className="relative container mx-auto px-4 md:px-6 md:[zoom:0.8] pt-32 md:pt-36 pb-24">
                    {/* En-tête */}
                    <Card className={`${carte} flex max-w-[790px] items-center gap-5 px-6 py-5 md:gap-[17px] md:px-9`}>
                        <img src="/images/profil/avatar.jpg" alt="" className="size-[77px] shrink-0 rounded-full object-cover" />
                        <div>
                            <h1 className="text-[22px] leading-tight md:text-[32px]">Mon espace personnel</h1>
                            <p className="mt-1 text-sm md:text-base">Gérez vos informations personnelles et celles de votre exploitation.</p>
                        </div>
                    </Card>

                    <div className="mt-12 grid items-start gap-8 md:grid-cols-2 xl:grid-cols-[301fr_511fr_301fr] xl:gap-11">
                        {/* Colonne gauche */}
                        <div className="flex flex-col gap-8">
                            <Card className={`${carte} px-6 pb-8 pt-7 md:px-[54px]`}>
                                <h2 className="text-2xl leading-[26px]">Mes informations</h2>
                                <form onSubmit={submitInfos} className="mt-8 flex flex-col gap-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <Etiquette id="nom">Nom</Etiquette>
                                            <input id="nom" autoComplete="family-name" disabled={!editInfos} value={infos.nom} onChange={(e) => setInfos({ ...infos, nom: e.target.value })} className={champ} />
                                        </div>
                                        <div>
                                            <Etiquette id="prenom">Prénom</Etiquette>
                                            <input id="prenom" autoComplete="given-name" disabled={!editInfos} value={infos.prenom} onChange={(e) => setInfos({ ...infos, prenom: e.target.value })} className={champ} />
                                        </div>
                                    </div>
                                    <div>
                                        <Etiquette id="email">Email</Etiquette>
                                        <input id="email" type="email" autoComplete="email" disabled={!editInfos} value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} className={champ} />
                                    </div>
                                    <div>
                                        <Etiquette id="phone">Téléphone</Etiquette>
                                        <input id="phone" type="tel" autoComplete="tel" disabled={!editInfos} value={infos.phone} onChange={(e) => setInfos({ ...infos, phone: e.target.value })} className={champ} />
                                    </div>
                                    <BoutonModifier editing={editInfos} saving={saving} />
                                </form>
                            </Card>

                            <Card className={`${carte} px-6 pb-8 pt-7 md:px-[54px]`}>
                                <h2 className="text-2xl leading-[26px]">Mes documents</h2>
                                <ul className="mt-8 flex flex-col gap-[23px]">
                                    {DOCUMENTS.map((d) => (
                                        <li key={d} className="flex items-center gap-4 text-[15px] font-light">
                                            <span aria-hidden className="relative block h-[31px] w-[23px] shrink-0 overflow-hidden">
                                                <img src="/images/dashboard/icones.png" alt="" className="absolute max-w-none" style={ICONE_DOC} />
                                            </span>
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                                {/* ponytail: pas d'API d'upload pour l'instant */}
                                <button type="button" onClick={() => toast.info("L'ajout de documents arrive bientôt.")} className={`${bouton} mt-8`}>
                                    <span aria-hidden className="text-xl leading-none">+</span> Ajouter des documents
                                </button>
                            </Card>
                        </div>

                        {/* Colonne centrale */}
                        <div className="overflow-hidden rounded-2xl border-[3px] border-[#14233c] bg-white shadow-[0_1px_10px_rgba(0,0,0,0.2)] dark:border-white/30 dark:bg-slate-800">
                            <h2 className="flex h-[91px] items-center bg-[#0f172a] px-6 text-2xl text-white md:px-[54px]">Mon exploitation</h2>
                            <form onSubmit={submitExpl} className="flex flex-col gap-5 px-6 pb-8 pt-7 md:px-[51px]">
                                <div>
                                    <Etiquette id="nomExploitation">Nom de l'exploitation</Etiquette>
                                    <input id="nomExploitation" disabled={!editExpl} value={expl.nomExploitation} onChange={(e) => setExpl({ ...expl, nomExploitation: e.target.value })} className={champLarge} />
                                </div>
                                <div>
                                    <Etiquette id="forme">Forme juridique</Etiquette>
                                    <Liste id="forme" valeur={expl.forme} options={FORMES} disabled={!editExpl} onChange={(v) => setExpl({ ...expl, forme: v })} />
                                </div>
                                <div>
                                    <Etiquette id="siret">SIRET</Etiquette>
                                    <input id="siret" inputMode="numeric" maxLength={14} disabled={!editExpl} value={expl.siret} onChange={(e) => setExpl({ ...expl, siret: e.target.value.replace(/\D/g, "") })} className={champLarge} />
                                </div>
                                <div>
                                    <Etiquette id="sau">Surface agricole utile (SAU)</Etiquette>
                                    <input id="sau" inputMode="decimal" placeholder="xx ha" disabled={!editExpl} value={expl.sau} onChange={(e) => setExpl({ ...expl, sau: e.target.value.replace(",", ".") })} className={champLarge} />
                                </div>
                                <div>
                                    <Etiquette id="production">Type de production</Etiquette>
                                    <Liste id="production" valeur={expl.production} options={PRODUCTIONS} vide="élevages, céréales, etc" disabled={!editExpl} onChange={(v) => setExpl({ ...expl, production: v })} />
                                </div>
                                <div>
                                    <Etiquette id="region">Région/Département</Etiquette>
                                    <input id="region" disabled={!editExpl} value={expl.region} onChange={(e) => setExpl({ ...expl, region: e.target.value })} className={champLarge} />
                                </div>
                                <div className="mx-auto mt-3 flex w-full max-w-[358px] flex-col items-center gap-3">
                                    <BoutonModifier editing={editExpl} />
                                    <p className="text-center text-[13px] font-light">Ces données servent à déterminer les aides disponibles</p>
                                </div>
                            </form>
                        </div>

                        {/* Colonne droite */}
                        <div className="grid items-start gap-8 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
                            <Card className={`${carte} px-6 pb-7 pt-7 md:px-[18px]`}>
                                <h2 className="text-2xl leading-[26px] md:pl-9">Mes notifications</h2>
                                <ul className="mt-6 flex flex-col gap-1.5">
                                    {NOTIFS.map((n) => (
                                        <li key={n.id}>
                                            <label className="flex cursor-pointer items-center gap-2 text-[15px] font-medium">
                                                <input type="checkbox" checked={notifs[n.id]} onChange={() => toggleNotif(n.id)} className="peer sr-only" />
                                                <span className="relative block size-[34px] shrink-0 rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                                                    <img src="/images/profil/coche.png" alt="" aria-hidden className={`size-full object-cover dark:invert ${notifs[n.id] ? "" : "opacity-30"}`} />
                                                </span>
                                                {n.label}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className={`${carte} px-6 pb-8 pt-7 md:px-6 xl:px-6`}>
                                <h2 className="text-2xl leading-[26px]">Gestion du compte</h2>
                                <div className="mt-6 flex flex-col gap-3">
                                    <button type="button" onClick={() => setShowPwd((s) => !s)} aria-expanded={showPwd} className={`${boutonContour} border-primary text-[#0f1729] dark:text-white`}>
                                        Modifier le mot de passe
                                    </button>
                                    {showPwd && (
                                        <form onSubmit={submitPwd} className="flex flex-col gap-3">
                                            <input type="password" aria-label="Nouveau mot de passe" autoComplete="new-password" placeholder="Nouveau mot de passe" value={pwd.password} onChange={(e) => setPwd({ ...pwd, password: e.target.value })} className={champ} />
                                            <input type="password" aria-label="Confirmer le mot de passe" autoComplete="new-password" placeholder="Confirmer" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={champ} />
                                            <button type="submit" disabled={saving} className={bouton}>Valider</button>
                                        </form>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setEditInfos(true); document.getElementById("email")?.focus(); }}
                                        className={`${boutonContour} border-primary text-[#0f1729] dark:text-white`}
                                    >
                                        Modifier l'email
                                    </button>
                                    {/* ponytail: pas d'endpoint de suppression, on renvoie vers le contact */}
                                    <Link href="/contact" className={`${boutonContour} border-[#dc2626] text-[#e5504b]`}>
                                        Supprimer mon compte
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
