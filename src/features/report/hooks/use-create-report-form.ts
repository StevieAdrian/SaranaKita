import { useCallback, useState } from 'react';
import { ApiError, toUserMessage } from '@/services/api';
import { createReport } from '@/services/report';
import { uploadReportImage } from '@/services/upload';
import { toIsoDate } from '@/shared/utils/date';
import type { ReportFormErrors, ReportFormValues } from '../types';
import { hasErrors, validateReportForm } from '../utils/validation';

export type SubmitResult = { ok: true } | { ok: false; message: string };

function getServerMessage(error: unknown): string | null {
  if (
    !(error instanceof ApiError) ||
    error.status === 401 ||
    error.status >= 500
  ) {
    return null;
  }
  const body = error.body as { error?: unknown } | null;
  if (typeof body?.error === 'string') {
    return body.error;
  }
  const nested = (body?.error as { message?: unknown } | undefined)?.message;
  if (typeof nested === 'string') {
    return nested;
  }
  return null;
}

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
  setField: <K extends keyof ReportFormValues>(
    key: K,
    value: ReportFormValues[K],
  ) => void;
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
    if (!values.categoryId) {
      return { ok: false, message: 'Pilih kategori.' };
    }
    setSubmitting(true);
    try {
      const image = values.photo ? await uploadReportImage(values.photo) : null;
      await createReport({
        title: values.title.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        categoryId: values.categoryId,
        brokenDate: toIsoDate(values.incidentDate),
        imageUrl: image?.url,
        imagePublicId: image?.publicId,
      });
      setConfirmVisible(false);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: getServerMessage(error) ?? toUserMessage(error),
      };
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
