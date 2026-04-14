import React from 'react';
import { Cerfa11423Data, JobData } from '@/lib/pdf/cerfa_11423_types';
import { Label, Checkbox, Input, Select, StepContainer, FormSection, FormGrid } from '../FormElements';

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
      <FormSection title={title}>
        <div className="space-y-10">
          <div>
            <Label className="mb-4">Statut actuel (Cochez toutes les cases correspondantes)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Checkbox 
                label="Salarié(e)" 
                checked={job.employee?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'employee', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Apprenti(e)" 
                checked={job.apprentice?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'apprentice', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Stagiaire" 
                checked={job.trainee?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'trainee', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Indépendant" 
                checked={job.selfEmployed?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'selfEmployed', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Au chômage" 
                checked={job.unemployed?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'unemployed', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Retraité(e)" 
                checked={job.retired?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'retired', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Étudiant(e)" 
                checked={job.student?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'student', 'active', val)} 
                className="p-3"
              />
              <Checkbox 
                label="Sans activité" 
                checked={job.noActivity?.active || false} 
                onChange={(val) => handleSubFieldChange(key, 'noActivity', 'active', val)} 
                className="p-3"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <FormGrid>
              <div className="space-y-2">
                <Label>Nom de l'employeur / Organisme</Label>
                <Input 
                  value={job.employerName || ''} 
                  onChange={(e) => handleJobChange(key, 'employerName', e.target.value)}
                  placeholder="Ex: Entreprise ou France Travail"
                />
              </div>
              <div className="space-y-2">
                <Label>Régime de protection sociale</Label>
                <Select 
                  value={job.taxRegime || ''} 
                  onChange={(e) => handleJobChange(key, 'taxRegime', e.target.value)}
                >
                  <option value="">-- Choisir le régime --</option>
                  <option value="urssaf">Régime Général (URSSAF)</option>
                  <option value="msa">Régime Agricole (MSA)</option>
                  <option value="other">Autre régime spécifique</option>
                  <option value="abroad">Régime étranger</option>
                </Select>
              </div>
            </FormGrid>
          </div>
        </div>
      </FormSection>
    );
  };

  return (
    <StepContainer>
      {renderJobForm('allocJob', 'Situation de l\'allocataire')}
      {renderJobForm('partnerJob', 'Situation du conjoint')}
    </StepContainer>
  );
}
