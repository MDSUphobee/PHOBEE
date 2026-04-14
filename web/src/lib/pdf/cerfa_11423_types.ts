export interface Person {
  gender?: 'man' | 'woman';
  familyName?: string;
  usageName?: string;
  surname?: string; // Prénoms
  bornDate?: string;
  bornPlace?: string;
  bornCountryStranger?: string;
  nationality?: 'french' | 'ue' | 'other';
  socialSecurityNumber?: string;
  dateEnterFrance?: string;
  lastTwoYearsCaf?: {
    name?: string;
    country?: string;
    numberFolder?: string;
  };
}

export interface ChildData {
  nameSurname?: string;
  bornPlace?: string;
  bornDate?: string;
  dateArrival?: string;
  arrivalRelation?: string;
  currentStatus?: string;
  abroadResidence?: boolean;
  alternatingResidence?: boolean;
}

export interface ParentMinorAllocData {
  benefits?: 'yes' | 'no';
  name?: string;
  surname?: string;
  address?: string;
  zip?: string;
  city?: string;
  organismName?: string;
  numberFolder?: string;
  socialSecurityNumber?: string;
}

export interface JobData {
  employee?: { active: boolean; since?: string; contractType?: string };
  apprentice?: { active: boolean; since?: string; endDate?: string };
  trainee?: { active: boolean; since?: string };
  selfEmployed?: { active: boolean; since?: string };
  agricultural?: { active: boolean; since?: string };
  autoEntrepreneur?: { active: boolean; since?: string };
  collaboratingSpouse?: { active: boolean; since?: string };
  unemployed?: { active: boolean; since?: string; organism?: string; partial?: 'yes' | 'no' };
  retired?: { active: boolean; since?: string; regimeDetails?: string };
  sickLeave?: { active: boolean; since?: string };
  student?: { active: boolean; since?: string };
  noActivity?: { active: boolean; since?: string; always?: boolean };
  otherCase?: { active: boolean; since?: string; details?: string; establishment?: string };

  employerName?: string;
  employerAddress?: string;
  taxRegime?: 'urssaf' | 'msa' | 'other' | 'abroad';
  taxRegimeOtherDetails?: string;
  taxRegimeAbroadCountry?: string;
  foreignPensionOrganismCountry?: string;
}

// L'interface principale métier (frontend) pour le CERFA 11423
export interface Cerfa11423Data {
  asking: Person; // Allocataire
  married?: Person; // Conjoint

  // 2. Adresse
  address: {
    fullAddress?: string;
    postalCode?: string;
    municipality?: string;
    country?: string;
    phoneNumberHome?: string;
    phoneNumberOther?: string;
    mailAddressFirst?: string;
    mailAddressSecond?: string;
    sinceWhenLiving?: string;
    howManyPersonLiving?: string;
    countryMarriedPerson?: string;
    dateMarriedPerson?: string;
  };

  // 3. Situation Familiale
  relations: {
    status?: 'nor_married_pacsed' | 'married' | 'pacsed' | 'commun_live';
    statusDate?: string;
  };
  livingSituation: {
    status?: 'divorced' | 'legally_separated' | 'unlegally_separated' | 'widower';
    statusDate?: string;
    separatedParents?: {
      isSeparated?: boolean;
      parentResidesEuEeeSwiss?: boolean;
      parentWorksAbroad?: boolean;
      parentReceivesForeignPension?: boolean;
      childSupportPaid?: 'yes' | 'no';
    };
  };

  // 4. Enfants
  children?: ChildData[]; // Max 5

  // 5. Situation des parents
  parentAlloc?: ParentMinorAllocData;
  parentPartner?: ParentMinorAllocData;

  // 6. Situation Professionnelle
  allocJob?: JobData;
  partnerJob?: JobData;

  // 8. Signatures
  signature: {
    doneAt?: string;
    doneDate?: string;
    doneNomSurnameQualityAddress?: string;
    signed?: boolean;
  };
}
