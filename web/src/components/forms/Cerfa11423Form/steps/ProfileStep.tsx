import React from 'react';
import { Cerfa11423Data, Person } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, Select, RadioGroup, StepContainer, FormSection, FormGrid } from '../FormElements';

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
    const labelPrefix = key === 'asking' ? 'Vous' : 'Votre conjoint';

    return (
      <FormSection title={title}>
        <div className="space-y-8">
          <div className="space-y-3">
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

          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor={`${key}_familyName`}>Nom de famille</Label>
              <Input
                id={`${key}_familyName`}
                value={person.familyName || ''}
                onChange={(e) => handlePersonChange(key, 'familyName', e.target.value)}
                placeholder="Nom de naissance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${key}_usageName`}>Nom d'usage</Label>
              <Input
                id={`${key}_usageName`}
                value={person.usageName || ''}
                onChange={(e) => handlePersonChange(key, 'usageName', e.target.value)}
                placeholder="Facultatif (ex: nom d'épouse)"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor={`${key}_surname`}>Tous les prénoms</Label>
              <Input
                id={`${key}_surname`}
                value={person.surname || ''}
                onChange={(e) => handlePersonChange(key, 'surname', e.target.value)}
                placeholder="Séparez par des virgules"
              />
            </div>
          </FormGrid>

          <div className="pt-2">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Naissance</h4>
            <FormGrid>
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
                  placeholder="Ville ou commune"
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
                  <option value="other">Autre (Étranger hors UE)</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${key}_ss`}>Numéro de sécurité sociale</Label>
                <Input
                  id={`${key}_ss`}
                  value={person.socialSecurityNumber || ''}
                  onChange={(e) => handlePersonChange(key, 'socialSecurityNumber', e.target.value)}
                  placeholder="15 chiffres"
                />
              </div>
            </FormGrid>
          </div>
        </div>
      </FormSection>
    );
  };

  return (
    <StepContainer>
      {renderPersonForm('asking', 'Informations de l\'allocataire')}
      {renderPersonForm('married', 'Informations du conjoint')}
    </StepContainer>
  );
}
