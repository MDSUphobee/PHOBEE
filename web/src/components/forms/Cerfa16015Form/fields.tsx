import React from 'react';
import { Cerfa16015Data } from '@/lib/pdf/cerfa_16015_types';
import { Input, Label, RadioGroup } from '../Cerfa11423Form/FormElements';

export interface StepProps {
  data: Cerfa16015Data;
  updateData: (stepData: Partial<Cerfa16015Data>) => void;
}

/** Met à jour un champ d'une section : set('demandeur', 'siret', '123…') */
export const useSetter = ({ data, updateData }: StepProps) =>
  <K extends Exclude<keyof Cerfa16015Data, 'forme' | 'associes'>>(section: K, field: string, value: unknown) =>
    updateData({ [section]: { ...(data[section] as object), [field]: value } } as Partial<Cerfa16015Data>);

export const TextField = ({
  id, label, value, onChange, type = 'text', placeholder, full,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
}) => (
  <div className={`space-y-2 ${full ? 'md:col-span-2' : ''}`}>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

/** Question Oui / Non : undefined tant que l'utilisateur n'a pas répondu */
export const OuiNon = ({
  name, label, value, onChange,
}: {
  name: string;
  label: string;
  value?: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="space-y-3 md:col-span-2">
    <Label>{label}</Label>
    <RadioGroup
      label={label}
      name={name}
      value={value === undefined ? '' : String(value)}
      onChange={(v) => onChange(v === 'true')}
      options={[
        { label: 'Oui', value: 'true' },
        { label: 'Non', value: 'false' },
      ]}
    />
  </div>
);

export const STATUT_OPTIONS = [
  { label: 'Exploitant à titre principal', value: 'principal' },
  { label: 'À titre secondaire, installé depuis 3 ans ou moins', value: 'secondaire_3_ans_ou_moins' },
  { label: 'À titre secondaire, installé depuis plus de 3 ans', value: 'secondaire_plus_3_ans' },
];
