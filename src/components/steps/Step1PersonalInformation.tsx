import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useApplicationForm } from "../../context/ApplicationFormContext";
import type { PersonalInformation } from "../../types/application";

interface Props {
  onNext: () => void;
}

export const Step1PersonalInformation: React.FC<Props> = ({ onNext }) => {
  const { t } = useTranslation();
  const { data, updateData } = useApplicationForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInformation>({
    defaultValues: data.personal,
  });

  useEffect(() => {
    reset(data.personal);
  }, [data.personal, reset]);

  const today = new Date();
  const adultCutoff = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const adultCutoffStr = adultCutoff.toISOString().split("T")[0];

  const onSubmit = (values: PersonalInformation) => {
    updateData({ personal: values });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        display="grid"
        gap={2}        
        gridTemplateColumns={{
          xs: "1fr",
          sm: 'repeat(2, minmax(0, 1fr))',
          md: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {/* Full-width: name */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextField
            label={t("step1.name")}
            fullWidth
            {...register("name", {
              required: t("validation.required") as string,
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Box>

        {/* National ID */}
        <Box>
          <TextField
            label={t("step1.nationalId")}
            fullWidth
            {...register("nationalId", {
              required: t("validation.required") as string,
            })}
            error={!!errors.nationalId}
            helperText={errors.nationalId?.message}
          />
        </Box>

        {/* Date of Birth – must be 18+ */}
        <Box>
          <TextField
            type="date"
            label={t("step1.dateOfBirth")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: adultCutoffStr }}
            {...register("dateOfBirth", {
              required: t("validation.required") as string,
              validate: (value) => {
                if (!value) return t("validation.required") as string;
                const dob = new Date(value);
                if (Number.isNaN(dob.getTime())) {
                  return (t("validation.date") as string) || "Invalid date";
                }
                if (dob > adultCutoff) {
                  // younger than 18
                  return (
                    (t("validation.minAge") as string) ||
                    "You must be at least 18 years old."
                  );
                }
                return true;
              },
            })}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
          />
        </Box>

        {/* Gender */}
        <Box>
          <TextField
            select
            label={t("step1.gender")}
            fullWidth
            SelectProps={{ native: true }}
            {...register("gender", {
              required: t("validation.required") as string,
            })}
            error={!!errors.gender}
            helperText={errors.gender?.message}
          >
            <option value="" />
            <option value="male">{t("step1.genderMale")}</option>
            <option value="female">{t("step1.genderFemale")}</option>
          </TextField>
        </Box>

        {/* Phone */}
        <Box>
          <TextField
            label={t("step1.phone")}
            fullWidth
            {...register("phone", {
              required: t("validation.required") as string,
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Box>

        {/* Full-width: email */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextField
            label={t("step1.email")}
            fullWidth
            {...register("email", {
              required: t("validation.required") as string,
              pattern: {
                value: /^\S+@\S+$/i,
                message: t("validation.email") as string,
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>

        {/* Full-width: address */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextField
            label={t("step1.address")}
            fullWidth
            {...register("address", {
              required: t("validation.required") as string,
            })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
        </Box>

        {/* City */}
        <Box>
          <TextField
            label={t("step1.city")}
            fullWidth
            {...register("city", {
              required: t("validation.required") as string,
            })}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Box>

        {/* State */}
        <Box>
          <TextField
            label={t("step1.state")}
            fullWidth
            {...register("state", {
              required: t("validation.required") as string,
            })}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        </Box>

        {/* Country */}
        <Box>
          <TextField
            label={t("step1.country")}
            fullWidth
            {...register("country", {
              required: t("validation.required") as string,
            })}
            error={!!errors.country}
            helperText={errors.country?.message}
          />
        </Box>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" type="submit">
          {t("navigation.next")}
        </Button>
      </Box>
    </form>
  );
};
