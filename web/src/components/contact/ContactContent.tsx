"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import UnderNavbar from "@/components/ui/under_navbar";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrgnkdqj";

// Champs "pilule" réutilisés dans les deux formulaires (fidèle à la maquette Figma).
const pillBase =
    "w-full h-[53px] rounded-full bg-[#f4faff] dark:bg-slate-900 border border-slate-400 dark:border-slate-700 px-6 text-base text-foreground placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition";

// Surligneur façon feutre (jaune = accent principal, bleu = accent doux).
function Highlight({
    children,
    variant = "yellow",
}: {
    children: React.ReactNode;
    variant?: "yellow" | "blue";
}) {
    return (
        <span
            className={cn(
                "rounded-md px-1.5 box-decoration-clone font-semibold",
                variant === "yellow"
                    ? "bg-primary text-[#0f1729]"
                    : "bg-[#deeefc] text-[#0f1729] dark:bg-sky-400/20 dark:text-foreground"
            )}
        >
            {children}
        </span>
    );
}

export default function ContactContent() {
    const [method, setMethod] = useState<"phone" | "video">("phone");

    return (
        <div className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background">
            {/* Halo jaune décoratif en bas à droite (fidèle au dégradé radial de la maquette) */}
            <div
                aria-hidden
                className="pointer-events-none absolute -z-0 right-[-15%] bottom-[8%] h-[520px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.40),rgba(234,179,8,0)_70%)] blur-2xl dark:opacity-40"
            />

            {/* HERO — bannière réutilisable (même composant que la page FAQ) */}
            <UnderNavbar
                imageSrc="/images/contact-hero.png"
                title="Une question ?"
                subtitle="On est là pour vous aider."
                dimensions={{ width: "1439px", height: "392px" }}
                highlightText={["Une question ?"]}
                titleSize="clamp(32px, 7vw, 64px)"
                subtitleSize="clamp(32px, 7vw, 64px)"
                highlightAngle={-1}
            />

            {/* SECTION 1 — Formulaire de contact */}
            <section className="relative container mx-auto px-4 md:px-6 mt-14 md:mt-20">
                <div className="max-w-4xl">
                    <p className="text-lg md:text-2xl leading-relaxed text-foreground">
                        Vous avez <Highlight variant="blue">des questions</Highlight> sur vos
                        démarches administratives&nbsp;?
                        <br />
                        Contactez-nous,{" "}
                        <Highlight variant="yellow">on vous explique tout simplement.</Highlight>
                    </p>

                    <form
                        action={FORMSPREE_ENDPOINT}
                        method="POST"
                        className="mt-8 max-w-2xl space-y-4"
                    >
                        <input type="hidden" name="_subject" value="Nouveau message — Contact Phobee" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input className={pillBase} name="nom" type="text" placeholder="Votre Nom" autoComplete="family-name" required />
                            <input className={pillBase} name="prenom" type="text" placeholder="Votre Prénom" autoComplete="given-name" required />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input className={pillBase} name="telephone" type="tel" placeholder="Téléphone" autoComplete="tel" />
                            <input className={pillBase} name="email" type="email" placeholder="Adresse Email" autoComplete="email" required />
                        </div>
                        <textarea
                            className={cn(pillBase, "h-auto min-h-[180px] rounded-[31px] py-4 resize-y")}
                            name="message"
                            placeholder="Sur quoi souhaitez-vous être aidé ?"
                            required
                        />
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            <button
                                type="submit"
                                className="h-[53px] px-10 rounded-full bg-secondary text-white font-bold text-lg shadow-sm hover:bg-secondary/90 hover:scale-[1.02] transition-all"
                            >
                                Envoyer
                            </button>
                            <span className="italic text-sm text-slate-400">*Réponse sous 24 à 48h</span>
                        </div>
                    </form>
                </div>
            </section>

            {/* SECTION 2 — Prise de rendez-vous (pleine largeur de page) */}
            <section className="relative w-full px-4 md:px-10 lg:px-16 xl:px-24 mt-24 md:mt-28">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                    Parlez directement avec nous
                </h2>
                <p className="text-lg md:text-2xl leading-relaxed text-foreground">
                    En <Highlight variant="blue">15&nbsp;minutes,</Highlight> nous pouvons&nbsp;: répondre à
                    vos questions, vous expliquer comment on vous simplifie la vie, et même{" "}
                    <Highlight variant="yellow">créer votre compte avec vous&nbsp;!</Highlight>
                </p>

                <div className="mt-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Formulaire de réservation */}
                    <form
                        action={FORMSPREE_ENDPOINT}
                        method="POST"
                        className="space-y-4 w-full"
                    >
                        <input type="hidden" name="_subject" value="Demande d'échange — Contact Phobee" />
                        <input type="hidden" name="type_echange" value={method === "phone" ? "Appel téléphonique" : "Visioconférence"} />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input className={pillBase} name="nom" type="text" placeholder="Votre Nom" autoComplete="family-name" required />
                            <input className={pillBase} name="prenom" type="text" placeholder="Votre Prénom" autoComplete="given-name" required />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input className={pillBase} name="telephone" type="tel" placeholder="Téléphone" autoComplete="tel" required />
                            <input className={pillBase} name="email" type="email" placeholder="Adresse Email" autoComplete="email" required />
                        </div>
                        <textarea
                            className={cn(pillBase, "h-auto min-h-[90px] rounded-[31px] py-4 resize-y")}
                            name="besoin"
                            placeholder="Décrivez rapidement votre besoin"
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <label className={cn(pillBase, "flex items-center gap-2 cursor-text")}>
                                <span className="text-slate-400 whitespace-nowrap">Date&nbsp;:</span>
                                <input
                                    type="date"
                                    name="date"
                                    className="flex-1 bg-transparent text-primary font-semibold focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </label>
                            <label className={cn(pillBase, "flex items-center gap-2")}>
                                <span className="text-slate-400 whitespace-nowrap">Horaire&nbsp;:</span>
                                <select
                                    name="horaire"
                                    defaultValue="12:00 - 12:30"
                                    className="flex-1 bg-transparent text-primary font-semibold focus:outline-none cursor-pointer"
                                >
                                    <option>09:00 - 09:30</option>
                                    <option>10:00 - 10:30</option>
                                    <option>11:00 - 11:30</option>
                                    <option>12:00 - 12:30</option>
                                    <option>14:00 - 14:30</option>
                                    <option>15:00 - 15:30</option>
                                    <option>16:00 - 16:30</option>
                                    <option>17:00 - 17:30</option>
                                </select>
                            </label>
                        </div>

                        {/* Choix du mode d'échange */}
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                            {([
                                { key: "phone", label: "Appel téléphonique" },
                                { key: "video", label: "Visioconférence" },
                            ] as const).map((opt) => {
                                const active = method === opt.key;
                                return (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => setMethod(opt.key)}
                                        className="flex items-center gap-2 group"
                                        aria-pressed={active}
                                    >
                                        <span
                                            className={cn(
                                                "flex items-center justify-center size-6 rounded-[5px] border transition-colors",
                                                active
                                                    ? "bg-primary border-primary text-[#0f1729]"
                                                    : "bg-[#f1f5f9] dark:bg-slate-800 border-slate-400 dark:border-slate-600"
                                            )}
                                        >
                                            {active && <Check className="size-4" strokeWidth={3} />}
                                        </span>
                                        <span className="text-[#14233c] dark:text-foreground">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            <button
                                type="submit"
                                className="h-[53px] px-8 rounded-full bg-secondary text-white font-bold text-lg shadow-sm hover:bg-secondary/90 hover:scale-[1.02] transition-all"
                            >
                                Réserver un échange gratuit
                            </button>
                            <span className="italic text-sm text-slate-400">
                                *Nous vous appelons à l&apos;heure choisie
                            </span>
                        </div>
                    </form>

                    {/* Visuel avec carte décalée navy */}
                    <div className="relative mx-auto lg:mx-0 w-full max-w-[360px] aspect-[353/376]">
                        <div className="absolute inset-0 translate-x-5 translate-y-4 rounded-[20px] bg-[#14233c]" />
                        <img
                            src="/images/contact-call.png"
                            alt="Un conseiller Phobee au téléphone"
                            className="relative size-full object-cover rounded-[20px] shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 3 — CTA FAQ */}
            <section className="relative container mx-auto px-4 md:px-6 mt-24 mb-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                    Vous avez des questions&nbsp;?
                </h2>
                <Link
                    href="/faq"
                    className="inline-flex h-11 items-center px-8 rounded-full bg-primary text-[#0f1729] font-semibold shadow-sm hover:bg-[#FFC000] hover:scale-105 transition-all"
                >
                    Consulter la FAQ
                </Link>
            </section>
        </div>
    );
}
