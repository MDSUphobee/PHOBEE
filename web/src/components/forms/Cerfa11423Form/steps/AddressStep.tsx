import React from 'react';
import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, StepContainer, FormSection, FormGrid } from '../FormElements';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function AddressStep({ data, updateData }: StepProps) {
  const handleChange = (field: keyof Cerfa11423Data['address'], value: string) => {
    updateData({
      address: {
        ...(data.address || {}),
        [field]: value
      }
    });
  };

  return (
    <StepContainer>
      <FormSection title="Votre adresse actuelle">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullAddress">Numéro et rue</Label>
            <Input
              id="fullAddress"
              value={data.address?.fullAddress || ''}
              onChange={(e) => handleChange('fullAddress', e.target.value)}
              placeholder="Ex: 12 avenue des Champs-Élysées"
            />
          </div>

          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={data.address?.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="Ex: 75008"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">Commune / Ville</Label>
              <Input
                id="municipality"
                value={data.address?.municipality || ''}
                onChange={(e) => handleChange('municipality', e.target.value)}
                placeholder="Ex: Paris"
              />
            </div>
          </FormGrid>

          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor="sinceWhenLiving">Réside ici depuis le</Label>
              <Input
                id="sinceWhenLiving"
                type="date"
                value={data.address?.sinceWhenLiving || ''}
                onChange={(e) => handleChange('sinceWhenLiving', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="howManyPersonLiving">Nombre de personnes au foyer</Label>
              <Input
                id="howManyPersonLiving"
                type="number"
                min="1"
                value={data.address?.howManyPersonLiving || ''}
                onChange={(e) => handleChange('howManyPersonLiving', e.target.value)}
                placeholder="Total des personnes vivant avec vous"
              />
            </div>
          </FormGrid>
        </div>
      </FormSection>

      <FormSection title="Comment vous contacter ?">
        <FormGrid>
          <div className="space-y-2">
            <Label htmlFor="phoneNumberHome">Téléphone fixe</Label>
            <Input
              id="phoneNumberHome"
              value={data.address?.phoneNumberHome || ''}
              onChange={(e) => handleChange('phoneNumberHome', e.target.value)}
              placeholder="01 23 45 67 89"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumberOther">Téléphone mobile</Label>
            <Input
              id="phoneNumberOther"
              value={data.address?.phoneNumberOther || ''}
              onChange={(e) => handleChange('phoneNumberOther', e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="mailAddressFirst">Adresse e-mail</Label>
            <Input
              id="mailAddressFirst"
              type="email"
              value={data.address?.mailAddressFirst || ''}
              onChange={(e) => handleChange('mailAddressFirst', e.target.value)}
              placeholder="mon.email@exemple.com"
            />
          </div>
        </FormGrid>
      </FormSection>
    </StepContainer>
  );
}
