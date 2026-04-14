import React from 'react';

import { Cerfa11423Data, JobData } from '@/lib/pdf/cerfa_11423_types';
import { Label, SectionTitle, Checkbox, Input, Select } from '../FormElements';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function ProfessionalStep({ data, updateData }: StepProps) {
  const handleJobChange = (key: 'allocJob' | 'partnerJob', field: keyof JobData, value: any) => {
    updateData({
      [key]: {
        ...(data[key] || {}),
        [field]: value
      }
    });
  };

  const handleSubFieldChange = (key: 'allocJob' | 'partnerJob', category: keyof JobData, field: string, value: any) => {
    const jobData = data[key] || {};
    const categoryData = (jobData[category] as any) || {};
    
    updateData({
      [key]: {
        ...jobData,
        [category]: {
          ...categoryData,
          [field]: value
        }
      }
    });
  };

  const renderJobForm = (key: 'allocJob' | 'partnerJob', title: string) => {
    const job = data[key] || {};
    return (
      <div className="space-y-6">
        <SectionTitle>{title}</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-6 rounded-2xl">
          <Checkbox 
            label="Salarié(e)" 
            checked={job.employee?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'employee', 'active', val)} 
          />
          <Checkbox 
            label="Apprenti(e)" 
            checked={job.apprentice?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'apprentice', 'active', val)} 
          />
          <Checkbox 
            label="Stagiaire" 
            checked={job.trainee?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'trainee', 'active', val)} 
          />
          <Checkbox 
            label="Travailleur indépendant" 
            checked={job.selfEmployed?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'selfEmployed', 'active', val)} 
          />
          <Checkbox 
            label="Au chômage" 
            checked={job.unemployed?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'unemployed', 'active', val)} 
          />
          <Checkbox 
            label="Retraité(e)" 
            checked={job.retired?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'retired', 'active', val)} 
          />
          <Checkbox 
            label="Étudiant(e)" 
            checked={job.student?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'student', 'active', val)} 
          />
          <Checkbox 
            label="Sans activité" 
            checked={job.noActivity?.active || false} 
            onChange={(val) => handleSubFieldChange(key, 'noActivity', 'active', val)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nom de l'employeur / Organisme</Label>
            <Input 
              value={job.employerName || ''} 
              onChange={(e) => handleJobChange(key, 'employerName', e.target.value)}
              placeholder="Ex: Entreprise ACME"
            />
          </div>
          <div className="space-y-2">
            <Label>Régime de protection sociale</Label>
            <Select 
              value={job.taxRegime || ''} 
              onChange={(e) => handleJobChange(key, 'taxRegime', e.target.value)}
            >
              <option value="">Sélectionnez...</option>
              <option value="urssaf">Régime Général (URSSAF)</option>
              <option value="msa">Régime Agricole (MSA)</option>
              <option value="other">Autre</option>
              <option value="abroad">Régime étranger</option>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      {renderJobForm('allocJob', 'Situation de l\'allocataire')}
      <hr className="border-border/50" />
      {renderJobForm('partnerJob', 'Situation du conjoint')}
    </div>
  );
}
