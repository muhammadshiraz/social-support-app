export interface PersonalInformation {
    name: string;
    nationalId: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | '';
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  }
  
  export interface FamilyFinancialInformation {
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | '';
    dependents: number | null;
    employmentStatus: 'employed' | 'unemployed' | 'selfEmployed' | 'retired' | 'student' | '';
    monthlyIncome: number | null;
    housingStatus: 'rent' | 'own' | 'withFamily' | 'other' | '';
  }
  
  export interface SituationDescriptions {
    currentFinancialSituation: string;
    employmentCircumstances: string;
    reasonForApplying: string;
  }
  
  export interface ApplicationFormData {
    personal: PersonalInformation;
    familyFinancial: FamilyFinancialInformation;
    situations: SituationDescriptions;
  }
  
  export type ApplicationStep = 1 | 2 | 3;
  