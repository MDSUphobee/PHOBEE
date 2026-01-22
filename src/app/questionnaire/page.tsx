"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sprout, Building2, Search, X } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import aidesData from "@/data/aides-agricoles.json";

interface Answer {
  questionId: string;
  value: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les questions selon le statut choisi
  const filteredQuestions = useMemo(() => {
    const statutAnswer = answers.find((a) => a.questionId === "statut");
    const selectedStatut = statutAnswer?.value;

    if (!selectedStatut) {
      // Si pas de statut sélectionné, on montre seulement la question de statut
      return aidesData.questions.filter((q) => q.id === "statut");
    }

    // Filtrer les questions selon le statut
    return aidesData.questions.filter((question) => {
      // Toujours montrer la question de statut en premier
      if (question.id === "statut") return true;

      // Vérifier si la question doit être affichée selon le statut
      if (question.showIf && question.showIf.statut) {
        return question.showIf.statut.includes(selectedStatut);
      }

      // Si pas de condition, afficher la question
      return true;
    });
  }, [answers]);

  // S'assurer que currentStep ne dépasse pas le nombre de questions filtrées
  const safeCurrentStep = Math.min(currentStep, filteredQuestions.length - 1);
  const progress = ((safeCurrentStep + 1) / filteredQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    const currentQuestion = filteredQuestions[safeCurrentStep];
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value,
    };

    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );

    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);

    // Si c'est la question de statut, réinitialiser les autres réponses et passer à la question suivante
    if (currentQuestion.id === "statut") {
      setAnswers([newAnswer]);
      setSearchQuery(""); // Réinitialiser la recherche
      // Passer automatiquement à la question suivante après un court délai pour l'animation
      setTimeout(() => {
        if (safeCurrentStep < filteredQuestions.length - 1) {
          setCurrentStep(1); // Passer à la question suivante (index 1 car statut est à l'index 0)
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (safeCurrentStep < filteredQuestions.length - 1) {
      setCurrentStep(safeCurrentStep + 1);
    } else {
      // Rediriger vers la page de résultats avec les réponses
      const answersString = encodeURIComponent(JSON.stringify(answers));
      router.push(`/resultats?answers=${answersString}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = filteredQuestions[safeCurrentStep];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const canProceed = currentAnswer !== undefined;

  // Récupérer les informations du statut sélectionné
  const selectedStatut = answers.find((a) => a.questionId === "statut")?.value;
  const statutInfo = aidesData.statuts.find((s) => s.id === selectedStatut);

  // Filtrer les options de statut selon la recherche
  const filteredStatutOptions = useMemo(() => {
    if (currentQuestion.id !== "statut" || !searchQuery.trim()) {
      return currentQuestion.options;
    }

    const query = searchQuery.toLowerCase().trim();
    return currentQuestion.options.filter((option) => {
      const statut = aidesData.statuts.find((s) => s.id === option.value);
      if (!statut) return false;

      return (
        statut.nom.toLowerCase().includes(query) ||
        statut.categorie.toLowerCase().includes(query) ||
        statut.caracteristiques.toLowerCase().includes(query) ||
        option.label.toLowerCase().includes(query)
      );
    });
  }, [currentQuestion, searchQuery]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Barre de progression */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {safeCurrentStep + 1} sur {filteredQuestions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={safeCurrentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-6">
              {/* Icône */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {currentQuestion.id === "statut" ? (
                    <Building2 className="w-8 h-8 text-primary" />
                  ) : (
                    <Sprout className="w-8 h-8 text-primary" />
                  )}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
                {currentQuestion.question}
              </h2>

              {/* Barre de recherche pour les statuts */}
              {currentQuestion.id === "statut" && (
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher un statut (ex: EARL, GAEC, CUMA...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {searchQuery && filteredStatutOptions.length === 0 && (
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      Aucun statut trouvé pour "{searchQuery}"
                    </p>
                  )}
                </div>
              )}

              {/* Affichage des infos du statut si sélectionné */}
              {currentQuestion.id === "statut" && statutInfo && (
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {statutInfo.nom}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">Catégorie :</span> {statutInfo.categorie}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">Nombre d'associés :</span> {statutInfo.nombreAssocies}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {statutInfo.caracteristiques}
                  </p>
                </div>
              )}

              {/* Options */}
              <div className="space-y-4">
                {(currentQuestion.id === "statut" ? filteredStatutOptions : currentQuestion.options).map((option) => {
                  const isSelected = currentAnswer?.value === option.value;
                  const optionStatut = currentQuestion.id === "statut" 
                    ? aidesData.statuts.find((s) => s.id === option.value)
                    : null;

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleAnswer(option.value);
                        if (currentQuestion.id === "statut") {
                          setSearchQuery(""); // Réinitialiser la recherche après sélection
                        }
                      }}
                      className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-left">
                          <span className="text-lg font-medium text-foreground block">
                            {option.label}
                          </span>
                          {optionStatut && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">{optionStatut.categorie}</span>
                                {" • "}
                                {optionStatut.nombreAssocies} associé{optionStatut.nombreAssocies !== "1" ? "s" : ""}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {optionStatut.caracteristiques}
                              </p>
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 ml-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={safeCurrentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  safeCurrentStep === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Précédent
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
                  canProceed
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    : "opacity-50 cursor-not-allowed bg-slate-300 dark:bg-slate-700"
                }`}
              >
                {safeCurrentStep === filteredQuestions.length - 1 ? "Voir mes résultats" : "Suivant"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
