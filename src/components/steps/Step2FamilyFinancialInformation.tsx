import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import type { FamilyFinancialInformation } from "../../types/application";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const Step2FamilyFinancialInformation: React.FC<Props> = ({
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();
  const { data, updateData } = useApplicationForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FamilyFinancialInformation>({
    defaultValues: data.familyFinancial,
  });

  useEffect(() => {
    reset(data.familyFinancial);
  }, [data.familyFinancial, reset]);

  const onSubmit = (values: FamilyFinancialInformation) => {
    const parsed: FamilyFinancialInformation = {
      ...values,
      dependents:
        values.dependents !== null && values.dependents !== undefined
          ? Number(values.dependents)
          : null,
      monthlyIncome:
        values.monthlyIncome !== null && values.monthlyIncome !== undefined
          ? Number(values.monthlyIncome)
          : null,
    };

    updateData({ familyFinancial: parsed });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {/* Marital Status */}
        <Box>
          <TextField
            select
            label={t("step2.maritalStatus")}
            fullWidth
            SelectProps={{ native: true }}
            {...register("maritalStatus", {
              required: t("validation.required") as string,
            })}
            error={!!errors.maritalStatus}
            helperText={errors.maritalStatus?.message}
          >
            <option value="" />
            <option value="single">{t("step2.maritalSingle")}</option>
            <option value="married">{t("step2.maritalMarried")}</option>
            <option value="divorced">{t("step2.maritalDivorced")}</option>
            <option value="widowed">{t("step2.maritalWidowed")}</option>
          </TextField>
        </Box>

        {/* Dependents */}
        <Box>
          <TextField
            type="number"
            label={t("step2.dependents")}
            fullWidth
            inputProps={{ min: 0 }}
            {...register("dependents", {
              required: t("validation.required") as string,
              min: { value: 0, message: t("validation.number") as string },
            })}
            error={!!errors.dependents}
            helperText={errors.dependents?.message}
          />
        </Box>

        {/* Employment Status */}
        <Box>
          <TextField
            select
            label={t("step2.employmentStatus")}
            fullWidth
            SelectProps={{ native: true }}
            {...register("employmentStatus", {
              required: t("validation.required") as string,
            })}
            error={!!errors.employmentStatus}
            helperText={errors.employmentStatus?.message}
          >
            <option value="" />
            <option value="employed">{t("step2.employmentEmployed")}</option>
            <option value="unemployed">
              {t("step2.employmentUnemployed")}
            </option>
            <option value="selfEmployed">
              {t("step2.employmentSelfEmployed")}
            </option>
            <option value="retired">{t("step2.employmentRetired")}</option>
            <option value="student">{t("step2.employmentStudent")}</option>
          </TextField>
        </Box>

        {/* Monthly Income */}
        <Box>
          <TextField
            type="number"
            label={t("step2.monthlyIncome")}
            fullWidth
            inputProps={{ min: 0 }}
            {...register("monthlyIncome", {
              required: t("validation.required") as string,
              min: { value: 0, message: t("validation.number") as string },
            })}
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome?.message}
          />
        </Box>

        {/* Housing Status */}
        <Box>
          <TextField
            select
            label={t("step2.housingStatus")}
            fullWidth
            SelectProps={{ native: true }}
            {...register("housingStatus", {
              required: t("validation.required") as string,
            })}
            error={!!errors.housingStatus}
            helperText={errors.housingStatus?.message}
          >
            <option value="" />
            <option value="rent">{t("step2.housingRent")}</option>
            <option value="own">{t("step2.housingOwn")}</option>
            <option value="withFamily">{t("step2.housingWithFamily")}</option>
            <option value="other">{t("step2.housingOther")}</option>
          </TextField>
        </Box>
      </Box>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          {t("navigation.back")}
        </Button>
        <Button variant="contained" type="submit">
          {t("navigation.next")}
        </Button>
      </Box>
    </form>
  );
};
