// Clés identiques au mapper Laravel (app/Services/Pdf/Mappers/Cerfa16015Mapper.php) :
// l'API traduit ce format métier vers les champs AcroForm du PDF.

export type Statut = 'principal' | 'secondaire_3_ans_ou_moins' | 'secondaire_plus_3_ans';
export type EtatPiece = 'jointe' | 'deja_fournie' | 'sans_objet';
export type Piece =
  | 'rib' | 'avis_imposition' | 'declaration_fiscale' | 'contrats_travail'
  | 'statuts_societe' | 'attestation_msa' | 'piece_identite';

export interface Adresse {
  adresse?: string;
  adresse_complement?: string;
  code_postal?: string;
  commune?: string;
}

export interface Associe {
  nom_prenom?: string;
  date_naissance?: string;
  chef_plus_3_ans?: boolean;
  statut?: Statut;
  capital_detenu?: string;
}

export interface Cerfa16015Data {
  /** Choix d'affichage côté front, non envoyé tel quel à l'API */
  forme: 'individuel' | 'societe';
  demandeur: Adresse & {
    siret?: string;
    pacage?: string;
    telephone_fixe?: string;
    telephone_mobile?: string;
    email?: string;
  };
  individuel: {
    civilite?: 'Madame' | 'Monsieur';
    nom?: string;
    prenom?: string;
    date_naissance?: string;
    chef_plus_3_ans?: boolean;
    statut?: Statut;
  };
  societe: {
    denomination?: string;
    forme_juridique?: string;
    capital_social?: string;
    date_immatriculation?: string;
    associe_autre_structure?: boolean;
    participations?: string;
  };
  associes: Associe[];
  exploitation: { procedure_judiciaire?: boolean };
  audit: { realise?: boolean; date?: string; plan_restructuration_valide?: boolean };
  compta: Partial<Record<string, string | boolean>> & { benefice_reel?: boolean };
  comptable: { organisme_nom?: string };
  banque: { iban?: string };
  suivi: Adresse & { organisme_nom?: string; siret?: string };
  signature: { lieu?: string; date?: string };
  pieces: Partial<Record<Piece, EtatPiece>>;
}
