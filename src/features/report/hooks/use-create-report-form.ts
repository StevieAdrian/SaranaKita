import { useCallback, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { uploadReportImage } from '@/services/upload';
import type { ReportFormErrors, ReportFormValues } from '../types';
import { hasErrors, validateReportForm } from '../utils/validation';

export type SubmitResult = { ok: true } | { ok: false; message: string };

const createInitialValues = (): ReportFormValues => ({
  photo: null,
  title: '',
  description: '',
  categoryId: null,
  location: '',
  incidentDate: new Date(),
});

export type UseCreateReportForm = {
  readonly values: ReportFormValues;
  readonly errors: ReportFormErrors;
  readonly confirmVisible: boolean;
  readonly submitting: boolean;
  setField: <K extends keyof ReportFormValues>(key: K, value: ReportFormValues[K]) => void;
  requestSubmit: () => void;
  cancelSubmit: () => void;
  confirmSubmit: () => Promise<SubmitResult>;
  reset: () => void;
};

export function useCreateReportForm(): UseCreateReportForm {
  const [values, setValues] = useState<ReportFormValues>(createInitialValues);
  const [errors, setErrors] = useState<ReportFormErrors>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(
    <K extends keyof ReportFormValues>(key: K, value: ReportFormValues[K]) => {
      setValues(prev => ({ ...prev, [key]: value }));
      setErrors(prev => {
        if (!prev[key]) {
          return prev;
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const requestSubmit = useCallback(() => {
    const nextErrors = validateReportForm(values);
    setErrors(nextErrors);
    if (!hasErrors(nextErrors)) {
      setConfirmVisible(true);
    }
  }, [values]);

  const cancelSubmit = useCallback(() => setConfirmVisible(false), []);

  const confirmSubmit = useCallback(async (): Promise<SubmitResult> => {
    setSubmitting(true);
    try {
      if (values.photo) {
        await uploadReportImage(values.photo);
      }
      setConfirmVisible(false);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: toUserMessage(error) };
    } finally {
      setSubmitting(false);
    }
  }, [values]);

  const reset = useCallback(() => {
    setValues(createInitialValues());
    setErrors({});
  }, []);

  return {
    values,
    errors,
    confirmVisible,
    submitting,
    setField,
    requestSubmit,
    cancelSubmit,
    confirmSubmit,
    reset,
  };
}
