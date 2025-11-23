import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { generateAiText, AiError } from "../../api/openaiClient";
import { AiSuggestionDialog } from "./AiSuggestionDialog";

interface Props {
  fieldKey: string;
  fieldLabel: string;
  currentValue: string;
  onApplySuggestion: (value: string) => void;
  additionalContext?: string;
}

export const AiAssistButton: React.FC<Props> = ({  
  fieldLabel,
  currentValue,
  onApplySuggestion,
  additionalContext,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    setSuggestion("");

    try {
      const text = await generateAiText({
        fieldKey: fieldLabel,
        userInput: currentValue,
        additionalContext,
      });
      setSuggestion(text);
    } catch (e: any) {
      if (e instanceof AiError) {
        setError(e.message);
      } else {
        setError(
          (t("ai.error") as string) ||
            "Unable to generate a suggestion right now. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const handleAccept = () => {
    onApplySuggestion(suggestion);
    setOpen(false);
  };

  const handleAcceptAndEdit = () => {
    onApplySuggestion(suggestion);
    setOpen(false);
  };

  const handleDiscard = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("step3.helpMeWrite")}>
        <Button
          variant="contained"
          size="small"
          onClick={handleClick}
          sx={{
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "20px",
            px: 1.8,
            py: 0.4,
            lineHeight: 1.3,
            background: "linear-gradient(135deg, #6366f1, #3b82f6)",
            color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5, #2563eb)",
              boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
            },
          }}
        >
          {t("step3.helpMeWrite")}
        </Button>
      </Tooltip>

      <AiSuggestionDialog
        open={open}
        loading={loading}
        error={error}
        value={suggestion}
        onClose={handleClose}
        onAccept={handleAccept}
        onAcceptAndEdit={handleAcceptAndEdit}
        onEditChange={setSuggestion}
        onDiscard={handleDiscard}
      />
    </>
  );
};
