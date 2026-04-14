import React from 'react';

import { Cerfa11423Data, Person } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, Select, RadioGroup, SectionTitle } from '../FormElements';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function ProfileStep({ data, updateData }: StepProps) {
  const handlePersonChange = (key: 'asking' | 'married', field: keyof Person, value: any) => {
    updateData({
      [key]: {
        ...(data[key] || {}),
        [field]: value
      }
    });
  };

  const renderPersonForm = (key: 'asking' | 'married', title: string) => {
    const person = data[key] || {};
    return (
      <div className="space-y-6 mb-10">
        <SectionTitle>{title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Civilité</Label>
            <RadioGroup
              name={`${key}_gender`}
              value={person.gender || ''}
              onChange={(val) => handlePersonChange(key, 'gender', val)}
              options={[
                { label: 'Monsieur', value: 'man' },
                { label: 'Madame', value: 'woman' },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_familyName`}>Nom de famille (de naissance)</Label>
            <Input
              id={`${key}_familyName`}
              value={person.familyName || ''}
              onChange={(e) => handlePersonChange(key, 'familyName', e.target.value)}
              placeholder="Ex: MARTIN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_usageName`}>Nom d'usage (facultatif)</Label>
            <Input
              id={`${key}_usageName`}
              value={person.usageName || ''}
              onChange={(e) => handlePersonChange(key, 'usageName', e.target.value)}
              placeholder="Ex: DUPONT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_surname`}>Prénoms</Label>
            <Input
              id={`${key}_surname`}
              value={person.surname || ''}
              onChange={(e) => handlePersonChange(key, 'surname', e.target.value)}
              placeholder="Ex: Jean, Pierre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_bornDate`}>Date de naissance</Label>
            <Input
              id={`${key}_bornDate`}
              type="date"
              value={person.bornDate || ''}
              onChange={(e) => handlePersonChange(key, 'bornDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_bornPlace`}>Lieu de naissance</Label>
            <Input
              id={`${key}_bornPlace`}
              value={person.bornPlace || ''}
              onChange={(e) => handlePersonChange(key, 'bornPlace', e.target.value)}
              placeholder="Ex: Paris"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${key}_nationality`}>Nationalité</Label>
            <Select
              id={`${key}_nationality`}
              value={person.nationality || ''}
              onChange={(e) => handlePersonChange(key, 'nationality', e.target.value)}
            >
              <option value="french">Française</option>
              <option value="ue">UE, EEE ou Suisse</option>
              <option value="other">Autre</option>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor={`${key}_ss`}>Numéro de sécurité sociale</Label>
            <Input
              id={`${key}_ss`}
              value={person.socialSecurityNumber || ''}
              onChange={(e) => handlePersonChange(key, 'socialSecurityNumber', e.target.value)}
              placeholder="Ex: 1 80 01 75 012 345 67"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {renderPersonForm('asking', 'Informations de l\'allocataire')}
      <hr className="my-10 border-border" />
      {renderPersonForm('married', 'Informations du conjoint (le cas échéant)')}
    </div>
  );
}
