import React from 'react';
import { AlertCircle, FileText, ShieldCheck } from 'lucide-react';
import { StepContainer, FormSection, FormGrid } from '../../Cerfa11423Form/FormElements';
import { StepProps, TextField, useSetter } from '../fields';

export default function SignatureStep(props: StepProps) {
  const sig = props.data.signature;
  const set = useSetter(props);

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
            <TextField id="sig_lieu" label="Fait à" value={sig.lieu} onChange={(v) => set('signature', 'lieu', v)} placeholder="Ville du signataire" />
            <TextField id="sig_date" label="Le" type="date" value={sig.date} onChange={(v) => set('signature', 'date', v)} />
          </FormGrid>
        </div>
      </FormSection>

      <div className="flex items-start gap-3 px-6 text-[11px] text-muted-foreground italic">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <p>
          L'article 441-1 du code pénal punit la fraude ou la fausse déclaration de peines allant jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende.
        </p>
      </div>

      <div className="relative overflow-hidden p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-transparent border-2 border-dashed border-primary/20 rounded-[3rem]">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FileText size={120} />
        </div>
        <FileText size={48} className="text-primary mb-4 opacity-50" />
        <h4 className="font-bold text-xl mb-2">Prêt pour l'envoi</h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Une fois généré, vous pourrez visualiser ou télécharger votre document final, à signer avant envoi.
        </p>
      </div>
    </StepContainer>
  );
}
