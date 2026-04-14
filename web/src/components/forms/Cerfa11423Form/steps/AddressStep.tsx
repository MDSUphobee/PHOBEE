import React from 'react';

import { Cerfa11423Data } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, SectionTitle } from '../FormElements';

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
    <div className="animate-in fade-in duration-500 space-y-8">
      <SectionTitle>Votre adresse actuelle</SectionTitle>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="fullAddress">Adresse complète (Numéro et rue)</Label>
          <Input
            id="fullAddress"
            value={data.address?.fullAddress || ''}
            onChange={(e) => handleChange('fullAddress', e.target.value)}
            placeholder="Ex: 12 avenue des Champs-Élysées"
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="sinceWhenLiving">Réside à cette adresse depuis le</Label>
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
            placeholder="Ex: 3"
          />
        </div>
      </div>

      <hr className="border-border/50" />
      <SectionTitle>Contact</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
