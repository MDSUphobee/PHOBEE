"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import UnderNavbar from "@/components/ui/under_navbar";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Definition {
    term: string;
    definition: string;
}

interface LetterSection {
    letter: string;
    definitions: Definition[];
}

const DICTIONARY_DATA: LetterSection[] = [
    {
        letter: "A",
        definitions: [
            { term: "Abattement", definition: "Une réduction automatique qu'appliquent les impôts sur ton chiffre d'affaires pour estimer tes frais pro. En gros, ils font semblant que tu as gagné moins pour te taxer moins." },
            { term: "Acompte", definition: "Une partie de la somme (souvent 30%) que ton client te paie avant que tu commences le travail. Toujours utile pour sécuriser la mission !" },
            { term: "ACRE", definition: "Le super bonus de début. C'est une aide qui réduit tes cotisations sociales de 50% pendant ta première année (environ 11% au lieu de 22%)." },
            { term: "Activité mixte", definition: "Quand tu fais à la fois de la vente d'objets et du service (ex: un plombier qui vend le robinet et facture la pose)." },
            { term: "ARCE", definition: "Une aide de Pôle Emploi. Au lieu de toucher ton chômage tous les mois, ils te versent une grosse somme (60% de tes droits restants) en deux fois pour lancer ta boite." },
            { term: "ARE", definition: "L'Allocation de Retour à l'Emploi. C'est le nom technique de tes indemnités chômage mensuelles." },
            { term: "Assujetti à la TVA", definition: "Le moment où tu dois commencer à facturer la TVA à tes clients (quand tu dépasses les seuils)." },
            { term: "Avenant", definition: "Une modification d'un contrat ou d'un devis déjà signé. \"On change une règle en cours de route\"." },
            { term: "Ayant droit", definition: "Tes enfants ou ton conjoint s'ils sont rattachés à ta carte vitale." },
        ]
    },
    {
        letter: "B",
        definitions: [
            { term: "Bénéfice", definition: "Ce qu'il te reste dans la poche une fois que tu as payé toutes tes charges et tes frais. (Attention : en micro, on te taxe sur le CA, pas le bénéfice !)." },
            { term: "BIC", definition: "Bénéfices Industriels et Commerciaux. La catégorie d'impôt pour les commerçants et artisans." },
            { term: "BNC", definition: "Bénéfices Non Commerciaux. La catégorie d'impôt pour les professions libérales (consultants, graphistes, dév...)." },
        ]
    },
    {
        letter: "C",
        definitions: [
            { term: "CA (Chiffre d'Affaires)", definition: "La somme totale de toutes tes factures encaissées. C'est le chiffre sacré à déclarer à l'URSSAF." },
            { term: "Cessation d'activité", definition: "Fermer ta micro-entreprise." },
            { term: "CFE (Cotisation Foncière)", definition: "La \"taxe d'habitation\" de ton entreprise. À payer chaque année en décembre (sauf la première année civile où tu es exonéré !)." },
            { term: "CGV (Conditions Générales de Vente)", definition: "Le document (souvent écrit en tout petit) qui définit tes règles : délais de paiement, pénalités, etc. Obligatoire pour la vente aux particuliers." },
            { term: "CIPAV", definition: "La caisse de retraite pour certaines professions libérales (architectes, moniteurs de ski...). La plupart des autres sont au régime général maintenant." },
            { term: "Code APE (ou NAF)", definition: "Un code de 4 chiffres et 1 lettre (ex: 6201Z) qui dit à l'État quel est ton métier principal." },
            { term: "Compte bancaire dédié", definition: "Un compte séparé de ton compte perso pour tes activités pro. Pas obligé d'être un compte \"Professionnel\" payant, un compte courant classique suffit." },
            { term: "Cotisations Sociales", definition: "L'argent que tu verses à l'URSSAF. Ça paie ta sécu, ta retraite, tes allocations familiales." },
        ]
    },
    {
        letter: "D",
        definitions: [
            { term: "Date d'échéance", definition: "La date limite pour payer (une facture ou une cotisation). Après cette date, les ennuis (ou pénalités) commencent." },
            { term: "Débours", definition: "Quand tu achètes quelque chose pour le compte exact de ton client (ex: un nom de domaine) et qu'il te rembourse l'euro près. Ça ne compte pas dans ton CA." },
            { term: "Déclaration de CA", definition: "Le rituel mensuel ou trimestriel où tu dis à l'URSSAF combien tu as gagné." },
            { term: "Devis", definition: "Une proposition de prix écrite. Une fois signé par le client, ça devient un contrat officiel." },
            { term: "Domiciliation", definition: "L'adresse officielle de ton entreprise (souvent chez toi au début)." },
        ]
    },
    {
        letter: "E",
        definitions: [
            { term: "Exercice comptable", definition: "Ton année de travail. Pour les micro-entrepreneurs, c'est simple : du 1er janvier au 31 décembre." },
            { term: "Exigibilité", definition: "Le moment où une taxe ou une somme doit être payée." },
        ]
    },
    {
        letter: "F",
        definitions: [
            { term: "Facture", definition: "La preuve d'achat. Obligatoire entre professionnels. Elle doit comporter des mentions légales précises (ton SIRET, la mention TVA, etc.)." },
            { term: "Frais professionnels", definition: "Tes dépenses (ordi, essence, resto). En micro-entreprise, tu ne peux pas les déduire de tes impôts, mais c'est bien de les suivre pour savoir si tu es rentable." },
            { term: "Franchise en base de TVA", definition: "Le régime magique des micro-entrepreneurs qui permet de ne pas facturer la TVA. Tu es 20% moins cher que les grosses boites !" },
        ]
    },
    {
        letter: "G",
        definitions: [
            { term: "Guichet Unique", definition: "Le nouveau site internet de l'INPI (depuis 2023) où l'on doit faire toutes les démarches de création et modification d'entreprise." },
        ]
    },
    {
        letter: "I",
        definitions: [
            { term: "Immatriculation", definition: "L'acte de naissance de ton entreprise. C'est ce qui te donne ton numéro SIRET." },
            { term: "Impôt sur le Revenu (IR)", definition: "L'impôt annuel sur ce que tu gagnes." },
            { term: "Indemnités kilométriques", definition: "Un barème pour calculer ce que coûte l'utilisation de ta voiture perso pour le travail." },
        ]
    },
    {
        letter: "K",
        definitions: [
            { term: "KBIS", definition: "La carte d'identité de ton entreprise (pour les commerçants). Pour les artisans, c'est l'extrait D1. C'est la preuve que tu existes." },
        ]
    },
    {
        letter: "L",
        definitions: [
            { term: "Livre des recettes", definition: "Un cahier (ou fichier Excel) obligatoire où tu notes chronologiquement tout ce que tu gagnes (Date, Client, Montant, Mode de paiement)." },
        ]
    },
    {
        letter: "M",
        definitions: [
            { term: "Majoration", definition: "La punition si tu paies en retard (+5% ou +10% sur la somme due)." },
            { term: "Mentions obligatoires", definition: "Les infos qui doivent absolument figurer sur tes factures (SIRET, date, \"TVA non applicable...\", etc.)." },
            { term: "Mensuel / Trimestriel", definition: "Le rythme auquel tu as choisi de payer tes charges." },
        ]
    },
    {
        letter: "N",
        definitions: [
            { term: "Note de frais", definition: "Un document qui justifie une dépense pro payée avec ton argent perso." },
        ]
    },
    {
        letter: "P",
        definitions: [
            { term: "Plafond de CA", definition: "La limite à ne pas dépasser pour rester micro-entrepreneur (environ 77k€ pour les services, 188k€ pour la vente)." },
            { term: "Prélèvement libératoire", definition: "Une option qui te permet de payer ton impôt sur le revenu en même temps que tes cotisations sociales (un petit % en plus chaque mois), pour ne pas avoir de surprise à la fin de l'année." },
            { term: "Prestation de service", definition: "Quand tu vends ton temps ou ton savoir-faire (pas un objet physique)." },
        ]
    },
    {
        letter: "R",
        definitions: [
            { term: "Radiation", definition: "La suppression de ton entreprise des registres officiels." },
            { term: "RC Pro (Responsabilité Civile Professionnelle)", definition: "Une assurance qui te couvre si tu casses quelque chose chez un client ou si tu fais une grosse erreur. Obligatoire pour certains métiers (BTP, santé), recommandée pour les autres." },
            { term: "Recouvrement", definition: "L'action d'aller réclamer l'argent qu'on te doit." },
        ]
    },
    {
        letter: "S",
        definitions: [
            { term: "Seuils de TVA", definition: "Le montant de CA (environ 36 800€ en service) à partir duquel tu perds la franchise et dois commencer à facturer la TVA." },
            { term: "SIE (Service des Impôts des Entreprises)", definition: "Ton interlocuteur pour la CFE et la TVA. Ce ne sont pas les mêmes gens que pour tes impôts perso !" },
            { term: "SIREN", definition: "Ton numéro d'identification à 9 chiffres (il ne change jamais)." },
            { term: "SIRET", definition: "Ton numéro SIREN + 5 chiffres qui identifient ton adresse (il change si tu déménages)." },
            { term: "SSI (Sécurité Sociale des Indépendants)", definition: "C'est ta sécu. Avant c'était le RSI (l'enfer), maintenant c'est rattaché au régime général (comme les salariés), c'est beaucoup mieux." },
        ]
    },
    {
        letter: "T",
        definitions: [
            { term: "Taux de cotisation", definition: "Le pourcentage de ton CA que l'URSSAF te prend. (Environ 12.3% pour la vente, 21.2% pour les services)." },
            { term: "Télédéclaration", definition: "Faire ses papiers sur internet au lieu de par courrier. C'est obligatoire maintenant." },
            { term: "TVA non applicable", definition: "La phrase magique à écrire sur tes factures tant que tu es en dessous des seuils : \"TVA non applicable, art. 293 B du CGI\"." },
        ]
    }
];

