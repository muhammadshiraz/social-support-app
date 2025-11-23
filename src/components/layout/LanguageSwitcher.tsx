import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === "ar" ? "ar" : "en";

  const handleChange = (lang: "en" | "ar") => {
    if (lang === currentLang) return;

    i18n.changeLanguage(lang);

    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        p: 0.5,
        bgcolor: "rgba(15,23,42,0.08)",
      }}
    >
      <Button
        size="small"
        onClick={() => handleChange("en")}
        sx={{
          minWidth: 40,
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          textTransform: "uppercase",
          fontWeight: currentLang === "en" ? 700 : 500,
          fontSize: 12,
          bgcolor: currentLang === "en" ? "primary.main" : "transparent",
          color:
            currentLang === "en" ? "primary.contrastText" : "text.secondary",
          "&:hover": {
            bgcolor:
              currentLang === "en" ? "primary.dark" : "rgba(148,163,184,0.2)",
          },
        }}
      >
        EN
      </Button>

      <Button
        size="small"
        onClick={() => handleChange("ar")}
        sx={{
          minWidth: 40,
          px: 1.5,
          py: 0.5,
          borderRadius: 999,
          textTransform: "uppercase",
          fontWeight: currentLang === "ar" ? 700 : 500,
          fontSize: 12,
          bgcolor: currentLang === "ar" ? "primary.main" : "transparent",
          color:
            currentLang === "ar" ? "primary.contrastText" : "text.secondary",
          "&:hover": {
            bgcolor:
              currentLang === "ar" ? "primary.dark" : "rgba(148,163,184,0.2)",
          },
        }}
      >
        AR
      </Button>
    </Box>
  );
};
