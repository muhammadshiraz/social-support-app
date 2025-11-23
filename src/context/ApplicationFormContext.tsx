import React, { createContext, useContext, useMemo } from 'react';
import type { ApplicationFormData, ApplicationStep } from '../types/application';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ApplicationFormContextValue {
  data: ApplicationFormData;
  step: ApplicationStep;
  updateData: (partial: Partial<ApplicationFormData>) => void;
  setStep: (step: ApplicationStep) => void;
  reset: () => void;
}

const ApplicationFormContext = createContext<ApplicationFormContextValue | undefined>(
  undefined
);

const initialData: ApplicationFormData = {
  personal: {
    name: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  familyFinancial: {
    maritalStatus: '',
    dependents: null,
    employmentStatus: '',
    monthlyIncome: null,
    housingStatus: '',
  },
  situations: {
    currentFinancialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
};

interface Props {
  children: React.ReactNode;
}

export const ApplicationFormProvider: React.FC<Props> = ({ children }) => {
  const [stored, setStored] = useLocalStorage<{
    data: ApplicationFormData;
    step: ApplicationStep;
  }>('socialSupportApp', {
    data: initialData,
    step: 1,
  });

  const updateData = (partial: Partial<ApplicationFormData>) => {
    setStored((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        ...partial,
      },
    }));
  };

  const setStep = (step: ApplicationStep) => {
    setStored((prev) => ({
      ...prev,
      step,
    }));
  };

  const reset = () => {
    setStored({
      data: initialData,
      step: 1,
    });
  };

  const value: ApplicationFormContextValue = useMemo(
    () => ({
      data: stored.data,
      step: stored.step,
      updateData,
      setStep,
      reset,
    }),
    [stored, updateData, setStep]
  );

  return (
    <ApplicationFormContext.Provider value={value}>
      {children}
    </ApplicationFormContext.Provider>
  );
};

export const useApplicationForm = () => {
  const ctx = useContext(ApplicationFormContext);
  if (!ctx) throw new Error('useApplicationForm must be used within provider');
  return ctx;
};
