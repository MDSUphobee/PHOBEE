/**
 * Mappe les réponses du questionnaire vers les champs attendus par le backend.
 */
export const mapAnswersToBackend = (answers: any[]) => {
  const data: any = {};

  answers.forEach((a: any) => {
    switch (a.questionId) {
      case 'statut':
        const mapping: Record<string, string> = {
          'ei': 'EI',
          'earl': 'EARL',
          'gaec': 'GAEC',
          'scea': 'SCEA',
          'gfa': 'GFA',
          'cuma': 'CUMA',
          'sarl-sas': 'SARL' // Par défaut
        };
        data.legal_form_id = mapping[a.value] || a.value.toUpperCase();
        break;

      case 'cotisantMSA':
        data.is_msa_contributor = a.value === 'oui';
        break;

      case 'age':
        data.is_young_farmer = a.value === 'oui';
        break;

      case 'zoneMontagne':
        data.has_mountain_zone = a.value === 'oui';
        break;

      case 'bioHVE':
        // Si "oui", on met un label informatif
        data.farming_label = a.value === 'oui' ? 'Bio/HVE' : 'Standard';
        break;

      case 'projetInvestissement':
      case 'projetInvestissementCuma':
        data.investment_project = a.value === 'oui';
        break;

      case 'projetTransformation':
        data.has_energy_project = a.value === 'oui';
        break;

      case 'associesNonExploitants':
        data.has_investors = a.value === 'oui';
        break;

      case 'nouvelAssocie':
        data.has_new_partner = a.value === 'oui';
        break;

      case 'projetFoncier':
        data.has_land_project = a.value === 'oui';
        break;
    }
  });

  return data;
};

/**
 * Envoie les informations du questionnaire au backend.
 */
export const saveUserQuestionnaireInfo = async (userId: number | string, token: string, answers: any[]) => {
  if (!userId || !token || !answers || answers.length === 0) return null;

  const mappedData = mapAnswersToBackend(answers);
  // console.log(mappedData);
  // console.log(userId);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}/user-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mappedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur lors de la sauvegarde des infos utilisateur:', errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur réseau lors de la sauvegarde des infos utilisateur:', error);
    return null;
  }
};

/**
 * Récupère les informations complètes d'un utilisateur depuis le proxy Next.
 */
export const getUserInfo = async (userId: number | string, token: string) => {
  if (!userId || !token) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des infos utilisateur:', error);
    return null;
  }
};

/**
 * Transforme les données du backend en format compatible avec l'état 'answers' du questionnaire.
 */
export const mapBackendToAnswers = (user: any) => {
  const answers: any[] = [];

  if (user.legal_form_id) {
    let statutValue = user.legal_form_id.toLowerCase();
    if (statutValue === 'sarl' || statutValue === 'sas') {
      statutValue = 'sarl-sas';
    }
    answers.push({ questionId: 'statut', value: statutValue });
  }

  const booleanFields: Record<string, string> = {
    'is_msa_contributor': 'cotisantMSA',
    'is_young_farmer': 'age',
    'has_mountain_zone': 'zoneMontagne',
    'investment_project': 'projetInvestissement', // Note: On pourrait aussi mapper vers projetInvestissementCuma si statut === cuma
    'has_energy_project': 'projetTransformation',
    'has_investors': 'associesNonExploitants',
    'has_new_partner': 'nouvelAssocie',
    'has_land_project': 'projetFoncier'
  };

  Object.entries(booleanFields).forEach(([dbField, qId]) => {
    if (user[dbField] !== null && user[dbField] !== undefined) {
      answers.push({ questionId: qId, value: user[dbField] ? 'oui' : 'non' });
    }
  });

  if (user.farming_label) {
    answers.push({ questionId: 'bioHVE', value: user.farming_label === 'Bio/HVE' ? 'oui' : 'non' });
  }

  return answers;
};
