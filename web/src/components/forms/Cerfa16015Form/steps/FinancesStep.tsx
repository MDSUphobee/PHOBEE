import React from 'react';
import { StepContainer, FormSection, FormGrid } from '../../Cerfa11423Form/FormElements';
import { StepProps, TextField, OuiNon, useSetter } from '../fields';

export default function FinancesStep(props: StepProps) {
  const { data } = props;
  const set = useSetter(props);
  const c = data.compta;
  const isSociete = data.forme === 'societe';

  const compta = (key: string, label: string, money = true) => (
    <TextField
      id={`compta_${key}`}
      label={money ? `${label} en €` : label}
      type={money ? 'number' : 'text'}
      value={c[key] as string | undefined}
      onChange={(v) => set('compta', key, v)}
    />
  );

  return (
    <StepContainer>
      <FormSection title="Situation de l'exploitation">
        <FormGrid>
          <OuiNon
            name="procedure"
            label="L'exploitation fait-elle l'objet d'une procédure collective (sauvegarde, redressement…) ?"
            value={data.exploitation.procedure_judiciaire}
            onChange={(v) => set('exploitation', 'procedure_judiciaire', v)}
          />
          <OuiNon name="audit" label="Un audit de l'exploitation a-t-il été réalisé ?" value={data.audit.realise} onChange={(v) => set('audit', 'realise', v)} />
          {data.audit.realise && (
            <>
              <TextField id="audit_date" label="Date de réalisation de l'audit" type="date" value={data.audit.date} onChange={(v) => set('audit', 'date', v)} />
              <OuiNon
                name="audit_plan"
                label="Le plan de restructuration a-t-il été validé ?"
                value={data.audit.plan_restructuration_valide}
                onChange={(v) => set('audit', 'plan_restructuration_valide', v)}
              />
            </>
          )}
        </FormGrid>
      </FormSection>

      <FormSection title="Main-d'œuvre">
        <FormGrid>
          {compta('ut_non_salariees_b', "Nombre d'unités de travail non salariées (B)", false)}
          {compta('nb_salaries_etp', 'Nombre de salariés (ETP)', false)}
        </FormGrid>
      </FormSection>

      <FormSection title="Données comptables">
        <FormGrid>
          <OuiNon name="benefice_reel" label="Êtes-vous au régime du bénéfice réel ?" value={c.benefice_reel} onChange={(v) => set('compta', 'benefice_reel', v)} />
          {c.benefice_reel === true && compta('exercice_periode', 'Exercice pris en compte', false)}
          {c.benefice_reel === false && (
            <>
              {compta('structure_reconstitution', 'Structure ayant reconstitué la comptabilité', false)}
              {compta('periode_reconstitution', 'Période prise en compte', false)}
            </>
          )}
          {compta('dettes_totales_c', 'Dettes totales (C)')}
          {compta('passif_d', 'Passif (D)')}
          {compta('taux_endettement', "Taux d'endettement (C)/(D)", false)}
          {compta('tresorerie', 'Trésorerie')}
          {compta('ebe_e', 'EBE (E)')}
          {compta('produit_brut_f', 'Produit brut (F)')}
          {compta('ratio_ebe_produit_brut', 'Ratio (E)/(F)', false)}
          {compta('revenu_disponible_g', 'Revenu disponible (G)')}
          {compta('ratio_revenu_disponible_ut', 'Ratio (G)/(B)', false)}
        </FormGrid>
      </FormSection>

      {isSociete && (
        <FormSection title="Capitaux propres">
          <FormGrid>
            {compta('capitaux_propres_h_resp_limitee', 'Capitaux propres (H) — responsabilité limitée')}
            {compta('ratio_capitaux_propres_capital_social', 'Ratio (H)/(A)', false)}
            {compta('capitaux_propres_h_resp_illimitee', 'Capitaux propres (H) — responsabilité illimitée')}
            {compta('capitaux_propres_anterieurs_i', 'Capitaux propres antérieurs (I)')}
            {compta('ratio_reduction_capitaux_propres', 'Ratio (H)/(I)', false)}
          </FormGrid>
        </FormSection>
      )}
    </StepContainer>
  );
}
