import { useCallback, useState } from 'react';
import type { ReportFormErrors, ReportFormValues } from '../types';
import { hasErrors, validateReportForm } from '../utils/validation';

const createInitialValues = (): ReportFormValues => ({
  photo: null,
  title: '',
  description: '',
  categoryId: null,
  locationId: null,
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
  confirmSubmit: () => Promise<boolean>;
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

  const confirmSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // TODO: call the create-report API with `values`.
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setConfirmVisible(false);
      return true;
    } finally {
      setSubmitting(false);
    }
  }, []);

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
