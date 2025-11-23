import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Layout } from "./components/layout/Layout";
import { ProgressStepper } from "./components/ProgressStepper";
import { useApplicationForm } from "./context/ApplicationFormContext";
import { Step1PersonalInformation } from "./components/steps/Step1PersonalInformation";
import { Step2FamilyFinancialInformation } from "./components/steps/Step2FamilyFinancialInformation";
import { Step3SituationDescriptions } from "./components/steps/Step3SituationDescriptions";

const App: React.FC = () => {
  const { t } = useTranslation();
  const { step, setStep, reset } = useApplicationForm();

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string | null
  >(null);

  const handleMockSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (Math.random() < 0.05) {
        throw new Error("Random simulated network failure");
      }

      setSuccessOpen(true);
      reset();
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmissionErrorMessage(
        err?.message || (t("submission.errorMessage") as string)
      );
      setErrorOpen(true);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PersonalInformation onNext={() => setStep(2)} />;
      case 2:
        return (
          <Step2FamilyFinancialInformation
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3SituationDescriptions
            onBack={() => setStep(2)}
            onSubmitApplication={handleMockSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <ProgressStepper step={step} />
      {renderStep()}

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          <strong>{t("submission.successTitle")}</strong> —{" "}
          {t("submission.successMessage")}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          <strong>{t("submission.errorTitle")}</strong> —{" "}
          {submissionErrorMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default App;
