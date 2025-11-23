import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  loading: boolean;
  error?: string | null;
  value: string;
  onClose: () => void;
  onAccept: () => void;
  onEditChange: (value: string) => void;
  onAcceptAndEdit: () => void;
  onDiscard: () => void;
}

export const AiSuggestionDialog: React.FC<Props> = ({
  open,
  loading,
  error,
  value,
  onClose,
  onAccept,
  onEditChange,
  onAcceptAndEdit,
  onDiscard,
}) => {
  const { t } = useTranslation();

  const disabled = loading || !value;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby="ai-dialog-title"
    >
      <DialogTitle id="ai-dialog-title">{t("ai.dialogTitle")}</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <CircularProgress size={20} />
            <span>{t("ai.loading")}</span>
          </Box>
        )}
        {error && (
          <Box mb={2}>
            <Alert severity="error">{t("ai.error")}</Alert>
          </Box>
        )}
        <TextField
          label={t("step3.helpMeWrite")}
          multiline
          minRows={6}
          fullWidth
          value={value}
          onChange={(e) => onEditChange(e.target.value)}
          placeholder={t("ai.placeholder") as string}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDiscard}>{t("ai.discard")}</Button>
        <Button onClick={onAcceptAndEdit} disabled={disabled}>
          {t("ai.acceptEdit")}
        </Button>
        <Button onClick={onAccept} variant="contained" disabled={disabled}>
          {t("ai.accept")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
