import React from 'react';
import { Plus, Trash2, Baby } from 'lucide-react';
import { Cerfa11423Data, ChildData } from '@/lib/pdf/cerfa_11423_types';
import { Input, Label, SectionTitle, Checkbox } from '../FormElements';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <SectionTitle>Enfants à charge</SectionTitle>
        <ShadcnButton 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addChild}
          disabled={children.length >= 5}
          className="gap-2"
        >
          <Plus size={16} />
          Ajouter un enfant
        </ShadcnButton>
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-muted rounded-2xl bg-muted/5">
          <Baby size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Aucun enfant ajouté pour le moment.</p>
          <p className="text-xs text-muted-foreground/60">(Maximum 5 enfants)</p>
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((child, index) => (
            <Card key={index} className="border-border/60 bg-background shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Enfant {index + 1}
                  </div>
                  <ShadcnButton 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeChild(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2"
                  >
                    <Trash2 size={18} />
                  </ShadcnButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom et Prénom</Label>
                    <Input
                      value={child.nameSurname || ''}
                      onChange={(e) => updateChild(index, 'nameSurname', e.target.value)}
                      placeholder="Ex: MARTIN Théo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        placeholder="Ex: Lyon"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date d'arrivée au foyer</Label>
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
                      placeholder="Ex: Fils, Fille"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
