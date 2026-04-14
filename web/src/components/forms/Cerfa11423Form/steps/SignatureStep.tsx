import React from 'react';

import { AlertCircle, FileText } from 'lucide-react';
import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { Label, Input, SectionTitle, Checkbox } from '../FormElements';

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
    <div className="animate-in fade-in duration-500 space-y-10">
      <div>
        <SectionTitle>Validation et Signature</SectionTitle>
        <p className="text-sm text-muted-foreground mb-8">
          Veuillez vérifier les informations saisies avant de générer le document PDF. 
          En signant ce formulaire, vous certifiez l'exactitude des renseignements fournis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="doneAt">Fait à</Label>
            <Input
              id="doneAt"
              value={data.signature?.doneAt || ''}
              onChange={(e) => handleSignatureChange('doneAt', e.target.value)}
              placeholder="Ex: Paris"
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
              placeholder="Ex: M. MARTIN Jean, Demandeur"
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl space-y-4">
        <Checkbox
          label="Je certifie sur l'honneur l'exactitude des informations fournies."
          checked={data.signature?.signed || false}
          onChange={(val) => handleSignatureChange('signed', val)}
        />
        <div className="flex items-start gap-3 mt-4 text-xs text-muted-foreground bg-background/50 p-4 rounded-lg">
          <AlertCircle size={16} className="text-primary shrink-0" />
          <p>
            L'article 441-1 du code pénal punit la fraude ou la fausse déclaration de peines allant jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-12 border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5">
        <div className="text-center">
          <FileText size={48} className="text-primary mx-auto mb-4 opacity-50" />
          <h4 className="font-semibold text-lg mb-1">Prêt pour la génération</h4>
          <p className="text-sm text-muted-foreground">Cliquez sur le bouton ci-dessous pour créer votre document cerfa_11423.pdf</p>
        </div>
      </div>
    </div>
  );
}
