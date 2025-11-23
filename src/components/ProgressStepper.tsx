import React from "react";
import { Stepper, Step, StepLabel, Box, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ApplicationStep } from "../types/application";

interface Props {
  step: ApplicationStep;
}

export const ProgressStepper: React.FC<Props> = ({ step }) => {
  const { t } = useTranslation();
  const steps = [1, 2, 3] as ApplicationStep[];

  const progress = (step / steps.length) * 100;

  return (
    <Box mb={3} sx={{ width: "100%" }}>
      {/* Force the stepper layout to LTR so the line doesn’t run out of the box in RTL */}
      <Box dir="ltr" sx={{ width: "100%", overflow: "hidden" }}>
        <Stepper
          activeStep={step - 1}
          alternativeLabel
          sx={{
            width: "100%",
            px: { xs: 0, sm: 1 },
          }}
        >
          {steps.map((s) => (
            <Step key={s}>
              <StepLabel>{t(`steps.${s}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box mt={2}>
        <LinearProgress
          variant="determinate"
          value={progress}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("steps.progressAria") as string}
          sx={{
            height: 8,
            borderRadius: 999,
          }}
        />
      </Box>
    </Box>
  );
};
