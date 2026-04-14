import { PdfTemplateConfig } from './types';
import { Cerfa11423Data, JobData } from './cerfa_11423_types';

export const cerfa11423Config: PdfTemplateConfig<Cerfa11423Data> = {
  templateName: 'Déclaration de situation pour les prestations familiales et aides au logement',
  mapDataToFields: (data) => {
    const fields: Record<string, string | boolean | null> = {};

    // Helper functions pour éviter la duplication
    const onStr = (val: string | undefined) => val ? val : '';
    const chkStr = (cond: boolean | undefined, val: string = '/Yes') => cond ? val : '';

    // ============================================
    // 1. Identité Allocataire
    // ============================================
    if (data.asking) {
      if (data.asking.gender === 'man') fields['asking_radio_gender_man'] = '/asking_radio_gender';
      if (data.asking.gender === 'woman') fields['asking_radio_gender_woman'] = '/asking_radio_gender';

      fields['asking_family_name'] = onStr(data.asking.familyName);
      fields['asking_usage_name'] = onStr(data.asking.usageName);
      fields['asking_surname'] = onStr(data.asking.surname);
      fields['asking_born_date'] = onStr(data.asking.bornDate);
      fields['asking_born_place'] = onStr(data.asking.bornPlace);
      fields['asking_born_country_stranger'] = onStr(data.asking.bornCountryStranger);

      fields['asking_checkbox_nationality_french'] = chkStr(data.asking.nationality === 'french', '/asking_checkbox_nationality');
      fields['asking_checkbox_nationality_ue'] = chkStr(data.asking.nationality === 'ue', '/asking_checkbox_nationality');
      fields['asking_checkbox_nationality_other'] = chkStr(data.asking.nationality === 'other', '/asking_checkbox_nationality');

      fields['asking_social_security_number'] = onStr(data.asking.socialSecurityNumber);
      fields['asking_date_enter_france'] = onStr(data.asking.dateEnterFrance);

      if (data.asking.lastTwoYearsCaf) {
        fields['asking_last_two_years_caf_msa_name'] = onStr(data.asking.lastTwoYearsCaf.name);
        fields['asking_last_two_years_caf_msa_country'] = onStr(data.asking.lastTwoYearsCaf.country);
        fields['asking_last_two_years_caf_msa_number_folder'] = onStr(data.asking.lastTwoYearsCaf.numberFolder);
      }
    }

    // ============================================
    // 1 (Suite). Identité Conjoint
    // ============================================
    if (data.married) {
      if (data.married.gender === 'man') fields['married_radio_gender_man'] = '/married_radio_gender';
      if (data.married.gender === 'woman') fields['married_radio_gender_woman'] = '/married_radio_gender';

      fields['married_family_name'] = onStr(data.married.familyName);
      fields['married_usage_name'] = onStr(data.married.usageName);
      fields['married_surname'] = onStr(data.married.surname);
      fields['married_born_date'] = onStr(data.married.bornDate);
      fields['married_born_place'] = onStr(data.married.bornPlace);
      fields['married_born_country_stranger'] = onStr(data.married.bornCountryStranger);

      fields['married_checkbox_nationality_french'] = chkStr(data.married.nationality === 'french', '/married_checkbox_nationality');
      fields['married_checkbox_nationality_ue'] = chkStr(data.married.nationality === 'ue', '/married_checkbox_nationality');
      fields['married_checkbox_nationality_other'] = chkStr(data.married.nationality === 'other', '/married_checkbox_nationality');

      fields['married_social_security_number'] = onStr(data.married.socialSecurityNumber);
      fields['married_date_enter_france'] = onStr(data.married.dateEnterFrance);

      if (data.married.lastTwoYearsCaf) {
        fields['married_last_two_years_caf_msa_name'] = onStr(data.married.lastTwoYearsCaf.name);
        fields['married_last_two_years_caf_msa_country'] = onStr(data.married.lastTwoYearsCaf.country);
        fields['married_last_two_years_caf_msa_number_folder'] = onStr(data.married.lastTwoYearsCaf.numberFolder);
      }
    }

    // ============================================
    // 2. Adresse
    // ============================================
    if (data.address) {
      fields['full_address'] = onStr(data.address.fullAddress);
      fields['postal_code'] = onStr(data.address.postalCode);
      fields['municipality'] = onStr(data.address.municipality);
      fields['country'] = onStr(data.address.country);
      fields['phone_number_home'] = onStr(data.address.phoneNumberHome);
      fields['phone_number_other'] = onStr(data.address.phoneNumberOther);
      fields['mail_address_first'] = onStr(data.address.mailAddressFirst);
      fields['mail_address_second'] = onStr(data.address.mailAddressSecond);
      fields['since_when_living'] = onStr(data.address.sinceWhenLiving);
      fields['how_many_person_living'] = onStr(data.address.howManyPersonLiving);
      fields['country_married_person'] = onStr(data.address.countryMarriedPerson);
      fields['date_married_person'] = onStr(data.address.dateMarriedPerson);
    }

    // ============================================
    // 3. Situation Familiale
    // ============================================
    if (data.relations) {
      fields['checkbox_relation_nor_married_pacsed'] = chkStr(data.relations.status === 'nor_married_pacsed', '/checkbox_relations');
      fields['date_checkbox_relation_nor_married_pacsed'] = chkStr(data.relations.status === 'nor_married_pacsed', onStr(data.relations.statusDate));

      fields['checkbox_relation_married_since'] = chkStr(data.relations.status === 'married', '/checkbox_relations');
      fields['date_checkbox_relation_married_since'] = chkStr(data.relations.status === 'married', onStr(data.relations.statusDate));

      fields['checkbox_relation_pacsed_since'] = chkStr(data.relations.status === 'pacsed', '/checkbox_relations');
      fields['date_checkbox_relation_pacsed_since'] = chkStr(data.relations.status === 'pacsed', onStr(data.relations.statusDate));

      fields['checkbox_relation_commun_live'] = chkStr(data.relations.status === 'commun_live', '/checkbox_relations');
      fields['date_checkbox_relation_commun_live'] = chkStr(data.relations.status === 'commun_live', onStr(data.relations.statusDate));
    }

    if (data.livingSituation) {
      fields['checkbox_divorced'] = chkStr(data.livingSituation.status === 'divorced', '/checkbox_living_situations');
      fields['date_checkbox_divorced'] = chkStr(data.livingSituation.status === 'divorced', onStr(data.livingSituation.statusDate));

      fields['checkbox_legally_separated'] = chkStr(data.livingSituation.status === 'legally_separated', '/checkbox_living_situations');
      fields['datecheckbox_legally_separated'] = chkStr(data.livingSituation.status === 'legally_separated', onStr(data.livingSituation.statusDate));

      fields['checkbox_unlegally_separated'] = chkStr(data.livingSituation.status === 'unlegally_separated', '/checkbox_living_situations');
      fields['date_checkbox_unlegally_separated'] = chkStr(data.livingSituation.status === 'unlegally_separated', onStr(data.livingSituation.statusDate));

      fields['checkbox_widower'] = chkStr(data.livingSituation.status === 'widower', '/checkbox_living_situations');
      fields['date_checkbox_widower'] = chkStr(data.livingSituation.status === 'widower', onStr(data.livingSituation.statusDate));

      if (data.livingSituation.separatedParents && data.livingSituation.separatedParents.isSeparated) {
        fields['checkbox_separated_parents'] = '/Yes';
        fields['parent_resides_eu_eee_swiss'] = chkStr(data.livingSituation.separatedParents.parentResidesEuEeeSwiss);
        fields['parent_works_abroad'] = chkStr(data.livingSituation.separatedParents.parentWorksAbroad);
        fields['parent_receives_foreign_pension'] = chkStr(data.livingSituation.separatedParents.parentReceivesForeignPension);
        
        if (data.livingSituation.separatedParents.childSupportPaid === 'yes') {
            fields['child_support_paid_yes'] = '/child_support_paid';
        } else if (data.livingSituation.separatedParents.childSupportPaid === 'no') {
            fields['child_support_paid_no'] = '/child_support_paid';
        }
      }
    }

    // ============================================
    // 4. Enfants
    // ============================================
    if (data.children && Array.isArray(data.children)) {
      data.children.slice(0, 5).forEach((child, index) => {
        const i = index + 1; // 1 to 5
        fields[`child_name_surname_${i}`] = onStr(child.nameSurname);
        fields[`child_born_place_${i}`] = onStr(child.bornPlace);
        fields[`child_born_date_${i}`] = onStr(child.bornDate);
        fields[`child_date_arrival_${i}`] = onStr(child.dateArrival);
        fields[`child_arrival_relation_${i}`] = onStr(child.arrivalRelation);
        fields[`child_current_status_${i}`] = onStr(child.currentStatus);
        fields[`child_abroad_residence_${i}`] = chkStr(child.abroadResidence);
        fields[`child_alternating_residence_${i}`] = chkStr(child.alternatingResidence);
      });
    }

    // ============================================
    // 5. Situation Parents (Mineur/Moins 25 ans)
    // ============================================
    if (data.parentAlloc) {
      if (data.parentAlloc.benefits === 'yes') fields['parent_alloc_benefits_radio_yes'] = '/parent_alloc_benefits_radio';
      if (data.parentAlloc.benefits === 'no') fields['parent_alloc_benefits_radio_no'] = '/parent_alloc_benefits_radio';
      fields['parent_alloc_name'] = onStr(data.parentAlloc.name);
      fields['parent_alloc_surname'] = onStr(data.parentAlloc.surname);
      fields['parent_alloc_address'] = onStr(data.parentAlloc.address);
      fields['parent_alloc_zip'] = onStr(data.parentAlloc.zip);
      fields['parent_alloc_city'] = onStr(data.parentAlloc.city);
      fields['parent_alloc_organism_name'] = onStr(data.parentAlloc.organismName);
      fields['parent_alloc_number'] = onStr(data.parentAlloc.numberFolder);
      fields['parent_alloc_social_security_number'] = onStr(data.parentAlloc.socialSecurityNumber);
    }
    
    if (data.parentPartner) {
      if (data.parentPartner.benefits === 'yes') fields['parent_partner_benefits_radio_yes'] = '/parent_partner_benefits_radio';
      if (data.parentPartner.benefits === 'no') fields['parent_partner_benefits_radio_no'] = '/parent_partner_benefits_radio';
      fields['parent_partner_name'] = onStr(data.parentPartner.name);
      fields['parent_partner_surname'] = onStr(data.parentPartner.surname);
      fields['parent_partner_address'] = onStr(data.parentPartner.address);
      fields['parent_partner_zip'] = onStr(data.parentPartner.zip);
      fields['parent_partner_city'] = onStr(data.parentPartner.city);
      fields['parent_partner_organism_name'] = onStr(data.parentPartner.organismName);
      fields['parent_partner_number'] = onStr(data.parentPartner.numberFolder);
      fields['parent_partner_social_security_number'] = onStr(data.parentPartner.socialSecurityNumber);
    }

    // ============================================
    // Helper pour générer le bloc Job
    // ============================================
    const mapJobParams = (jobData: JobData, prefix: 'alloc' | 'partner') => {
      // Les différents champs statuts :
      if (jobData.employee?.active) {
        fields[`${prefix}_job_employee_check`] = '/Yes';
        fields[`${prefix}_job_employee_since`] = onStr(jobData.employee.since);
        fields[`${prefix}_job_employee_contract_type`] = onStr(jobData.employee.contractType);
      }
      if (jobData.apprentice?.active) {
        fields[`${prefix}_job_apprentice_check`] = '/Yes';
        fields[`${prefix}_job_apprentice_since`] = onStr(jobData.apprentice.since);
        fields[`${prefix}_job_apprentice_end_date`] = onStr(jobData.apprentice.endDate);
      }
      if (jobData.trainee?.active) {
        fields[`${prefix}_job_trainee_check`] = '/Yes';
        fields[`${prefix}_job_trainee_since`] = onStr(jobData.trainee.since);
      }
      if (jobData.selfEmployed?.active) {
        fields[`${prefix}_job_self_employed_check`] = '/Yes';
        fields[`${prefix}_job_self_employed_since`] = onStr(jobData.selfEmployed.since);
      }
      if (jobData.agricultural?.active) {
        fields[`${prefix}_job_agricultural_check`] = '/Yes';
        fields[`${prefix}_job_agricultural_since`] = onStr(jobData.agricultural.since);
      }
      if (jobData.autoEntrepreneur?.active) {
        fields[`${prefix}_job_auto_entrepreneur_check`] = '/Yes';
        fields[`${prefix}_job_auto_entrepreneur_since`] = onStr(jobData.autoEntrepreneur.since);
      }
      if (jobData.collaboratingSpouse?.active) {
        fields[`${prefix}_job_collaborating_spouse_check`] = '/Yes';
        fields[`${prefix}_job_collaborating_spouse_since`] = onStr(jobData.collaboratingSpouse.since);
      }
      if (jobData.unemployed?.active) {
        fields[`${prefix}_job_unemployed_check`] = '/Yes';
        fields[`${prefix}_job_unemployed_since`] = onStr(jobData.unemployed.since);
        fields[`${prefix}_job_unemployed_organism`] = onStr(jobData.unemployed.organism);
        if (jobData.unemployed.partial === 'yes') fields[`${prefix}_job_unemployed_partial_yes`] = `/${prefix}_job_unemployed_partial`;
        if (jobData.unemployed.partial === 'no') fields[`${prefix}_job_unemployed_partial_no`] = `/${prefix}_job_unemployed_partial`;
      }
      if (jobData.retired?.active) {
        fields[`${prefix}_job_retired_check`] = '/Yes';
        fields[`${prefix}_job_retired_since`] = onStr(jobData.retired.since);
        fields[`${prefix}_job_retired_regime_details`] = onStr(jobData.retired.regimeDetails);
      }
      if (jobData.sickLeave?.active) {
        fields[`${prefix}_job_sick_leave_check`] = '/Yes';
        fields[`${prefix}_job_sick_leave_since`] = onStr(jobData.sickLeave.since);
      }
      if (jobData.student?.active) {
        fields[`${prefix}_job_student_check`] = '/Yes';
        fields[`${prefix}_job_student_since`] = onStr(jobData.student.since);
      }
      if (jobData.noActivity?.active) {
        fields[`${prefix}_job_no_activity_check`] = '/Yes';
        fields[`${prefix}_job_no_activity_since`] = onStr(jobData.noActivity.since);
        fields[`${prefix}_job_no_activity_always`] = chkStr(jobData.noActivity.always);
      }
      if (jobData.otherCase?.active) {
        fields[`${prefix}_job_other_case_check`] = '/Yes';
        fields[`${prefix}_job_other_case_since`] = onStr(jobData.otherCase.since);
        fields[`${prefix}_job_other_case_details`] = onStr(jobData.otherCase.details);
        fields[`${prefix}_job_other_case_establishment`] = onStr(jobData.otherCase.establishment);
      }

      // Details employeur & regime
      fields[`${prefix}_job_employer_name`] = onStr(jobData.employerName);
      fields[`${prefix}_job_employer_address`] = onStr(jobData.employerAddress);

      if (jobData.taxRegime === 'urssaf') fields[`${prefix}_job_tax_regime_urssaf`] = '/Yes';
      if (jobData.taxRegime === 'msa') fields[`${prefix}_job_tax_regime_msa`] = '/Yes';
      if (jobData.taxRegime === 'other') fields[`${prefix}_job_tax_regime_other`] = '/Yes';
      if (jobData.taxRegime === 'abroad') fields[`${prefix}_job_tax_regime_abroad`] = '/Yes';

      fields[`${prefix}_job_tax_regime_other_details`] = onStr(jobData.taxRegimeOtherDetails);
      fields[`${prefix}_job_tax_regime_abroad_country`] = onStr(jobData.taxRegimeAbroadCountry);
      fields[`${prefix}_job_foreign_pension_organism_country`] = onStr(jobData.foreignPensionOrganismCountry);
    };

    // ============================================
    // 6. Situations Professionnelles 
    // ============================================
    if (data.allocJob) mapJobParams(data.allocJob, 'alloc');
    if (data.partnerJob) mapJobParams(data.partnerJob, 'partner');

    // ============================================
    // 8. Signatures
    // ============================================
    if (data.signature) {
      fields['done_at'] = onStr(data.signature.doneAt);
      fields['done_date'] = onStr(data.signature.doneDate);
      fields['done_nom_surname_quality_address'] = onStr(data.signature.doneNomSurnameQualityAddress);
      fields['signature'] = chkStr(data.signature.signed);
    }

    return fields;
  }
};
