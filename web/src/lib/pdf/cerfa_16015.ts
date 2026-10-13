import { PdfTemplateConfig } from './types';
import { Cerfa16015Data } from './cerfa_16015_types';

export const cerfa16015Config: PdfTemplateConfig<Cerfa16015Data> = {
  templateName: "Demande d'aide à la relance de l'exploitation agricole",
  // Le mapper Laravel du cerfa 16015 fait la traduction vers l'AcroForm
  // (dates en jour/mois/année, cases en peigne, cases à cocher) : on envoie
  // les données métier telles quelles, sans la partie de la forme non choisie.
  mapDataToFields: ({ forme, ...data }) => {
    const out: Record<string, unknown> = { ...data };
    if (forme === 'individuel') {
      delete out.societe;
      delete out.associes;
    } else {
      delete out.individuel;
    }
    return out;
  },
};
