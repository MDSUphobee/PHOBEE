'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, ChevronRight, ChevronLeft, CheckCircle2, FileText, Download, Eye, RotateCcw } from 'lucide-react';
import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { cerfa11423Config } from '@/lib/pdf/cerfa_11423';
import { generatePdf } from '@/lib/pdf/pdf-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sub-components
import ProfileStep from '@/components/forms/Cerfa11423Form/steps/ProfileStep';
import AddressStep from '@/components/forms/Cerfa11423Form/steps/AddressStep';
import FamilyStep from '@/components/forms/Cerfa11423Form/steps/FamilyStep';
import ChildrenStep from '@/components/forms/Cerfa11423Form/steps/ChildrenStep';
import ProfessionalStep from '@/components/forms/Cerfa11423Form/steps/ProfessionalStep';
import SignatureStep from '@/components/forms/Cerfa11423Form/steps/SignatureStep';

const STEPS = [
  { id: 'profile', title: 'Profil' },
  { id: 'address', title: 'Logement' },
  { id: 'family', title: 'Famille' },
  { id: 'children', title: 'Enfants' },
  { id: 'professional', title: 'Professionnel' },
  { id: 'signature', title: 'Signature' },
];

const INITIAL_DATA: Cerfa11423Data = {
  asking: { gender: 'man', nationality: 'french' },
  address: {},
  relations: {},
  livingSituation: {},
  children: [],
  signature: {},
};

export default function Cerfa11423Form() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Cerfa11423Data>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const updateFormData = (stepData: Partial<Cerfa11423Data>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Génération du CERFA en cours...');

    try {
      const result = await generatePdf(cerfa11423Config, formData, true);
      
      if (result.success && result.data?.url) {
        toast.success('Document généré !', { id: toastId });
        setPdfUrl(result.data.url);
        setIsCompleted(true);
      } else {
        throw new Error('URL du PDF manquante dans la réponse');
      }
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de l\'envoi du formulaire.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'cerfa_11423.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (pdfUrl) window.open(pdfUrl, '_blank');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProfileStep data={formData} updateData={updateFormData} />;
      case 1:
        return <AddressStep data={formData} updateData={updateFormData} />;
      case 2:
        return <FamilyStep data={formData} updateData={updateFormData} />;
      case 3:
        return <ChildrenStep data={formData} updateData={updateFormData} />;
      case 4:
        return <ProfessionalStep data={formData} updateData={updateFormData} />;
      case 5:
        return <SignatureStep data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      {!isCompleted && (
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3"
          >
            <FileText size={24} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Génération CERFA 11423</h1>
          <p className="text-muted-foreground mt-2">Déclaration de situation pour les prestations familiales et les aides au logement</p>
        </div>
      )}

      {/* Progress Indicator */}
      {!isCompleted && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10" />
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center group">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    index <= currentStep 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'bg-background border-muted text-muted-foreground'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                  }}
                >
                  {index < currentStep ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <span className={`absolute -bottom-7 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="p-6 sm:p-10"
              >
                <h2 className="text-2xl font-bold mb-8 text-foreground/90">
                  {STEPS[currentStep].title}
                </h2>
                
                <div className="min-h-[400px]">
                  {renderStep()}
                </div>

                <div className="mt-12 flex justify-between items-center pt-6 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isSubmitting}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>
                  
                  <Button 
                    onClick={handleNext} 
                    disabled={isSubmitting}
                    className="px-8 shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : currentStep === STEPS.length - 1 ? (
                      'Générer le PDF'
                    ) : (
                      <>
                        Suivant
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-500/20">
                  <CheckCircle2 size={32} />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Document Prêt !</h2>
                <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
                  Votre CERFA 11423 a été généré avec succès. Que souhaitez-vous faire maintenant ?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 h-14 text-lg border-2 hover:bg-primary/5 transition-all"
                    onClick={handleView}
                  >
                    <Eye size={20} />
                    Visualiser
                  </Button>
                  <Button 
                    size="lg" 
                    className="gap-2 h-14 text-lg shadow-lg shadow-primary/20 transition-all"
                    onClick={handleDownload}
                  >
                    <Download size={20} />
                    Télécharger
                  </Button>
                </div>

                <button 
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentStep(0);
                    setPdfUrl(null);
                  }}
                  className="mt-10 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw size={14} />
                  Recommencer une saisie
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {!isCompleted && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Toutes vos données sont traitées de manière sécurisée pour la génération de votre CERFA 11423.
        </p>
      )}
    </div>
  );
}