const LETTRES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [lettre, setLettre] = useState("A");

    const q = searchTerm.trim().toLowerCase();
    // Recherche : on cherche dans toutes les lettres ; sinon on affiche la lettre choisie.
    const definitions = DICTIONARY_DATA
        .filter((s) => q || s.letter === lettre)
        .flatMap((s) => s.definitions)
        .filter((d) => !q || d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q));

    return (
        <>
            <Navbar />
            <UnderNavbar
                imageSrc="/images/dictionnaire-hero.jpg"
                title="Le lexique administratif,"
                subtitle="sans prise de tête"
                dimensions={{ width: "1439px", height: "392px" }}
                highlightText={["sans prise de tête"]}
                titleSize="clamp(32px, 7vw, 64px)"
                subtitleSize="clamp(32px, 7vw, 64px)"
                highlightAngle={-1}
                showSearch
                searchPlaceholder="Rechercher un mot..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <main className="relative overflow-hidden bg-[#f7f6fe] dark:bg-background font-['Poppins',sans-serif] text-[#0f172a] dark:text-white">
                <div className="dark:hidden pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#deeefc,transparent)] blur-[32px]" />
                <div className="relative mx-auto max-w-[830px] px-4 md:px-6 md:[zoom:0.8] pt-8 pb-24">
                    <Breadcrumb items={[{ label: "Dictionnaire de l'entrepreneur" }]} className="mb-8" />
                    <p className="text-xl font-light leading-7">Trier par :</p>
                    <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-x-3 gap-y-3 md:grid-cols-[repeat(13,48px)] md:justify-between" role="group" aria-label="Filtrer par lettre">
                        {LETTRES.map((l) => {
                            const vide = !DICTIONARY_DATA.some((s) => s.letter === l);
                            const actif = !q && l === lettre;
                            return (
                                <button
                                    key={l}
                                    type="button"
                                    disabled={vide}
                                    aria-pressed={actif}
                                    onClick={() => { setSearchTerm(""); setLettre(l); }}
                                    className={`aspect-square w-full rounded-xl font-['Gowun_Dodum',sans-serif] text-2xl shadow-[0_10px_15px_-3px_rgba(234,179,8,0.2),0_4px_6px_-4px_rgba(234,179,8,0.2)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${
                                        actif ? "bg-[#14233c] text-white dark:bg-white dark:text-[#14233c]" : "bg-primary text-[#0f172a]"
                                    }`}
                                >
                                    {l}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex flex-col gap-6">
                        {definitions.length === 0 ? (
                            <p className="py-12 text-center text-lg">Aucune définition trouvée pour "{searchTerm}".</p>
                        ) : (
                            definitions.map((d) => (
                                <article key={d.term} className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <h2 className="text-xl tracking-[-0.01em]">{d.term}</h2>
                                    <p className="mt-3 font-['Gowun_Dodum',sans-serif] text-base leading-[26px] text-[#475569]">{d.definition}</p>
                                </article>
                            ))
                        )}
                    </div>

                    <section className="flex flex-col items-center pt-24 text-center">
                        <h2 className="text-[28px] leading-[1.25] text-[#14233c] dark:text-white md:text-[40px] md:leading-[52px]">Vous avez d'autres questions ?</h2>
                        <Link href="/faq" className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-primary px-10 text-lg font-medium text-[#0f1729] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                            Consulter toute la FAQ
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
