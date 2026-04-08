"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, ArrowLeft, Sprout } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import aidesData from "@/data/aides-agricoles.json";

interface Answer {
  questionId: string;
  value: string;
}

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
  const [selectedStatut, setSelectedStatut] = useState<string | null>(null);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (!answersParam) {
      router.push("/questionnaire");
      return;
    }

    try {
      const answers: Answer[] = JSON.parse(decodeURIComponent(answersParam));
      const statutAnswer = answers.find((a) => a.questionId === "statut");
      if (statutAnswer) {
        setSelectedStatut(statutAnswer.value);
      }
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
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* En-tête */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Sprout className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
          >
            Vos Aides Éligibles
          </motion.h1>

          {selectedStatut && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4"
            >
              <p className="text-sm text-muted-foreground">
                Statut : <span className="font-semibold text-foreground">
                  {aidesData.statuts.find((s) => s.id === selectedStatut)?.nom || selectedStatut}
                </span>
              </p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Voici les aides auxquelles vous pourriez avoir droit selon vos réponses.
            {eligibleAides.length === 0 && (
              <span className="block mt-2 text-base">
                Aucune aide éligible trouvée. Essayez de modifier vos réponses.
              </span>
            )}
          </motion.p>
        </div>

        {/* Liste des aides */}
        {eligibleAides.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {eligibleAides.map((aide, index) => (
              <motion.div
                key={aide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow"
              >
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {aide.nom}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm font-semibold text-primary">
                        {aide.montant}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {aide.description}
                </p>

                {/* Conditions */}
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-1">
                    Critères d'accès :
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aide.conditions}
                  </p>
                </div>

                {/* Documents */}
                <details className="group">
                  <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <FileText className="w-4 h-4" />
                    Documents à préparer
                    <span className="ml-auto text-xs">▼</span>
                  </summary>
                  <ul className="mt-3 space-y-2 pl-6">
                    {aide.documents.map((doc, docIndex) => (
                      <li
                        key={docIndex}
                        className="text-sm text-muted-foreground list-disc"
                      >
                        {doc}
                      </li>
                    ))}
                  </ul>
                </details>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-6">
              Aucune aide éligible trouvée pour le moment.
            </p>
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Recommencer le questionnaire
            </Link>
          </motion.div>
        )}

        {/* Actions */}
        {eligibleAides.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/questionnaire?mode=edit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Modifier mes réponses
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              Contacter un conseiller
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function ResultatsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
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
