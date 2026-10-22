import { useCallback, useState } from 'react';
import type { ReportNoteMode } from '../types';
import {
  createReportNote,
  deleteReportNote,
  updateReportNote,
} from '@/services/report/feed.api';

type UseReportNoteOptions = {
  onSuccess?: () => void | Promise<void>;
};

export function useReportNote({ onSuccess }: UseReportNoteOptions = {}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveNote = useCallback(
    async (reportId: string, noteText: string, mode: ReportNoteMode) => {
      const text = noteText.trim();

      if (text.length < 10 || text.length > 300) {
        const message = 'Catatan harus terdiri dari 10–300 karakter.';
        setError(message);
        throw new Error(message);
      }

      setIsSaving(true);
      setError(null);

      try {
        if (mode === 'create') {
          await createReportNote(reportId, text);
        } else {
          await updateReportNote(reportId, text);
        }

        await onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal menyimpan catatan. Silakan coba lagi.';

        setError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [onSuccess],
  );

  const removeNote = useCallback(
    async (reportId: string) => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteReportNote(reportId);
        await onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal menghapus catatan. Silakan coba lagi.';

        setError(message);
        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [onSuccess],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    saveNote,
    removeNote,
    isSaving,
    isDeleting,
    error,
    clearError,
  };
}
