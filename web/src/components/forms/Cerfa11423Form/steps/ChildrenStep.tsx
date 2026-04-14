import React from 'react';
import { Plus, Trash2, Baby } from 'lucide-react';
import { Cerfa11423Data, ChildData } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, Checkbox, StepContainer, FormSection, FormGrid } from '../FormElements';
import { Button as ShadcnButton } from '@/components/ui/button';

interface StepProps {
  data: Cerfa11423Data;
  updateData: (stepData: Partial<Cerfa11423Data>) => void;
}

export default function ChildrenStep({ data, updateData }: StepProps) {
  const children = data.children || [];

  const addChild = () => {
    if (children.length >= 5) return;
    updateData({
      children: [...children, {}]
    });
  };

  const removeChild = (index: number) => {
    const newChildren = [...children];
    newChildren.splice(index, 1);
    updateData({ children: newChildren });
  };

  const updateChild = (index: number, field: keyof ChildData, value: any) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    updateData({ children: newChildren });
  };

  return (
    <StepContainer>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h3 className="text-xl font-bold text-foreground">Vos enfants à charge</h3>
          <p className="text-sm text-muted-foreground mt-1">Vous pouvez ajouter jusqu'à 5 enfants.</p>
        </div>
        <ShadcnButton 
          type="button" 
          variant="outline" 
          onClick={addChild}
          disabled={children.length >= 5}
          className="rounded-full px-6 border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all gap-2"
        >
          <Plus size={18} />
          Ajouter un enfant
        </ShadcnButton>
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-[2rem] bg-muted/5 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-6">
            <Baby size={32} className="text-muted-foreground/30" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">Aucun enfant ajouté</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Cliquez sur le bouton ci-dessus pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {children.map((child, index) => (
            <div key={index} className="group relative bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-bold">Enfant n°{index + 1}</h4>
                </div>
                <ShadcnButton 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeChild(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </ShadcnButton>
              </div>

              <div className="space-y-8">
                <FormGrid>
                  <div className="space-y-2">
                    <Label>Nom et Prénom</Label>
                    <Input
                      value={child.nameSurname || ''}
                      onChange={(e) => updateChild(index, 'nameSurname', e.target.value)}
                      placeholder="Identité complète"
                    />
                  </div>

                  <FormGrid className="md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de naissance</Label>
                      <Input
                        type="date"
                        value={child.bornDate || ''}
                        onChange={(e) => updateChild(index, 'bornDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lieu de naissance</Label>
                      <Input
                        value={child.bornPlace || ''}
                        onChange={(e) => updateChild(index, 'bornPlace', e.target.value)}
                        placeholder="Ville"
                      />
                    </div>
                  </FormGrid>
                </FormGrid>

                <div className="pt-4 border-t border-border/40">
                  <FormGrid>
                    <div className="space-y-2">
                      <Label>Arrivé au foyer le</Label>
                      <Input
                        type="date"
                        value={child.dateArrival || ''}
                        onChange={(e) => updateChild(index, 'dateArrival', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lien de parenté</Label>
                      <Input
                        value={child.arrivalRelation || ''}
                        onChange={(e) => updateChild(index, 'arrivalRelation', e.target.value)}
                        placeholder="Ex: Fils, Fille, Enfant recueilli"
                      />
                    </div>
                  </FormGrid>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Checkbox
                    label="Réside à l'étranger"
                    checked={child.abroadResidence || false}
                    onChange={(val) => updateChild(index, 'abroadResidence', val)}
                  />
                  <Checkbox
                    label="Résidence alternée"
                    checked={child.alternatingResidence || false}
                    onChange={(val) => updateChild(index, 'alternatingResidence', val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StepContainer>
  );
}
