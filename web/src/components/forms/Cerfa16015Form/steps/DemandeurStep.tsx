import React from 'react';
import { StepContainer, FormSection, FormGrid } from '../../Cerfa11423Form/FormElements';
import { StepProps, TextField, useSetter } from '../fields';

export default function DemandeurStep(props: StepProps) {
  const d = props.data.demandeur;
  const set = useSetter(props);
  const field = (key: keyof typeof d, label: string, extra: { type?: string; placeholder?: string; full?: boolean } = {}) => (
    <TextField id={`demandeur_${key}`} label={label} value={d[key]} onChange={(v) => set('demandeur', key, v)} {...extra} />
  );

  return (
    <StepContainer>
      <FormSection title="Identification du demandeur">
        <FormGrid>
          {field('siret', 'N° SIRET', { placeholder: '14 chiffres' })}
          {field('pacage', 'N° PACAGE', { placeholder: '9 chiffres' })}
        </FormGrid>
      </FormSection>

      <FormSection title="Coordonnées">
        <FormGrid>
          {field('adresse', 'Adresse', { full: true, placeholder: 'N° et libellé de la voie' })}
          {field('adresse_complement', "Complément d'adresse", { full: true, placeholder: 'Lieu-dit, bâtiment…' })}
          {field('code_postal', 'Code postal', { placeholder: '5 chiffres' })}
          {field('commune', 'Commune')}
          {field('telephone_fixe', 'Téléphone fixe', { type: 'tel' })}
          {field('telephone_mobile', 'Téléphone mobile', { type: 'tel' })}
          {field('email', 'Mél', { type: 'email', full: true })}
        </FormGrid>
      </FormSection>
    </StepContainer>
  );
}
