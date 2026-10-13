import React from 'react';
import { EtatPiece, Piece } from '@/lib/pdf/cerfa_16015_types';
import { Label, RadioGroup, StepContainer, FormSection } from '../../Cerfa11423Form/FormElements';
import { StepProps } from '../fields';

// "Sans objet" n'existe dans le PDF que pour les contrats de travail et les statuts.
const PIECES: { key: Piece; label: string; sansObjet?: boolean }[] = [
  { key: 'rib', label: "Relevé d'identité bancaire (RIB)" },
  { key: 'avis_imposition', label: "Dernier avis d'imposition" },
  { key: 'declaration_fiscale', label: 'Dernière déclaration fiscale' },
  { key: 'contrats_travail', label: 'Contrats de travail des salariés', sansObjet: true },
  { key: 'statuts_societe', label: 'Statuts de la société', sansObjet: true },
  { key: 'attestation_msa', label: 'Attestation MSA' },
  { key: 'piece_identite', label: "Pièce d'identité" },
];

export default function PiecesStep({ data, updateData }: StepProps) {
  return (
    <StepContainer>
      <FormSection title="Pièces justificatives">
        <div className="space-y-8">
          {PIECES.map((p) => (
            <div key={p.key} className="space-y-3">
              <Label>{p.label}</Label>
              <RadioGroup
                name={`piece_${p.key}`}
                value={data.pieces[p.key] || ''}
                onChange={(v: EtatPiece) => updateData({ pieces: { ...data.pieces, [p.key]: v } })}
                options={[
                  { label: 'Jointe', value: 'jointe' },
                  { label: 'Déjà fournie', value: 'deja_fournie' },
                  ...(p.sansObjet ? [{ label: 'Sans objet', value: 'sans_objet' }] : []),
                ]}
              />
            </div>
          ))}
        </div>
      </FormSection>
    </StepContainer>
  );
}
