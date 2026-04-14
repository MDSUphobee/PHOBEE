import { PdfTemplateConfig } from './types';

/**
 * Service global pour générer des PDFs.
 * 
 * @param config La configuration de mapping spécifique pour le PDF (ex: cerfa11423Config)
 * @param data Vos données métier provenant de votre formulaire React
 * @param download true pour demander au serveur de le forcer en téléchargement ou nous renvoyer l'URL
 */
export async function generatePdf<T>(
  config: PdfTemplateConfig<T>, 
  data: T, 
  download: boolean = false
) {
  // 1. On "traduit" nos données métier en clés comprises par l'AcroForm du PDF.
  const fields = config.mapDataToFields(data);
  
  // 2. On envoie la requête à l'API PHP
  // On utilise l'URL absolue si on est en dev local, sinon le point d'accès de l'API en prod
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

  const response = await fetch(`${apiUrl}/pdfs/fill?pdf=${encodeURIComponent(config.templateName)}&download=${download}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      mapping: fields, 
      flatten: false 
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la génération du PDF: ${response.statusText}`);
  }

  // 3. Gestion de la réponse
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/pdf')) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { success: true, data: { url } };
  }

  // Renvoie les données du type { success: true, data: { url: "..." } }
  return response.json();
}
