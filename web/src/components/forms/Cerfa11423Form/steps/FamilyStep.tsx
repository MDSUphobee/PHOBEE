import React from 'react';
import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { Label, RadioGroup, StepContainer, FormSection, FormGrid, Input, Checkbox } from '../FormElements';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function FamilyStep({ data, updateData }: StepProps) {
  const handleRelationChange = (field: keyof Cerfa11423Data['relations'], value: any) => {
    updateData({
      relations: {
        ...(data.relations || {}),
        [field]: value
      }
    });
  };

  const handleLivingChange = (field: keyof Cerfa11423Data['livingSituation'], value: any) => {
    updateData({
      livingSituation: {
        ...(data.livingSituation || {}),
        [field]: value
      }
    });
  };

  return (
    <StepContainer>
      <FormSection title="Votre situation familiale actuelle">
        <div className="space-y-6">
          <RadioGroup
            name="relationStatus"
            value={data.relations?.status || ''}
            onChange={(val) => handleRelationChange('status', val)}
            options={[
              { label: 'Célibataire', value: 'nor_married_pacsed' },
              { label: 'Marié(e)', value: 'married' },
              { label: 'Pacsé(e)', value: 'pacsed' },
              { label: 'Vie commune (Concubinage)', value: 'commun_live' },
            ]}
          />
          
          {(data.relations?.status && data.relations.status !== 'nor_married_pacsed') && (
            <div className="max-w-xs animate-in slide-in-from-top-2 fade-in duration-300">
              <Label htmlFor="statusDate">Depuis le</Label>
              <Input
                id="statusDate"
                type="date"
                value={data.relations?.statusDate || ''}
                onChange={(e) => handleRelationChange('statusDate', e.target.value)}
              />
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Autre cas (changement de situation)">
        <div className="space-y-6">
          <RadioGroup
            name="livingStatus"
            value={data.livingSituation?.status || ''}
            onChange={(val) => handleLivingChange('status', val)}
            options={[
              { label: 'Divorcé(e)', value: 'divorced' },
              { label: 'Séparé(e) légalement', value: 'legally_separated' },
              { label: 'Séparé(e) de fait', value: 'unlegally_separated' },
              { label: 'Veuf / Veuve', value: 'widower' },
            ]}
          />

          {data.livingSituation?.status && (
            <div className="max-w-xs animate-in slide-in-from-top-2 fade-in duration-300">
              <Label htmlFor="livingStatusDate">Depuis le</Label>
              <Input
                id="livingStatusDate"
                type="date"
                value={data.livingSituation?.statusDate || ''}
                onChange={(e) => handleLivingChange('statusDate', e.target.value)}
              />
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Parents séparés">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            Cochez cette case si vous êtes séparés et que vous avez des enfants en résidence alternée ou à charge.
          </p>
          
          <Checkbox
            label="Les parents sont séparés"
            checked={data.livingSituation?.separatedParents?.isSeparated || false}
            onChange={(val) => {
              const sep = data.livingSituation?.separatedParents || {};
              handleLivingChange('separatedParents', { ...sep, isSeparated: val });
            }}
          />

          {data.livingSituation?.separatedParents?.isSeparated && (
            <div className="pl-0 sm:pl-8 space-y-4 pt-4 animate-in slide-in-from-left-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="L'autre parent réside en UE/EEE"
                  checked={data.livingSituation?.separatedParents?.parentResidesEuEeeSwiss || false}
                  onChange={(val) => {
                    const sep = data.livingSituation?.separatedParents || {};
                    handleLivingChange('separatedParents', { ...sep, parentResidesEuEeeSwiss: val });
                  }}
                />
                <Checkbox
                  label="L'autre parent travaille à l'étranger"
                  checked={data.livingSituation?.separatedParents?.parentWorksAbroad || false}
                  onChange={(val) => {
                    const sep = data.livingSituation?.separatedParents || {};
                    handleLivingChange('separatedParents', { ...sep, parentWorksAbroad: val });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </StepContainer>
  );
}
