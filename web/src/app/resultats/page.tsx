"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import UnderNavbar from "@/components/ui/under_navbar";
import aidesData from "@/data/aides-agricoles.json";

interface Answer {
  questionId: string;
  value: string;
}

// Démarches que Phobee peut remplir automatiquement
const DEMARCHES = [
  {
    titre: "Remboursement Accise Énergies",
    cerfa: "Cerfa n°14902*13",
    name: "cerfa_14902",
    texte: "Vous pouvez demander le remboursement d'une partie des taxes sur vos consommations d'énergie.",
    image: "/images/resultats/colza.jpg",
  },
  {
    titre: "Déclaration de Situation Sociale",
    cerfa: "Cerfa n°11423*06",
    name: "cerfa_11423",
    texte: "Cette déclaration est nécessaire pour mettre à jour votre situation auprès des organismes sociaux.",
    image: "/images/resultats/agriculteur.jpg",
  },
];

const BADGES = [
  { src: "/images/badge-modifiable-tout-moment.svg", alt: "Adaptable à tout exploitant" },
  { src: "/images/badge-conforme-exigence.svg", alt: "Conforme aux exigences administratives" },
  { src: "/images/badge-doc-rempli-auto.svg", alt: "Documents pré-remplis" },
];

const carte = "rounded-2xl border border-[#f1f5f9] bg-white dark:border-slate-700 dark:bg-slate-800 p-6 md:p-9 shadow-[0_1px_7.2px_rgba(0,0,0,0.12)]";
const titreCarte = "rounded-2xl border border-[#94a3b8] bg-[#f1f5f9] dark:bg-slate-700 px-6 py-4 shadow-sm";
const bouton = "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-6 text-base md:text-lg font-medium transition-all hover:-translate-y-0.5";

interface Aide {
  id: string;
  nom: string;
  montant: string;
  description: string;
  criteres: Record<string, boolean | undefined>;
  statutsApplicables?: string[];
  documents: string[];
  conditions: string;
}

function ResultatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [eligibleAides, setEligibleAides] = useState<Aide[]>([]);
  const [ouverte, setOuverte] = useState<string | null>(null);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (!answersParam) {
      router.push("/questionnaire");
      return;
    }

    try {
      const answers: Answer[] = JSON.parse(decodeURIComponent(answersParam));
      const aides = calculateEligibleAides(answers);
      setEligibleAides(aides);
    } catch (error) {
      console.error("Error parsing answers:", error);
      router.push("/questionnaire");
    }
  }, [searchParams, router]);

  const calculateEligibleAides = (answers: Answer[]): Aide[] => {
    const eligible: Aide[] = [];

    // Créer un map des réponses pour faciliter l'accès
    const answersMap = new Map(answers.map((a) => [a.questionId, a.value]));
    const selectedStatut = answersMap.get("statut") || null;

    // Parcourir toutes les aides et vérifier les critères
    aidesData.aides.forEach((aide) => {
      // Vérifier d'abord si l'aide est applicable au statut
      if (aide.statutsApplicables && selectedStatut) {
        if (!aide.statutsApplicables.includes(selectedStatut)) {
          return; // Cette aide n'est pas applicable à ce statut
        }
      }

      let isEligible = false;

      // Logique de correspondance basée sur les questions
      switch (aide.id) {
        case "dja":
          // DJA : besoin d'avoir entre 18 et 40 ans
          if (answersMap.get("age") === "oui") {
            isEligible = true;
          }
          break;

        case "pac":
        case "aides-animales":
          // PAC et Aides Animales : besoin d'être cotisant MSA
          if (answersMap.get("cotisantMSA") === "oui") {
            isEligible = true;
          }
          break;

        case "ichn":
          // ICHN : besoin d'être en zone de montagne ou défavorisée
          if (answersMap.get("zoneMontagne") === "oui") {
            isEligible = true;
          }
          break;

        case "ecoregime":
          // Écorégime : besoin d'être en Bio ou HVE
          if (answersMap.get("bioHVE") === "oui") {
            isEligible = true;
          }
          break;

        case "pcoe":
          // PCAE : besoin d'avoir un projet d'investissement
          if (answersMap.get("projetInvestissement") === "oui") {
            isEligible = true;
          }
          break;

        case "aide-cuma":
          // Aide CUMA : besoin d'être en CUMA et avoir un projet d'investissement
          if (selectedStatut === "cuma" && answersMap.get("projetInvestissementCuma") === "oui") {
            isEligible = true;
          }
          break;

        case "aide-transformation":
          // Aide transformation : besoin d'être en SARL/SAS et avoir un projet de transformation
          if (selectedStatut === "sarl-sas" && answersMap.get("projetTransformation") === "oui") {
            isEligible = true;
          }
          break;

        case "aide-associes":
          // Aide associés : besoin d'être en SCEA et vouloir intégrer des associés non-exploitants
          if (selectedStatut === "scea" && answersMap.get("associesNonExploitants") === "oui") {
            isEligible = true;
          }
          break;

        case "aide-foncier":
          // Aide foncier : besoin d'être en GFA et avoir un projet foncier
          if (selectedStatut === "gfa" && answersMap.get("projetFoncier") === "oui") {
            isEligible = true;
          }
          break;

        case "aide-gaec":
          // Aide GAEC : besoin d'être en GAEC et vouloir intégrer un nouvel associé
          if (selectedStatut === "gaec" && answersMap.get("nouvelAssocie") === "oui") {
            isEligible = true;
          }
          break;

        default:
          break;
      }

      if (isEligible) {
        eligible.push(aide);
      }
    });

    return eligible;
  };

  return (
    <>
      <Navbar />
      <UnderNavbar
        imageSrc="/images/fond-marine.svg"
        title="Bonne nouvelle ! Vous êtes éligible à des aides."
        subtitle={"D'après votre situation, vous pouvez bénéficier de plusieurs aides administratives.\nNous pouvons vous accompagner pour les demander simplement."}
        dimensions={{ width: "1100px", height: "280px" }}
        highlightText={["Bonne nouvelle !"]}
        titleSize="clamp(30px, 5.5vw, 56px)"
        subtitleSize="clamp(16px, 2.4vw, 24px)"
        highlightAngle={-1}
      />

      <main id="contenu" className="bg-[#f7f6fe] dark:bg-background font-['Poppins',sans-serif] text-[#14233c] dark:text-white">
        <div className="mx-auto max-w-[1040px] px-4 md:px-6 md:[zoom:0.8] pt-14 pb-24 md:pt-16">
          <h2 className="text-2xl md:text-[32px] leading-tight">Voici les aides que nous pouvons demander à votre place :</h2>

          <div className="mt-10 flex flex-col gap-10">
            {DEMARCHES.map((d) => (
              <article key={d.name} className={`${carte} grid items-center gap-8 md:grid-cols-[1fr_421px]`}>
                <div>
                  <div className={titreCarte}>
                    <h3 className="text-xl md:text-2xl leading-7">{d.titre}</h3>
                    <p className="mt-1 text-base font-normal">({d.cerfa})</p>
                  </div>
                  <p className="mt-6 font-['Gowun_Dodum',sans-serif] text-lg md:text-xl leading-[26px] text-[#475569] dark:text-white/80">{d.texte}</p>
                  <div className="mt-6 flex flex-col items-start gap-4">
                    <Link href={`/radar-aides/formulaire?name=${d.name}`} className={`${bouton} bg-primary text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)]`}>
                      Faire la demande automatiquement
                    </Link>
                    <Link href="/guide" className={`${bouton} bg-[#14233c] text-white dark:border dark:border-white/30`}>
                      Voir plus d'informations
                    </Link>
                  </div>
                </div>
                <img src={d.image} alt="" className="h-[220px] w-full rounded-2xl object-cover md:h-[286px]" />
              </article>
            ))}
          </div>

          {/* ponytail: le badge bleu « Guide étape par étape » n'existe pas encore dans /public/images, à ajouter en tête de liste */}
          <ul className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10" aria-label="Nos garanties">
            {BADGES.map((b) => (
              <li key={b.src}>
                <img src={b.src} alt={b.alt} className="size-[130px] object-contain drop-shadow-md md:size-[170px]" />
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl md:text-[32px] leading-[1.3] md:leading-[42px]">
            D'après votre profil, vous pourriez également être éligible à certaines aides.
            <br className="hidden md:block" /> Pour le moment, nous vous expliquons comment les obtenir simplement.
          </h2>

          {eligibleAides.length > 0 ? (
            <div className="mt-10 flex flex-col gap-10">
              {eligibleAides.map((aide) => {
                const open = ouverte === aide.id;
                return (
                  <article key={aide.id} className={`${carte} grid gap-8 md:grid-cols-[1fr_421px]`}>
                    <div>
                      <div className={titreCarte}>
                        <h3 className="text-xl md:text-2xl leading-7">{aide.nom}</h3>
                      </div>
                      <p className="mt-6 font-['Gowun_Dodum',sans-serif] text-lg md:text-xl leading-[26px] text-[#475569] dark:text-white/80">{aide.description}</p>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOuverte(open ? null : aide.id)}
                        className={`${bouton} mt-6 bg-primary text-[#0f1729] shadow-[0_0_10px_rgba(0,0,0,0.15)]`}
                      >
                        {open ? "Réduire" : "En savoir plus"}
                      </button>
                      {open && (
                        <div className="mt-6 space-y-4 font-['Gowun_Dodum',sans-serif] text-base leading-6">
                          <p><strong className="font-['Poppins',sans-serif] font-semibold">Montant :</strong> {aide.montant}</p>
                          <p><strong className="font-['Poppins',sans-serif] font-semibold">Critères d'accès :</strong> {aide.conditions}</p>
                          <div>
                            <strong className="font-['Poppins',sans-serif] font-semibold">Documents à préparer :</strong>
                            <ul className="mt-1 list-disc pl-6">
                              {aide.documents.map((doc) => <li key={doc}>{doc}</li>)}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    <img src="/images/resultats/plantation.jpg" alt="" className="h-[220px] w-full rounded-2xl object-cover md:h-[286px]" />
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="mt-10 text-lg">
              Aucune autre aide éligible trouvée pour le moment.{" "}
              <Link href="/questionnaire?mode=edit" className="font-semibold underline underline-offset-4">Modifier mes réponses</Link>
            </p>
          )}

          <section className="mt-24 flex flex-col items-center text-center">
            <h2 className="text-[26px] leading-[1.25] md:text-[40px] md:leading-[52px] [text-shadow:0_4px_10px_rgba(0,0,0,0.18)]">Besoin de comprendre avant de vous lancer ?</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/guide" className={`${bouton} border border-black bg-[#deeefc] text-[#0f1729]`}>Comprendre la démarche</Link>
              <Link href="/contact" className={`${bouton} bg-primary text-[#0f1729]`}>Contactez-nous</Link>
              <Link href="/dictionary" className={`${bouton} border border-black bg-[#fff7d7] text-[#0f1729]`}>Accéder au lexique</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ResultatsPage() {
  return (
    <Suspense fallback={
      <main id="contenu" className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos résultats...</p>
        </div>
      </main>
    }>
      <ResultatsContent />
    </Suspense>
  );
}
