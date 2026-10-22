import { useCallback, useState } from 'react';
import { createReportEvaluasi } from '@/services/report/feed.api';
import { EvaluationRating } from '..';

type UseReportEvaluasiOptions = {
  onSuccess?: () => void | Promise<void>;
};

export function useReportEvaluasi({
  onSuccess,
}: UseReportEvaluasiOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEvaluasi = useCallback(
    async (reportId: string, rate: EvaluationRating, notes: string) => {
      const trimmedNotes = notes.trim();

      if (rate < 1 || rate > 5) {
        throw new Error('Rating harus antara 1–5 bintang.');
      }

      if (trimmedNotes.length < 10 || trimmedNotes.length > 300) {
        throw new Error('Catatan evaluasi harus terdiri dari 10–300 karakter.');
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await createReportEvaluasi(reportId, {
          rate,
          notes: trimmedNotes,
        });

        await onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Gagal menyimpan evaluasi. Silakan coba lagi.';

        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    submitEvaluasi,
    isSubmitting,
    error,
    clearError,
  };
}
