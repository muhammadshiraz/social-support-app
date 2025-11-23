import React from "react";
import { Box, Container, Paper, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #111827 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2.5, sm: 3 },
              py: 2.5,
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(56,189,248,0.12))",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t("app.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("app.subtitle")}
              </Typography>
            </Box>

            <LanguageSwitcher />
          </Box>

          <Divider />

          {/* Content */}
          <Box
            sx={{
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 2.5, sm: 3.5 },
            }}
          >
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
