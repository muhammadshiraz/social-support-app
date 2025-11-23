import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import "./styles.css";
import "./i18n";
import { ApplicationFormProvider } from "./context/ApplicationFormContext";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0b4f75",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

document.documentElement.lang = "en";
document.documentElement.dir = "ltr";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <ApplicationFormProvider>
          <App />
        </ApplicationFormProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);
