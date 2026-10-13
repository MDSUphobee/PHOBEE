import React from 'react';
import { StepContainer, FormSection, FormGrid } from '../../Cerfa11423Form/FormElements';
import { StepProps, TextField, useSetter } from '../fields';

export default function PaiementStep(props: StepProps) {
  const { data } = props;
  const set = useSetter(props);
  const s = data.suivi;
  const suivi = (key: keyof typeof s, label: string, extra: { placeholder?: string; full?: boolean } = {}) => (
    <TextField id={`suivi_${key}`} label={label} value={s[key]} onChange={(v) => set('suivi', key, v)} {...extra} />
  );

  return (
    <StepContainer>
      <FormSection title="Comptabilité et paiement">
        <FormGrid>
          <TextField
            id="comptable_nom"
            label="Nom de l'organisme comptable"
            full
            value={data.comptable.organisme_nom}
            onChange={(v) => set('comptable', 'organisme_nom', v)}
          />
          <TextField
            id="iban"
            label="IBAN du compte bénéficiaire"
            full
            value={data.banque.iban}
            onChange={(v) => set('banque', 'iban', v)}
            placeholder="FR76 …"
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Organisme de suivi">
        <FormGrid>
          {suivi('organisme_nom', "Nom de l'organisme", { full: true })}
          {suivi('siret', 'N° SIRET', { placeholder: '14 chiffres' })}
          {suivi('code_postal', 'Code postal', { placeholder: '5 chiffres' })}
          {suivi('adresse', 'Adresse (siège social)', { full: true })}
          {suivi('adresse_complement', "Complément d'adresse", { full: true })}
          {suivi('commune', 'Commune')}
        </FormGrid>
      </FormSection>
    </StepContainer>
  );
}
