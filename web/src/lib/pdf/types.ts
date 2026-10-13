export interface PdfTemplateConfig<T> {
  templateName: string;
  // Fonction qui transforme les données métier (Formulaire React/NextJS) vers le format attendu par l'API PDF (AcroForm)
  // Valeurs imbriquées acceptées quand un mapper Laravel fait la traduction (ex: cerfa 16015).
  mapDataToFields: (data: T) => Record<string, unknown>;
}
