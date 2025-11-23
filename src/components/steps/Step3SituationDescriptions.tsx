import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import type { SituationDescriptions } from "../../types/application";
import { AiAssistButton } from "../ai/AiAssistButton";

interface Props {
  onBack: () => void;
  onSubmitApplication: () => Promise<void>;
}

export const Step3SituationDescriptions: React.FC<Props> = ({
  onBack,
  onSubmitApplication,
}) => {
  const { t } = useTranslation();
  const { data, updateData } = useApplicationForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SituationDescriptions>({
    defaultValues: data.situations,
  });

  const currentFinancialSituation = watch("currentFinancialSituation");
  const employmentCircumstances = watch("employmentCircumstances");
  const reasonForApplying = watch("reasonForApplying");

  useEffect(() => {
    reset(data.situations);
  }, [data.situations, reset]);

  const onSubmit = async (values: SituationDescriptions) => {
    updateData({ situations: values });
    await onSubmitApplication();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {t("step3.aiExplanation")}
      </Typography>

      {/* Vertical stack of the three fields */}
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Current Financial Situation */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography component="label" htmlFor="currentFinancialSituation">
              {t("step3.currentFinancialSituation")}
            </Typography>
            <AiAssistButton
              fieldKey="currentFinancialSituation"
              fieldLabel={t("step3.currentFinancialSituation") as string}
              currentValue={currentFinancialSituation}
              onApplySuggestion={(val) =>
                setValue("currentFinancialSituation", val, {
                  shouldDirty: true,
                })
              }
            />
          </Box>
          <TextField
            id="currentFinancialSituation"
            multiline
            minRows={4}
            fullWidth
            {...register("currentFinancialSituation", {
              required: t("validation.required") as string,
            })}
            error={!!errors.currentFinancialSituation}
            helperText={errors.currentFinancialSituation?.message}
          />
        </Box>

        {/* Employment Circumstances */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography component="label" htmlFor="employmentCircumstances">
              {t("step3.employmentCircumstances")}
            </Typography>
            <AiAssistButton
              fieldKey="employmentCircumstances"
              fieldLabel={t("step3.employmentCircumstances") as string}
              currentValue={employmentCircumstances}
              onApplySuggestion={(val) =>
                setValue("employmentCircumstances", val, { shouldDirty: true })
              }
            />
          </Box>
          <TextField
            id="employmentCircumstances"
            multiline
            minRows={4}
            fullWidth
            {...register("employmentCircumstances", {
              required: t("validation.required") as string,
            })}
            error={!!errors.employmentCircumstances}
            helperText={errors.employmentCircumstances?.message}
          />
        </Box>

        {/* Reason for Applying */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography component="label" htmlFor="reasonForApplying">
              {t("step3.reasonForApplying")}
            </Typography>
            <AiAssistButton
              fieldKey="reasonForApplying"
              fieldLabel={t("step3.reasonForApplying") as string}
              currentValue={reasonForApplying}
              onApplySuggestion={(val) =>
                setValue("reasonForApplying", val, { shouldDirty: true })
              }
            />
          </Box>
          <TextField
            id="reasonForApplying"
            multiline
            minRows={4}
            fullWidth
            {...register("reasonForApplying", {
              required: t("validation.required") as string,
            })}
            error={!!errors.reasonForApplying}
            helperText={errors.reasonForApplying?.message}
          />
        </Box>
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          {t("navigation.back")}
        </Button>
        <Button variant="contained" type="submit">
          {t("navigation.submit")}
        </Button>
      </Box>
    </form>
  );
};
