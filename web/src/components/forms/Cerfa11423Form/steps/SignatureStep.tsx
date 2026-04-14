import React from 'react';
import { AlertCircle, FileText, ShieldCheck } from 'lucide-react';
import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { Label, Input, Checkbox, StepContainer, FormSection, FormGrid } from '../FormElements';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function SignatureStep({ data, updateData }: StepProps) {
  const handleSignatureChange = (field: keyof Cerfa11423Data['signature'], value: any) => {
    updateData({
      signature: {
        ...(data.signature || {}),
        [field]: value
      }
    });
  };

  return (
    <StepContainer>
      <FormSection title="Validation et Signature">
        <div className="space-y-8">
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <ShieldCheck className="text-primary shrink-0 mt-1" size={24} />
            <p className="text-sm leading-relaxed">
              Veuillez vérifier vos informations. En signant ce formulaire, vous certifiez sur l'honneur l'exactitude des renseignements fournis.
            </p>
          </div>
          
          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor="doneAt">Fait à</Label>
              <Input
                id="doneAt"
                value={data.signature?.doneAt || ''}
                onChange={(e) => handleSignatureChange('doneAt', e.target.value)}
                placeholder="Ville du signataire"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doneDate">Le</Label>
              <Input
                id="doneDate"
                type="date"
                value={data.signature?.doneDate || ''}
                onChange={(e) => handleSignatureChange('doneDate', e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="doneNomSurnameQualityAddress">Nom, prénom et qualité du signataire</Label>
              <Input
                id="doneNomSurnameQualityAddress"
                value={data.signature?.doneNomSurnameQualityAddress || ''}
                onChange={(e) => handleSignatureChange('doneNomSurnameQualityAddress', e.target.value)}
                placeholder="Ex: M. MARTIN Jean, Demandeur principal"
              />
            </div>
          </FormGrid>
        </div>
      </FormSection>

      <div className="space-y-6">
        <Checkbox
          label="Je certifie sur l'honneur l'exactitude des informations fournies."
          checked={data.signature?.signed || false}
          onChange={(val) => handleSignatureChange('signed', val)}
          className="p-6 border-2 border-primary/20 bg-primary/5 rounded-[2rem]"
        />
        
        <div className="flex items-start gap-3 px-6 text-[11px] text-muted-foreground italic">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <p>
            L'article 441-1 du code pénal punit la fraude ou la fausse déclaration de peines allant jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-transparent border-2 border-dashed border-primary/20 rounded-[3rem]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FileText size={120} />
        </div>
        <FileText size={48} className="text-primary mb-4 opacity-50" />
        <h4 className="font-bold text-xl mb-2">Prêt pour l'envoi</h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Une fois généré, vous pourrez visualiser ou télécharger votre document final.
        </p>
      </div>
    </StepContainer>
  );
}
