export interface PdfTemplateConfig<T> {
  templateName: string;
  // Fonction qui transforme les données métier (Formulaire React/NextJS) vers le format attendu par l'API PDF (AcroForm)
  mapDataToFields: (data: T) => Record<string, string | boolean | null>;
}
